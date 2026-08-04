from django.db import models
from django.contrib.auth.models import User

class MedaSession(models.Model):
    """
    Stores MEDA API credentials and JWT token securely on Django server.
    Ensures frontend never touches or handles the JWT manually.
    """
    static_token = models.CharField(max_length=500)
    user_id = models.CharField(max_length=150)
    password = models.CharField(max_length=255)
    jwt_token = models.TextField(blank=True, null=True)
    jwt_expires_at = models.DateTimeField(blank=True, null=True)
    is_connected = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'MEDA Session'
        verbose_name_plural = 'MEDA Sessions'

    def __str__(self):
        return f"MEDA Session ({self.user_id}) - {'Connected' if self.is_connected else 'Disconnected'}"


class ApiSyncJob(models.Model):
    """
    Tracks complete MEDA data sync operations across multiple months.
    """
    STATUS_CHOICES = (
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )

    from_month = models.CharField(max_length=20)  # e.g., "01-2026"
    to_month = models.CharField(max_length=20)    # e.g., "04-2026"
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='IN_PROGRESS')
    total_months = models.IntegerField(default=0)
    total_records = models.IntegerField(default=0)
    success_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='meda_sync_jobs')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'API Sync Job'
        verbose_name_plural = 'API Sync Jobs'

    def __str__(self):
        return f"Sync Job #{self.id} ({self.from_month} to {self.to_month}) - {self.status}"


class ApiRequestLog(models.Model):
    """
    Logs all API requests made to MEDA endpoints.
    """
    sync_job = models.ForeignKey(ApiSyncJob, on_delete=models.CASCADE, related_name='request_logs', null=True, blank=True)
    month = models.CharField(max_length=20, blank=True, default='')
    endpoint = models.CharField(max_length=255)
    request_method = models.CharField(max_length=10)
    request_url = models.TextField()
    request_headers = models.JSONField(default=dict, blank=True)
    request_body = models.JSONField(default=dict, null=True, blank=True)
    response_status = models.IntegerField(null=True, blank=True)
    response_time = models.FloatField(default=0.0, help_text="Duration in seconds")
    records_received = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'API Request Log'
        verbose_name_plural = 'API Request Logs'

    def __str__(self):
        return f"Log {self.request_method} {self.endpoint} [{self.response_status}] - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ApiRawRecord(models.Model):
    """
    Stores exact un-modified JSON objects returned by MEDA API.
    Every raw object becomes one row in this table.
    """
    request_log = models.ForeignKey(ApiRequestLog, on_delete=models.SET_NULL, null=True, blank=True, related_name='raw_records')
    month = models.CharField(max_length=20)
    raw_json = models.JSONField()
    processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'API Raw Record'
        verbose_name_plural = 'API Raw Records'

    def __str__(self):
        return f"RawRecord #{self.id} ({self.month})"


class EnergyCreditNote(models.Model):
    """
    Normalized credit note record. Serves as the direct source for Power BI reports.
    Upserted based on (agreement_id, credit_note_from_date, credit_note_to_date).
    """
    raw_record = models.ForeignKey(ApiRawRecord, on_delete=models.SET_NULL, null=True, blank=True, related_name='credit_notes')
    zone_name = models.CharField(max_length=150, blank=True, default='')
    circle_name = models.CharField(max_length=150, blank=True, default='')
    substation_code = models.CharField(max_length=100, blank=True, default='')
    substation_name = models.CharField(max_length=200, blank=True, default='')
    feeder_code = models.CharField(max_length=100, blank=True, default='')
    generator_name = models.CharField(max_length=255, blank=True, default='')
    source = models.CharField(max_length=100, blank=True, default='')
    agreement_capacity = models.DecimalField(max_digits=12, decimal_places=3, null=True, blank=True)
    nce_generator_code = models.CharField(max_length=100, db_index=True)
    metering_point_id = models.CharField(max_length=100, blank=True, default='')
    agreement_id = models.CharField(max_length=100, db_index=True)
    agreement_type = models.CharField(max_length=100, blank=True, default='')
    agreement_type_description = models.CharField(max_length=255, blank=True, default='')
    credit_note_type = models.CharField(max_length=100, blank=True, default='')
    date_of_commission = models.DateField(null=True, blank=True)
    credit_note_from_date = models.DateField(null=True, blank=True, db_index=True)
    credit_note_to_date = models.DateField(null=True, blank=True, db_index=True)
    kwh_unit = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    kwh_rate = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    kwh_charges = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    rkvah_unit = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    rkvah_rate = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    rkvah_charges = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-credit_note_from_date', '-created_at']
        verbose_name = 'Energy Credit Note'
        verbose_name_plural = 'Energy Credit Notes'
        indexes = [
            models.Index(fields=['agreement_id']),
            models.Index(fields=['nce_generator_code']),
            models.Index(fields=['credit_note_from_date']),
            models.Index(fields=['credit_note_to_date']),
            models.Index(fields=['agreement_id', 'credit_note_from_date', 'credit_note_to_date']),
        ]

    def __str__(self):
        return f"CreditNote #{self.agreement_id} ({self.credit_note_from_date} to {self.credit_note_to_date})"
