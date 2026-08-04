from django.urls import path, include
from rest_framework.routers import DefaultRouter
from meda_integration.views import (
    ConnectMedaView,
    DisconnectMedaView,
    MedaStatusView,
    FetchDataView,
    ApiSyncJobViewSet,
    ApiRequestLogViewSet,
    ApiRawRecordViewSet,
    EnergyCreditNoteViewSet,
    MedaSessionDebugView
)

router = DefaultRouter()
router.register(r'sync-jobs', ApiSyncJobViewSet, basename='sync-jobs')
router.register(r'request-logs', ApiRequestLogViewSet, basename='request-logs')
router.register(r'raw-records', ApiRawRecordViewSet, basename='raw-records')
router.register(r'credit-notes', EnergyCreditNoteViewSet, basename='credit-notes')

urlpatterns = [
    path('auth/connect/', ConnectMedaView.as_view(), name='meda-auth-connect'),
    path('auth/disconnect/', DisconnectMedaView.as_view(), name='meda-auth-disconnect'),
    path('auth/status/', MedaStatusView.as_view(), name='meda-auth-status'),
    path('fetch/', FetchDataView.as_view(), name='meda-fetch'),
    path('auth/debug/', MedaSessionDebugView.as_view(), name='meda-auth-debug'),
    path('', include(router.urls)),
]
