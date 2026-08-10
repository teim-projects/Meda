from django.db import models

class Biomass(models.Model):
    source = models.CharField(max_length=255, blank=True, default='')
    investor_name_and_address = models.TextField(blank=True, default='')
    name_of_developer = models.CharField(max_length=255, blank=True, default='')
    capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    village = models.CharField(max_length=255, blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    commissioned_date = models.DateField(null=True, blank=True)
    site_name = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Biomass'
        verbose_name_plural = 'Biomass'

    def __str__(self):
        return f"Biomass - {self.name_of_developer or self.investor_name_and_address[:30]} ({self.capacity_mw} MW)"


class Bagasse(models.Model):
    source = models.CharField(max_length=255, blank=True, default='')
    investor_name_and_address = models.TextField(blank=True, default='')
    name_of_developer = models.CharField(max_length=255, blank=True, default='')
    capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    village = models.CharField(max_length=255, blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    commissioned_date = models.DateField(null=True, blank=True)
    site_name = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Bagasse'
        verbose_name_plural = 'Bagasse'

    def __str__(self):
        return f"Bagasse - {self.name_of_developer or self.investor_name_and_address[:30]} ({self.capacity_mw} MW)"


class MSW(models.Model):
    source = models.CharField(max_length=255, blank=True, default='')
    investor_name_and_address = models.TextField(blank=True, default='')
    name_of_developer = models.CharField(max_length=255, blank=True, default='')
    capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    village = models.CharField(max_length=255, blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    commissioned_date = models.DateField(null=True, blank=True)
    site_name = models.CharField(max_length=255, blank=True, default='')
    grid_connected_offgrid = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'MSW'
        verbose_name_plural = 'MSW'

    def __str__(self):
        return f"MSW - {self.name_of_developer or self.investor_name_and_address[:30]} ({self.capacity_mw} MW)"


class SHP(models.Model):
    village_taluka = models.CharField(max_length=255, blank=True, default='')
    completed_hydro_electric_projects = models.CharField(max_length=255, blank=True, default='')
    installed_capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    comissioning_year = models.CharField(max_length=50, blank=True, default='')
    date_of_commissioning = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = 'SHP'
        verbose_name_plural = 'SHP'

    def __str__(self):
        return f"SHP - {self.completed_hydro_electric_projects} ({self.installed_capacity_mw} MW)"


class SolarGrid(models.Model):
    source = models.CharField(max_length=255, blank=True, default='')
    developer_name = models.CharField(max_length=255, blank=True, default='')
    commissioned_capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    project_location = models.CharField(max_length=255, blank=True, default='')
    commission_date = models.DateField(null=True, blank=True)
    district = models.CharField(max_length=255, blank=True, default='')
    power_sale_mode = models.CharField(max_length=255, blank=True, default='')
    project_park = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Solar Grid'
        verbose_name_plural = 'Solar Grids'

    def __str__(self):
        return f"Solar Grid - {self.developer_name} ({self.commissioned_capacity_mw} MW)"


class SolarKusum(models.Model):
    source = models.CharField(max_length=255, blank=True, default='')
    region = models.CharField(max_length=255, blank=True, default='')
    zone = models.CharField(max_length=255, blank=True, default='')
    circle = models.CharField(max_length=255, blank=True, default='')
    division = models.CharField(max_length=255, blank=True, default='')
    subdivision = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    village = models.CharField(max_length=255, blank=True, default='')
    sub_station_code = models.CharField(max_length=255, blank=True, default='')
    substation_description = models.TextField(blank=True, default='')
    solar_capacity_as_per_ppa_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    solar_capacity_installed_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    commissioning_date = models.DateField(null=True, blank=True)
    balance_solar_capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    name_of_successful_bidder = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Solar Kusum'
        verbose_name_plural = 'Solar Kusum'

    def __str__(self):
        return f"Solar Kusum - {self.name_of_successful_bidder} (PPA: {self.solar_capacity_as_per_ppa_mw} MW)"


class Wind(models.Model):
    capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    date_of_commissioned = models.DateField(null=True, blank=True)
    gut_no = models.CharField(max_length=255, blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    village = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    site_name = models.CharField(max_length=255, blank=True, default='')
    source = models.CharField(max_length=255, blank=True, default='')
    year = models.CharField(max_length=50, blank=True, default='')

    class Meta:
        verbose_name = 'Wind'
        verbose_name_plural = 'Wind'

    def __str__(self):
        return f"Wind - Gut {self.gut_no} in {self.village} ({self.capacity_mw} MW)"
