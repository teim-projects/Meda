from django.urls import path
from .views import DownloadTemplateView, UploadExcelView, DownloadFilledDataView, EnergyDataListView, EnergyAnalyticsView

urlpatterns = [
    path('template/<str:energy_type>/', DownloadTemplateView.as_view(), name='energy-template-download'),
    path('upload/<str:energy_type>/', UploadExcelView.as_view(), name='energy-template-upload'),
    path('export/<str:energy_type>/', DownloadFilledDataView.as_view(), name='energy-template-export'),
    path('data/<str:energy_type>/', EnergyDataListView.as_view(), name='energy-data-list'),
    path('analytics/<str:energy_type>/', EnergyAnalyticsView.as_view(), name='energy-analytics'),
]
