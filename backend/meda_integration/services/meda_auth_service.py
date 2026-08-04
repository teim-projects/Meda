import logging
import requests
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from django.utils import timezone as django_timezone
from meda_integration.models import MedaSession

logger = logging.getLogger(__name__)

MEDA_LOGIN_URL = "https://nvp.mahadiscom.in/nce-meda-data-api-1.0-SNAPSHOT/api/login"

class MedaAuthService:
    @staticmethod
    def decode_jwt_expiration(jwt_str):
        """
        Extracts expiration timestamp from JWT token payload without signature verification.
        """
        if not jwt_str:
            return django_timezone.now() + timedelta(hours=12)
            
        try:
            # Decode payload without verifying signature
            payload = pyjwt.decode(jwt_str, options={"verify_signature": False})
            exp = payload.get("exp")
            if exp:
                return datetime.fromtimestamp(exp, tz=timezone.utc)
        except Exception as e:
            logger.warning(f"Could not parse JWT expiration: {e}")
            # If JWT parsing fails, the token might not be a JWT
            # Return a default expiration
            return django_timezone.now() + timedelta(hours=12)
        
        return django_timezone.now() + timedelta(hours=12)

    @classmethod
    def _perform_login_api_call(cls, static_token, user_id, password):
        """
        Executes HTTP POST request to MEDA Login API.
        """
        headers = {
            "X-API-TOKEN": static_token.strip(),
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        body = {
            "userId": user_id.strip(),
            "password": password.strip()
        }

        logger.info(f"Calling MEDA Login API for userId: {user_id}")
        logger.info(f"Request Headers: {headers}")
        logger.info(f"Request Body: userId={user_id}, password=***")
        
        try:
            response = requests.post(MEDA_LOGIN_URL, headers=headers, json=body, timeout=30)
            
            logger.info(f"Response Status: {response.status_code}")
            logger.info(f"Response Headers: {dict(response.headers)}")
            logger.info(f"Response Body (first 500 chars): {response.text[:500]}")
            
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"MEDA Login API failed with status {response.status_code}: {error_text}")
                raise ValueError(f"MEDA Login Failed (Status {response.status_code}): {error_text[:200]}")

            # Extract JWT token from response
            token = None
            resp_json = response.json()
            logger.info(f"Full Login Response: {resp_json}")
            
            # Try different response formats
            if isinstance(resp_json, dict):
                # Check for token in various possible fields
                token = (
                    resp_json.get("token") or 
                    resp_json.get("jwtToken") or 
                    resp_json.get("jwt") or 
                    resp_json.get("key") or
                    resp_json.get("data") or
                    resp_json.get("access_token") or
                    resp_json.get("accessToken")
                )
                
                # If token is in a nested structure
                if isinstance(token, dict):
                    token = token.get("token") or token.get("jwtToken") or token.get("value")
                
                # If no token found, check if the entire response is the token
                if not token:
                    # Some APIs return the token as the only field
                    for key, value in resp_json.items():
                        if isinstance(value, str) and len(value) > 20:
                            token = value
                            break
                            
            elif isinstance(resp_json, str):
                token = resp_json
            
            # If still no token, try the raw response text
            if not token:
                token = response.text.strip()
                # Remove quotes if present
                if token.startswith('"') and token.endswith('"'):
                    token = token[1:-1]

            logger.info(f"Extracted Token (first 50 chars): {token[:50] if token else 'None'}...")
            
            if not token or len(token) < 10:
                raise ValueError(f"MEDA Login response did not contain a valid token. Response: {response.text[:200]}")

            return token.strip()

        except requests.exceptions.RequestException as e:
            logger.error(f"Network error during MEDA login: {e}")
            raise ValueError(f"Network error: {str(e)}")
        except ValueError as e:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during MEDA login: {e}")
            raise ValueError(f"Unexpected error: {str(e)}")

    @classmethod
    def connect_meda(cls, static_token, user_id, password):
        """
        Authenticates with MEDA API, stores JWT and session details on Django server.
        """
        if not static_token or not user_id or not password:
            raise ValueError("Static Token, User ID, and Password are all required.")

        try:
            jwt_token = cls._perform_login_api_call(static_token, user_id, password)
        except Exception as e:
            logger.error(f"Login failed: {e}")
            raise

        # Try to decode expiration, but don't fail if it's not a JWT
        jwt_expires_at = cls.decode_jwt_expiration(jwt_token)
        now = django_timezone.now()

        # Update or create single active MEDA Session
        session, created = MedaSession.objects.get_or_create(
            id=1,
            defaults={
                'static_token': static_token,
                'user_id': user_id,
                'password': password,
                'jwt_token': jwt_token,
                'jwt_expires_at': jwt_expires_at,
                'is_connected': True,
                'last_login_at': now,
            }
        )

        if not created:
            session.static_token = static_token
            session.user_id = user_id
            session.password = password
            session.jwt_token = jwt_token
            session.jwt_expires_at = jwt_expires_at
            session.is_connected = True
            session.last_login_at = now
            session.save()

        logger.info(f"Successfully established MEDA Session for user {user_id}")
        return session

    @classmethod
    def disconnect_meda(cls):
        """
        Disconnects MEDA session and invalidates stored JWT.
        """
        session = MedaSession.objects.filter(id=1).first()
        if session:
            session.is_connected = False
            session.jwt_token = ""
            session.save()
            logger.info("MEDA Session disconnected.")
        return True

    @classmethod
    def get_valid_jwt(cls):
        """
        Retrieves valid JWT. If expired or near expiration, automatically logs in again
        using stored credentials before returning token.
        """
        session = MedaSession.objects.filter(id=1, is_connected=True).first()
        if not session or not session.jwt_token:
            raise PermissionError("No active MEDA session found. Please perform MEDA Login first.")

        now = django_timezone.now()
        # Buffer of 60 seconds before expiration
        buffer_time = timedelta(seconds=60)
        
        # Check if token is expired or about to expire
        if session.jwt_expires_at and (now + buffer_time) >= session.jwt_expires_at:
            logger.info(f"Token expired or expiring soon for user {session.user_id}. Refreshing automatically...")
            try:
                # Auto login using stored session credentials
                new_jwt = cls._perform_login_api_call(session.static_token, session.user_id, session.password)
                session.jwt_token = new_jwt
                session.jwt_expires_at = cls.decode_jwt_expiration(new_jwt)
                session.last_login_at = now
                session.save()
                logger.info("JWT automatically refreshed successfully.")
            except Exception as e:
                logger.error(f"Auto-login failed: {e}")
                raise PermissionError(f"Auto-login failed: {str(e)}")

        return session.jwt_token, session.static_token

    @classmethod
    def get_session_status(cls):
        """
        Returns connection and token status details for the frontend.
        """
        session = MedaSession.objects.filter(id=1).first()
        if not session or not session.is_connected:
            return {
                "is_connected": False,
                "user_id": session.user_id if session else "",
                "last_login_time": session.last_login_at if session else None,
                "token_status": "Disconnected",
                "token_expiry": None,
            }

        now = django_timezone.now()
        is_expired = session.jwt_expires_at and now >= session.jwt_expires_at

        return {
            "is_connected": True,
            "user_id": session.user_id,
            "last_login_time": session.last_login_at,
            "token_status": "Expired" if is_expired else "Active",
            "token_expiry": session.jwt_expires_at,
        }

    @classmethod
    def get_session_credentials(cls):
        """
        Retrieves stored session credentials for auto-login.
        Returns a dict with static_token, user_id, and password.
        """
        session = MedaSession.objects.filter(id=1, is_connected=True).first()
        if not session:
            raise PermissionError("No active MEDA session found. Please perform MEDA Login first.")
        
        return {
            'static_token': session.static_token,
            'user_id': session.user_id,
            'password': session.password
        }