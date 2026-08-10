import datetime
import openpyxl
from decimal import Decimal
from django.db import models
from django.http import HttpResponse
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Biomass, Bagasse, MSW, SHP, SolarGrid, SolarKusum, Wind

# Dynamic maps for energy types, including model references and exact header mapping
CONFIG_MAP = {
    'biomass': {
        'model': Biomass,
        'display_name': 'Biomass',
        'headers': ['Source', 'Investor Name & Address', 'Name of Developer', 'Capacity MW', 'Village', 'Taluka', 'District', 'Commissioned Date', 'Site Name'],
        'fields': {
            'Source': 'source',
            'Investor Name & Address': 'investor_name_and_address',
            'Name of Developer': 'name_of_developer',
            'Capacity MW': 'capacity_mw',
            'Village': 'village',
            'Taluka': 'taluka',
            'District': 'district',
            'Commissioned Date': 'commissioned_date',
            'Site Name': 'site_name'
        }
    },
    'bagasse': {
        'model': Bagasse,
        'display_name': 'Bagasse',
        'headers': ['Source', 'Investor Name & Address', 'Name of Developer', 'Capacity MW', 'Village', 'Taluka', 'District', 'Commissioned Date', 'Site Name'],
        'fields': {
            'Source': 'source',
            'Investor Name & Address': 'investor_name_and_address',
            'Name of Developer': 'name_of_developer',
            'Capacity MW': 'capacity_mw',
            'Village': 'village',
            'Taluka': 'taluka',
            'District': 'district',
            'Commissioned Date': 'commissioned_date',
            'Site Name': 'site_name'
        }
    },
    'msw': {
        'model': MSW,
        'display_name': 'MSW (Municipal Solid Waste)',
        'headers': ['Source', 'Investor Name & Address', 'Name of Developer', 'Capacity MW', 'Village', 'Taluka', 'District', 'Commissioned Date', 'Site Name', 'Grid Connected/Offgrid'],
        'fields': {
            'Source': 'source',
            'Investor Name & Address': 'investor_name_and_address',
            'Name of Developer': 'name_of_developer',
            'Capacity MW': 'capacity_mw',
            'Village': 'village',
            'Taluka': 'taluka',
            'District': 'district',
            'Commissioned Date': 'commissioned_date',
            'Site Name': 'site_name',
            'Grid Connected/Offgrid': 'grid_connected_offgrid'
        }
    },
    'shp': {
        'model': SHP,
        'display_name': 'SHP (Small Hydro Power)',
        'headers': ['Village/Taluka', 'Completed Hydro Electric Projects', 'Installed Capacity (MW)', 'Comissioning Year', 'Date of Commissioning'],
        'fields': {
            'Village/Taluka': 'village_taluka',
            'Completed Hydro Electric Projects': 'completed_hydro_electric_projects',
            'Installed Capacity (MW)': 'installed_capacity_mw',
            'Comissioning Year': 'comissioning_year',
            'Date of Commissioning': 'date_of_commissioning'
        }
    },
    'solar_grid': {
        'model': SolarGrid,
        'display_name': 'Solar Grid',
        'headers': ['Source', 'Developer Name', 'Commissioned Capacity (MW)', 'Project Location', 'Commission Date', 'District', 'Power Sale Mode', 'Project / Park'],
        'fields': {
            'Source': 'source',
            'Developer Name': 'developer_name',
            'Commissioned Capacity (MW)': 'commissioned_capacity_mw',
            'Project Location': 'project_location',
            'Commission Date': 'commission_date',
            'District': 'district',
            'Power Sale Mode': 'power_sale_mode',
            'Project / Park': 'project_park'
        }
    },
    'solar_kusum': {
        'model': SolarKusum,
        'display_name': 'Solar Kusum',
        'headers': [
            'Source', 'Region', 'zone', 'Circle', 'Division', 'Subdivision', 'District', 'Taluka', 'Village',
            'Sub station Code', 'Substation Description', 'Solar Capacity as per PPA (MW)', 'Solar Capacity Installed (MW)',
            'Commissioning Date', 'Balance Solar Capacity  (MW)', 'Name of Successful Bidder'
        ],
        'fields': {
            'Source': 'source',
            'Region': 'region',
            'zone': 'zone',
            'Circle': 'circle',
            'Division': 'division',
            'Subdivision': 'subdivision',
            'District': 'district',
            'Taluka': 'taluka',
            'Village': 'village',
            'Sub station Code': 'sub_station_code',
            'Substation Description': 'substation_description',
            'Solar Capacity as per PPA (MW)': 'solar_capacity_as_per_ppa_mw',
            'Solar Capacity Installed (MW)': 'solar_capacity_installed_mw',
            'Commissioning Date': 'commissioning_date',
            'Balance Solar Capacity  (MW)': 'balance_solar_capacity_mw',
            'Name of Successful Bidder': 'name_of_successful_bidder'
        }
    },
    'wind': {
        'model': Wind,
        'display_name': 'Wind',
        'headers': ['Capacity MW', 'Date of Commissioned', 'Gut No.', 'Taluka', 'Village', 'District', 'Site Name', 'Source', 'Year'],
        'fields': {
            'Capacity MW': 'capacity_mw',
            'Date of Commissioned': 'date_of_commissioned',
            'Gut No.': 'gut_no',
            'Taluka': 'taluka',
            'Village': 'village',
            'District': 'district',
            'Site Name': 'site_name',
            'Source': 'source',
            'Year': 'year'
        }
    }
}


