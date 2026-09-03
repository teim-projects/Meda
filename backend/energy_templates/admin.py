from django.contrib import admin
from .models import Biomass, Bagasse, MSW, SHP, GovtSolarization, SolarGrid, SolarKusum, Wind

@admin.register(Biomass)
class BiomassAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_of_developer', 'site_name', 'source', 'taluka', 'village', 'investor_name_and_address', 'district', 'capacity_mw', 'commissioned_date')
    search_fields = ('name_of_developer', 'site_name', 'investor_name_and_address', 'district', 'taluka', 'village')
    list_filter = ('source', 'district')


@admin.register(Bagasse)
class BagasseAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'name_of_developer', 'capacity_mw', 'district', 'commissioned_date')
    search_fields = ('name_of_developer', 'investor_name_and_address', 'district', 'taluka', 'village')
    list_filter = ('source', 'district')


@admin.register(MSW)
class MSWAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'name_of_developer', 'capacity_mw', 'district', 'commissioned_date', 'grid_type')
    search_fields = ('name_of_developer', 'investor_name_and_address', 'district', 'taluka', 'village', 'grid_type')
    list_filter = ('source', 'district', 'grid_type')


@admin.register(SHP)
class SHPAdmin(admin.ModelAdmin):
    list_display = ('id', 'completed_hydro_electric_projects', 'date_of_commissioning', 'region', 'village_taluka', 'district', 'installed_capacity_mw', 'comissioning_year')
    search_fields = ('completed_hydro_electric_projects', 'village_taluka', 'district', 'region')
    list_filter = ('region', 'district', 'comissioning_year')


@admin.register(GovtSolarization)
class GovtSolarizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'department', 'division', 'district', 'taluka', 'building_name', 'capacity_kw', 'capacity_mw')
    search_fields = ('department', 'division', 'district', 'taluka', 'building_name', 'consumer_no')
    list_filter = ('department', 'district', 'ownership_type')



@admin.register(SolarGrid)
class SolarGridAdmin(admin.ModelAdmin):
    list_display = ('id', 'developer_name', 'project_location', 'district', 'commissioned_capacity_mw', 'commission_date')
    search_fields = ('developer_name', 'project_location', 'district')
    list_filter = ('district',)


@admin.register(SolarKusum)
class SolarKusumAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'developer_name', 'project_location', 'commissioned_capacity_mw', 'commission_date', 'district')
    search_fields = ('developer_name', 'project_location', 'district', 'type')
    list_filter = ('type', 'district')


@admin.register(Wind)
class WindAdmin(admin.ModelAdmin):
    list_display = ('id', 'developer', 'investor', 'capacity_mw', 'standardized_date', 'date_of_commissioned', 'gut_no', 'taluka', 'village', 'district', 'site_name', 'source', 'year')
    search_fields = ('developer', 'investor', 'gut_no', 'village', 'taluka', 'district', 'site_name')
    list_filter = ('source', 'district', 'year')
