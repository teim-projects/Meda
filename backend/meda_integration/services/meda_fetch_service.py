import logging
import time
import requests
from django.utils import timezone
from meda_integration.models import ApiRequestLog
from meda_integration.services.meda_auth_service import MedaAuthService

logger = logging.getLogger(__name__)

FETCH_CREDIT_NOTES_URL = "https://nvp.mahadiscom.in/nce-meda-data-api-1.0-SNAPSHOT/api/credit-notes"

class MedaFetchService:
    @classmethod
    def fetch_month_data(cls, month_str, sync_job=None):
        """
        Fetches MEDA Credit Notes for a single month string (format: MM-YYYY e.g., '01-2026').
        Automatically uses stored JWT and auto-renews login if expired.
        Logs every request into ApiRequestLog.
        """
        try:
            # Ensure valid JWT and Static Token from Auth Service
            jwt_token, static_token = MedaAuthService.get_valid_jwt()
            logger.info(f"Using JWT (first 50 chars): {jwt_token[:50]}...")
            logger.info(f"Using Static Token (first 10 chars): {static_token[:10]}...")
        except Exception as e:
            logger.error(f"Failed to get valid JWT: {e}")
            raise

        headers = {
            "X-API-TOKEN": static_token,
            "X-USER-API-KEY": jwt_token,
            "Accept": "application/json",
        }
        params = {
            "month": month_str
        }

        url = f"{FETCH_CREDIT_NOTES_URL}?month={month_str}"
        start_time = time.time()
        
        response_status = None
        records_received = 0
        error_message = None
        raw_data = None

        try:
            logger.info(f"Fetching MEDA credit notes for month: {month_str}")
            logger.info(f"Request Headers: X-API-TOKEN={static_token[:10]}..., X-USER-API-KEY={jwt_token[:50]}...")
            
            response = requests.get(FETCH_CREDIT_NOTES_URL, headers=headers, params=params, timeout=60)
            elapsed_time = round(time.time() - start_time, 3)
            response_status = response.status_code
            
            logger.info(f"Response Status: {response_status}")
            logger.info(f"Response Body (first 500 chars): {response.text[:500]}")

            # Handle 401 Unauthorized (Force re-login and retry once)
            if response_status == 401:
                logger.warning(f"401 Unauthorized received for month {month_str}. Attempting force re-login...")
                
                try:
                    # Get stored credentials
                    credentials = MedaAuthService.get_session_credentials()
                    logger.info(f"Retrieved credentials for user: {credentials['user_id']}")
                    
                    # Re-login with stored credentials
                    new_session = MedaAuthService.connect_meda(
                        static_token=credentials['static_token'],
                        user_id=credentials['user_id'],
                        password=credentials['password']
                    )
                    
                    logger.info(f"Re-login successful. New JWT (first 50 chars): {new_session.jwt_token[:50]}...")
                    
                    # Update headers with new JWT
                    headers["X-USER-API-KEY"] = new_session.jwt_token
                    headers["X-API-TOKEN"] = credentials['static_token']
                    
                    # Retry the request
                    start_time = time.time()
                    response = requests.get(FETCH_CREDIT_NOTES_URL, headers=headers, params=params, timeout=60)
                    elapsed_time = round(time.time() - start_time, 3)
                    response_status = response.status_code
                    
                    logger.info(f"Retry Response Status: {response_status}")
                    logger.info(f"Retry Response Body (first 500 chars): {response.text[:500]}")
                    
                except Exception as e:
                    logger.error(f"Force re-login failed: {e}")
                    raise

            if response_status == 200:
                try:
                    resp_json = response.json()
                    logger.info(f"Response JSON type: {type(resp_json)}")
                    
                    if isinstance(resp_json, list):
                        raw_data = resp_json
                    elif isinstance(resp_json, dict):
                        # Some APIs wrap array inside data or content
                        raw_data = resp_json.get("data") or resp_json.get("content") or [resp_json]
                    else:
                        raw_data = []
                    records_received = len(raw_data) if isinstance(raw_data, list) else 1
                    
                    logger.info(f"Successfully fetched {records_received} records for month {month_str}")
                    
                except Exception as parse_err:
                    error_message = f"Failed to parse JSON response: {str(parse_err)}"
                    logger.error(error_message)
            else:
                error_message = f"HTTP Error {response_status}: {response.text[:300]}"
                logger.error(error_message)

        except Exception as exc:
            elapsed_time = round(time.time() - start_time, 3)
            error_message = f"Request Exception: {str(exc)}"
            logger.exception(f"Error fetching data for month {month_str}")

        # Header log dictionary (masking secret keys slightly if needed)
        headers_log = {
            "X-API-TOKEN": static_token[:4] + "***" if len(static_token) > 4 else static_token,
            "X-USER-API-KEY": "Bearer *** (Server Managed)",
            "Accept": "application/json"
        }

        # Create ApiRequestLog entry
        request_log = ApiRequestLog.objects.create(
            sync_job=sync_job,
            month=month_str,
            endpoint="/api/credit-notes",
            request_method="GET",
            request_url=url,
            request_headers=headers_log,
            request_body={},
            response_status=response_status,
            response_time=elapsed_time,
            records_received=records_received,
            error_message=error_message
        )

        if error_message and not raw_data:
            raise RuntimeError(f"Error fetching data for month {month_str}: {error_message}")

        return raw_data or [], request_log