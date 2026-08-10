import io
import openpyxl
from datetime import date
from decimal import Decimal
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse

from .models import Biomass, Bagasse, MSW, SHP, SolarGrid, SolarKusum, Wind

class EnergyTemplatesTests(TestCase):
    def setUp(self):
        # Create user and log in client
        self.user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        self.client = Client()
        self.client.force_login(self.user)
        
        # Test configurations for all 7 active types
        self.active_types = ['biomass', 'bagasse', 'msw', 'shp', 'solar-grid', 'solar-kusum', 'wind']

    def test_download_templates(self):
        """
        Verify that blank template download works and contains the correct headers for all types.
        """
        for etype in self.active_types:
            url = reverse('energy-template-download', kwargs={'energy_type': etype})
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200, f"Failed to download template for {etype}")
            self.assertEqual(
                response['Content-Type'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            
            # Read the response spreadsheet to check headers
            wb = openpyxl.load_workbook(io.BytesIO(response.content))
            ws = wb.active
            headers = [cell.value for cell in next(ws.iter_rows())]
            self.assertTrue(len(headers) > 0)

    def test_export_data(self):
        """
        Verify that data export works for all types.
        """
        for etype in self.active_types:
            url = reverse('energy-template-export', kwargs={'energy_type': etype})
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200, f"Failed to export data for {etype}")
            self.assertEqual(
                response['Content-Type'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )

    def test_upload_excel_biomass(self):
        """
        Verify that uploading a valid Excel sheet for Biomass successfully creates a record.
        """
        # Create Excel file in memory
        wb = openpyxl.Workbook()
        ws = wb.active
        
        # Write headers
        headers = ['Source', 'Investor Name & Address', 'Name of Developer', 'Capacity MW', 'Village', 'Taluka', 'District', 'Commissioned Date', 'Site Name']
        ws.append(headers)
        
        # Write test data row
        row = ['SolarSource', 'Test Investor Addr', 'DevName', 12.34, 'Vil', 'Tal', 'Dist', '2024-05-15', 'SiteA']
        ws.append(row)
        
        excel_file = io.BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)
        excel_file.name = 'biomass_test.xlsx'
        
        # Upload
        url = reverse('energy-template-upload', kwargs={'energy_type': 'biomass'})
        response = self.client.post(url, {'file': excel_file})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.assertEqual(response.json()['imported_count'], 1)
        
        # Verify db insert
        obj = Biomass.objects.first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.source, 'SolarSource')
        self.assertEqual(obj.capacity_mw, Decimal('12.340'))
        self.assertEqual(obj.commissioned_date, date(2024, 5, 15))

    def test_upload_excel_shp(self):
        """
        Verify that uploading a valid Excel sheet for SHP successfully creates a record.
        """
        wb = openpyxl.Workbook()
        ws = wb.active
        
        headers = ['Village/Taluka', 'Completed Hydro Electric Projects', 'Installed Capacity (MW)', 'Comissioning Year', 'Date of Commissioning']
        ws.append(headers)
        
        row = ['Vil/Tal A', 'Hydro Project One', 5.67, '2024-25', '2024-06-20']
        ws.append(row)
        
        excel_file = io.BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)
        excel_file.name = 'shp_test.xlsx'
        
        url = reverse('energy-template-upload', kwargs={'energy_type': 'shp'})
        response = self.client.post(url, {'file': excel_file})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        
        # Verify db insert
        obj = SHP.objects.first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.village_taluka, 'Vil/Tal A')
        self.assertEqual(obj.installed_capacity_mw, Decimal('5.670'))
        self.assertEqual(obj.comissioning_year, '2024-25')

    def test_upload_excel_solar_kusum(self):
        """
        Verify that uploading a valid Excel sheet for Solar Kusum successfully creates a record.
        """
        wb = openpyxl.Workbook()
        ws = wb.active
        
        headers = [
            'Source', 'Region', 'zone', 'Circle', 'Division', 'Subdivision', 'District', 'Taluka', 'Village',
            'Sub station Code', 'Substation Description', 'Solar Capacity as per PPA (MW)', 'Solar Capacity Installed (MW)',
            'Commissioning Date', 'Balance Solar Capacity  (MW)', 'Name of Successful Bidder'
        ]
        ws.append(headers)
        
        row = [
            'KusumSource', 'Region East', 'Zone A', 'Circle B', 'Div C', 'Subdiv D', 'Dist E', 'Tal F', 'Vil G',
            'SUB123', 'Desc of Sub', 2.0, 1.5, '2024-08-01', 0.5, 'Successful Bidder Name'
        ]
        ws.append(row)
        
        excel_file = io.BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)
        excel_file.name = 'kusum_test.xlsx'
        
        url = reverse('energy-template-upload', kwargs={'energy_type': 'solar-kusum'})
        response = self.client.post(url, {'file': excel_file})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        
        # Verify db insert
        obj = SolarKusum.objects.first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.source, 'KusumSource')
        self.assertEqual(obj.solar_capacity_as_per_ppa_mw, Decimal('2.000'))
        self.assertEqual(obj.name_of_successful_bidder, 'Successful Bidder Name')