def parse_date(date_val):
    """
    Utility function to safely parse Excel cell values into a Python datetime.date object.
    """
    if not date_val:
        return None
    if isinstance(date_val, datetime.date):
        return date_val
    if isinstance(date_val, datetime.datetime):
        return date_val.date()
    
    date_str = str(date_val).strip()
    if not date_str or date_str.lower() in ('none', 'null', ''):
        return None
        
    # Attempt typical date parsing
    formats = [
        '%Y-%m-%d',
        '%d-%m-%Y',
        '%d/%m/%Y',
        '%Y/%m/%d',
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%dT%H:%M:%S.%fZ',
    ]
    for fmt in formats:
        try:
            if 'T' in date_str and fmt == '%Y-%m-%d':
                return datetime.datetime.strptime(date_str.split('T')[0], '%Y-%m-%d').date()
            return datetime.datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    return None


def parse_decimal(val):
    """
    Utility function to safely parse Excel numerical entries into Python Decimal.
    """
    if val is None or str(val).strip() == '':
        return None
    try:
        clean_str = str(val).replace(',', '').strip()
        return Decimal(clean_str)
    except Exception:
        return None


class DownloadTemplateView(APIView):
    """
    Generates and downloads an empty Excel template containing only the column headers.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, energy_type):
        energy_type = energy_type.lower().replace('-', '_')
        if energy_type not in CONFIG_MAP:
            return Response(
                {"error": f"Invalid or unsupported energy type '{energy_type}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        config = CONFIG_MAP[energy_type]
        headers = config['headers']

        # Create Excel workbook in memory
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = f"{config['display_name'][:30]} Template"

        # Write headers in the first row
        for col_idx, header in enumerate(headers, start=1):
            cell = ws.cell(row=1, column=col_idx, value=header)
            # Make headers bold
            cell.font = openpyxl.styles.Font(bold=True)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response['Content-Disposition'] = f'attachment; filename="{energy_type}_template.xlsx"'
        wb.save(response)
        return response


class DownloadFilledDataView(APIView):
    """
    Downloads an Excel sheet containing all currently stored data rows for the selected energy type.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, energy_type):
        energy_type = energy_type.lower().replace('-', '_')
        if energy_type not in CONFIG_MAP:
            return Response(
                {"error": f"Invalid or unsupported energy type '{energy_type}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        config = CONFIG_MAP[energy_type]
        model = config['model']
        headers = config['headers']
        field_mapping = config['fields']

        # Query all records
        records = model.objects.all().order_by('id')

        # Create workbook
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = f"{config['display_name'][:30]} Data"

        # Write bold headers
        for col_idx, header in enumerate(headers, start=1):
            cell = ws.cell(row=1, column=col_idx, value=header)
            cell.font = openpyxl.styles.Font(bold=True)

        # Write data rows
        for row_idx, record in enumerate(records, start=2):
            for col_idx, header in enumerate(headers, start=1):
                field_name = field_mapping[header]
                val = getattr(record, field_name)
                # Convert dates/decimals to strings or let openpyxl format them
                if isinstance(val, Decimal):
                    val = float(val)
                ws.cell(row=row_idx, column=col_idx, value=val)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response['Content-Disposition'] = f'attachment; filename="{energy_type}_data.xlsx"'
        wb.save(response)
        return response


class UploadExcelView(APIView):
    """
    Accepts an uploaded Excel file, parses it, and inserts/updates records for the selected energy type.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, energy_type):
        energy_type = energy_type.lower().replace('-', '_')
        if energy_type not in CONFIG_MAP:
            return Response(
                {"error": f"Invalid or unsupported energy type '{energy_type}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        excel_file = request.FILES.get('file')
        if not excel_file:
            return Response(
                {"error": "No file uploaded. Please upload a valid Excel (.xlsx) file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Open workbook
        try:
            wb = openpyxl.load_workbook(excel_file, data_only=True)
            ws = wb.active
        except Exception as e:
            return Response(
                {"error": f"Failed to read the Excel file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Read sheet rows
        rows = list(ws.iter_rows(values_only=True))
        if not rows:
            return Response(
                {"error": "The uploaded Excel sheet is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # First row is headers
        file_headers = [str(cell).strip() for cell in rows[0] if cell is not None]
        config = CONFIG_MAP[energy_type]
        model = config['model']
        field_mapping = config['fields']
        expected_headers = config['headers']

        # Verify that we have matching columns (case-insensitive check)
        # Verify that all expected columns exist in the file
        missing_headers = []
        header_to_col_idx = {}
        
        # Clean up expected headers mapping for matching
        cleaned_file_headers = [h.lower() for h in file_headers]
        for idx, expected in enumerate(expected_headers):
            try:
                col_idx = cleaned_file_headers.index(expected.lower())
                header_to_col_idx[expected] = col_idx
            except ValueError:
                missing_headers.append(expected)

        if missing_headers:
            return Response(
                {
                    "error": "Excel template columns do not match.",
                    "missing_columns": missing_headers,
                    "provided_columns": file_headers
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        success_count = 0
        failed_rows = []

        # Process each row
        # Skip the header row (index 0)
        for r_idx, row in enumerate(rows[1:], start=2):
            # Check if row is completely empty
            if all(cell is None or str(cell).strip() == '' for cell in row):
                continue

            record_data = {}
            try:
                # Map columns based on mapped positions
                for header, col_idx in header_to_col_idx.items():
                    field_name = field_mapping[header]
                    val = row[col_idx] if col_idx < len(row) else None
                    
                    # Inspect field type to apply proper casting
                    model_field = model._meta.get_field(field_name)
                    
                    if isinstance(model_field, models.DecimalField):
                        record_data[field_name] = parse_decimal(val)
                    elif isinstance(model_field, models.DateField):
                        record_data[field_name] = parse_date(val)
                    else:
                        record_data[field_name] = str(val).strip() if val is not None else ''

                # Create the instance in the database
                model.objects.create(**record_data)
                success_count += 1
            except Exception as e:
                failed_rows.append({
                    "row_number": r_idx,
                    "error": str(e),
                    "data": {k: str(v) for k, v in record_data.items()}
                })

        return Response({
            "success": True,
            "message": f"Excel import completed: {success_count} records imported successfully.",
            "imported_count": success_count,
            "failed_count": len(failed_rows),
            "failed_rows": failed_rows
        }, status=status.HTTP_200_OK)


class EnergyDataListView(APIView):
    """
    Returns stored database rows in JSON format for the selected energy type.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, energy_type):
        energy_type = energy_type.lower().replace('-', '_')
        if energy_type not in CONFIG_MAP:
            return Response(
                {"error": f"Invalid or unsupported energy type '{energy_type}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        config = CONFIG_MAP[energy_type]
        model = config['model']
        records = list(model.objects.all().order_by('id').values())

        return Response({
            "success": True,
            "display_name": config['display_name'],
            "headers": config['headers'],
            "fields": config['fields'],
            "data": records
        }, status=status.HTTP_200_OK)
