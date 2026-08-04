from rest_framework import serializers
from meda_integration.models import (
    MedaSession,
    ApiSyncJob,
    ApiRequestLog,
    ApiRawRecord,
    EnergyCreditNote
)

class MedaConnectSerializer(serializers.Serializer):
    static_token = serializers.CharField(required=True, write_only=True)
    user_id = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)


class MedaSessionStatusSerializer(serializers.Serializer):
    is_connected = serializers.BooleanField()
    user_id = serializers.CharField(allow_blank=True)
    last_login_time = serializers.DateTimeField(allow_null=True)
    token_status = serializers.CharField()
    token_expiry = serializers.DateTimeField(allow_null=True)


class FetchDataRequestSerializer(serializers.Serializer):
    from_month = serializers.CharField(required=True, help_text="Format: MM-YYYY, e.g. 01-2026")
    to_month = serializers.CharField(required=True, help_text="Format: MM-YYYY, e.g. 04-2026")


class ApiSyncJobSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True, default='Admin')
    duration = serializers.SerializerMethodField()

    class Meta:
        model = ApiSyncJob
        fields = [
            'id',
            'from_month',
            'to_month',
            'started_at',
            'completed_at',
            'status',
            'total_months',
            'total_records',
            'success_count',
            'failed_count',
            'created_by_name',
            'created_at',
            'duration',
        ]

    def get_duration(self, obj):
        if obj.started_at and obj.completed_at:
            delta = (obj.completed_at - obj.started_at).total_seconds()
            return f"{round(delta, 2)}s"
        return "-"


class ApiRequestLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiRequestLog
        fields = [
            'id',
            'sync_job',
            'month',
            'endpoint',
            'request_method',
            'request_url',
            'request_headers',
            'request_body',
            'response_status',
            'response_time',
            'records_received',
            'error_message',
            'created_at',
        ]


class ApiRawRecordSerializer(serializers.ModelSerializer):
    records_count = serializers.SerializerMethodField()

    class Meta:
        model = ApiRawRecord
        fields = [
            'id',
            'request_log',
            'month',
            'raw_json',
            'processed',
            'records_count',
            'created_at',
        ]

    def get_records_count(self, obj):
        if isinstance(obj.raw_json, list):
            return len(obj.raw_json)
        return 1


class EnergyCreditNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyCreditNote
        fields = '__all__'
