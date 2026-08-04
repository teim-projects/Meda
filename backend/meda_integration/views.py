import logging
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter

from meda_integration.models import (
    ApiSyncJob,
    ApiRequestLog,
    ApiRawRecord,
    EnergyCreditNote
)
from meda_integration.serializers import (
    MedaConnectSerializer,
    MedaSessionStatusSerializer,
    FetchDataRequestSerializer,
    ApiSyncJobSerializer,
    ApiRequestLogSerializer,
    ApiRawRecordSerializer,
    EnergyCreditNoteSerializer
)
from meda_integration.services.meda_auth_service import MedaAuthService
from meda_integration.services.meda_sync_service import MedaSyncService

logger = logging.getLogger(__name__)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ConnectMedaView(APIView):
    """
    Connects to MEDA API using Static Token, User ID, and Password.
    Stores JWT securely on Django backend and returns success.
    Requires Django Superuser JWT authentication.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MedaConnectSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            session = MedaAuthService.connect_meda(
                static_token=data['static_token'],
                user_id=data['user_id'],
                password=data['password']
            )
            status_data = MedaAuthService.get_session_status()
            return Response({
                "success": True,
                "message": "Connected to MEDA API successfully.",
                "status": status_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Error connecting to MEDA API")
            return Response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class DisconnectMedaView(APIView):
    """
    Disconnects active MEDA session.
    Requires Django Superuser JWT authentication.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            MedaAuthService.disconnect_meda()
            return Response({
                "success": True,
                "message": "MEDA session disconnected successfully.",
                "status": MedaAuthService.get_session_status()
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MedaStatusView(APIView):
    """
    Returns connection and token status details.
    Requires Django Superuser JWT authentication.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        status_data = MedaAuthService.get_session_status()
        serializer = MedaSessionStatusSerializer(status_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FetchDataView(APIView):
    """
    Fetches credit notes from MEDA for requested month range (e.g., Jan 2026 to Apr 2026).
    Backend automatically manages MEDA JWT re-authentication if token is expired.
    Requires Django Superuser JWT authentication.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FetchDataRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        from_month = data['from_month']
        to_month = data['to_month']

        try:
            sync_job = MedaSyncService.run_sync_job(
                from_month_str=from_month,
                to_month_str=to_month,
                user=request.user if (request.user and request.user.is_authenticated) else None
            )
            job_serializer = ApiSyncJobSerializer(sync_job)
            return Response({
                "success": True,
                "message": f"Data fetched successfully for range {from_month} to {to_month}.",
                "sync_job": job_serializer.data
            }, status=status.HTTP_200_OK)
        except PermissionError as perm_err:
            return Response({
                "success": False,
                "message": str(perm_err),
                "code": "AUTHENTICATION_REQUIRED"
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as exc:
            logger.exception("Error executing fetch data job")
            return Response({
                "success": False,
                "message": f"Fetch process failed: {str(exc)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ApiSyncJobViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Sync History jobs.
    Requires Django Superuser JWT authentication.
    """
    queryset = ApiSyncJob.objects.all().order_by('-created_at')
    serializer_class = ApiSyncJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['id', 'created_at', 'status', 'total_records']


class ApiRequestLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing API Request Logs.
    Requires Django Superuser JWT authentication.
    """
    queryset = ApiRequestLog.objects.all().order_by('-created_at')
    serializer_class = ApiRequestLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['id', 'created_at', 'response_status', 'response_time']


class ApiRawRecordViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Raw JSON Records exact as received from MEDA.
    Requires Django Superuser JWT authentication.
    """
    queryset = ApiRawRecord.objects.all().order_by('-created_at')
    serializer_class = ApiRawRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['id', 'created_at', 'month', 'processed']


class EnergyCreditNoteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Normalized Energy Credit Notes (Power BI Source).
    Requires Django Superuser JWT authentication.
    """
    queryset = EnergyCreditNote.objects.all().order_by('-credit_note_from_date', '-created_at')
    serializer_class = EnergyCreditNoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [OrderingFilter]
    ordering_fields = [
        'id',
        'credit_note_from_date',
        'credit_note_to_date',
        'agreement_id',
        'nce_generator_code',
        'created_at'
    ]



# Add this at the end of your views.py file

class MedaSessionDebugView(APIView):
    """
    Debug endpoint to check session credentials.
    Only for development!
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from meda_integration.models import MedaSession
        session = MedaSession.objects.filter(id=1).first()
        if session:
            return Response({
                'exists': True,
                'user_id': session.user_id,
                'is_connected': session.is_connected,
                'has_static_token': bool(session.static_token),
                'has_password': bool(session.password),
                'has_jwt': bool(session.jwt_token),
                'jwt_expires_at': session.jwt_expires_at,
                'last_login_at': session.last_login_at
            })
        return Response({'exists': False})