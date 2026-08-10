from django.contrib import admin
from .models import Biomass, Bagasse, MSW, SHP, SolarGrid, SolarKusum, Wind

@admin.register(Biomass)
class BiomassAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'name_of_developer', 'capacity_mw', 'district', 'commissioned_date')
    search_fields = ('name_of_developer', 'investor_name_and_address', 'district', 'taluka', 'village')
    list_filter = ('source', 'district')


@admin.register(Bagasse)
class BagasseAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'name_of_developer', 'capacity_mw', 'district', 'commissioned_date')
    search_fields = ('name_of_developer', 'investor_name_and_address', 'district', 'taluka', 'village')
    list_filter = ('source', 'district')


@admin.register(MSW)
class MSWAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'name_of_developer', 'capacity_mw', 'district', 'commissioned_date', 'grid_connected_offgrid')
    search_fields = ('name_of_developer', 'investor_name_and_address', 'district', 'taluka', 'village')
    list_filter = ('source', 'district', 'grid_connected_offgrid')


@admin.register(SHP)
class SHPAdmin(admin.ModelAdmin):
    list_display = ('id', 'completed_hydro_electric_projects', 'installed_capacity_mw', 'comissioning_year', 'date_of_commissioning')
    search_fields = ('completed_hydro_electric_projects', 'village_taluka')
    list_filter = ('comissioning_year',)


@admin.register(SolarGrid)
class SolarGridAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'developer_name', 'commissioned_capacity_mw', 'project_location', 'commission_date', 'district')
    search_fields = ('developer_name', 'project_location', 'district')
    list_filter = ('source', 'district', 'power_sale_mode')


@admin.register(SolarKusum)
class SolarKusumAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'name_of_successful_bidder', 'solar_capacity_as_per_ppa_mw', 'solar_capacity_installed_mw', 'commissioning_date', 'district')
    search_fields = ('name_of_successful_bidder', 'district', 'taluka', 'village', 'sub_station_code')
    list_filter = ('source', 'region', 'zone', 'circle')


@admin.register(Wind)
class WindAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'gut_no', 'village', 'taluka', 'district', 'capacity_mw', 'date_of_commissioned')
    search_fields = ('gut_no', 'village', 'taluka', 'district', 'site_name')
    list_filter = ('source', 'district', 'year')
