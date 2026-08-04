import logging
from datetime import datetime
from django.utils import timezone
from meda_integration.models import ApiSyncJob
from meda_integration.services.meda_fetch_service import MedaFetchService
from meda_integration.services.meda_parser import MedaParser

logger = logging.getLogger(__name__)

class MedaSyncService:
    @staticmethod
    def generate_month_list(from_month_str, to_month_str):
        """
        Generates list of month strings in format 'MM-YYYY' between from_month and to_month inclusive.
        Example: from '01-2026' to '04-2026' -> ['01-2026', '02-2026', '03-2026', '04-2026']
        """
        try:
            start_date = datetime.strptime(from_month_str.strip(), "%m-%Y")
            end_date = datetime.strptime(to_month_str.strip(), "%m-%Y")
        except ValueError as e:
            raise ValueError(f"Invalid month format. Please use 'MM-YYYY' format. Error: {str(e)}")

        if start_date > end_date:
            raise ValueError("From Month cannot be after To Month.")

        months = []
        curr = start_date
        while curr <= end_date:
            months.append(curr.strftime("%m-%Y"))
            # Advance to next month
            year = curr.year + (1 if curr.month == 12 else 0)
            month = 1 if curr.month == 12 else curr.month + 1
            curr = datetime(year, month, 1)

        return months

    @classmethod
    def run_sync_job(cls, from_month_str, to_month_str, user=None):
        """
        Orchestrates full data synchronization across multiple months.
        Creates and updates ApiSyncJob.
        """
        month_list = cls.generate_month_list(from_month_str, to_month_str)

        sync_job = ApiSyncJob.objects.create(
            from_month=from_month_str,
            to_month=to_month_str,
            status='IN_PROGRESS',
            total_months=len(month_list),
            created_by=user if (user and user.is_authenticated) else None
        )

        total_records = 0
        total_success = 0
        total_failed = 0

        try:
            for month_str in month_list:
                logger.info(f"Syncing month {month_str} for SyncJob #{sync_job.id}")
                try:
                    raw_data_list, request_log = MedaFetchService.fetch_month_data(month_str, sync_job=sync_job)
                    
                    if raw_data_list:
                        success_cnt, failed_cnt = MedaParser.parse_and_store_records(
                            month_str=month_str,
                            raw_data_list=raw_data_list,
                            request_log=request_log
                        )
                        
                        records_cnt = len(raw_data_list) if isinstance(raw_data_list, list) else 0
                        total_records += records_cnt
                        total_success += success_cnt
                        total_failed += failed_cnt
                    else:
                        logger.warning(f"No data received for month {month_str}")
                        total_failed += 1

                except Exception as month_err:
                    logger.error(f"Failed syncing month {month_str}: {month_err}")
                    total_failed += 1

                # Update running totals on job
                sync_job.total_records = total_records
                sync_job.success_count = total_success
                sync_job.failed_count = total_failed
                sync_job.save(update_fields=['total_records', 'success_count', 'failed_count'])

            # Determine final status
            if total_failed == 0 and total_success > 0:
                sync_job.status = 'COMPLETED'
            elif total_success > 0 and total_failed > 0:
                sync_job.status = 'PARTIAL'
            else:
                sync_job.status = 'FAILED'
                
            sync_job.completed_at = timezone.now()
            sync_job.save()
            logger.info(f"SyncJob #{sync_job.id} completed with status: {sync_job.status}")

        except Exception as job_err:
            logger.exception(f"SyncJob #{sync_job.id} failed catastrophically: {job_err}")
            sync_job.status = 'FAILED'
            sync_job.completed_at = timezone.now()
            sync_job.save()
            raise job_err

        return sync_job