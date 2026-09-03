from django.db import models

class Biomass(models.Model):
    name_of_developer = models.CharField(max_length=255, blank=True, default='')
    site_name = models.CharField(max_length=255, blank=True, default='')
    source = models.CharField(max_length=255, blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    village = models.CharField(max_length=255, blank=True, default='')
    investor_name_and_address = models.TextField(blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    commissioned_date = models.DateField(null=True, blank=True)

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
    grid_type = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'MSW'
        verbose_name_plural = 'MSW'

    def __str__(self):
        return f"MSW - {self.name_of_developer or self.investor_name_and_address[:30]} ({self.capacity_mw} MW)"


class SHP(models.Model):
    completed_hydro_electric_projects = models.CharField(max_length=255, blank=True, default='')
    date_of_commissioning = models.DateField(null=True, blank=True)
    region = models.CharField(max_length=255, blank=True, default='')
    village_taluka = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    installed_capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    comissioning_year = models.CharField(max_length=50, blank=True, default='')

    class Meta:
        verbose_name = 'SHP'
        verbose_name_plural = 'SHP'

    def __str__(self):
        return f"SHP - {self.completed_hydro_electric_projects} ({self.installed_capacity_mw} MW)"


class GovtSolarization(models.Model):
    department = models.CharField(max_length=255, blank=True, default='')
    division = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    consumer_no = models.CharField(max_length=255, blank=True, default='')
    building_name = models.CharField(max_length=255, blank=True, default='')
    address = models.TextField(blank=True, default='')
    pin_code = models.CharField(max_length=50, blank=True, default='')
    ownership_type = models.CharField(max_length=255, blank=True, default='')
    capacity_kw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)

    class Meta:
        verbose_name = 'Government Building Solarization'
        verbose_name_plural = 'Government Building Solarization'

    def __str__(self):
        return f"Govt Solarization - {self.building_name or self.department} ({self.capacity_kw} kW / {self.capacity_mw} MW)"



class SolarGrid(models.Model):
    developer_name = models.CharField(max_length=255, blank=True, default='')
    project_location = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    commissioned_capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    commission_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = 'Solar Grid'
        verbose_name_plural = 'Solar Grids'

    def __str__(self):
        return f"Solar Grid - {self.developer_name} ({self.commissioned_capacity_mw} MW)"


class SolarKusum(models.Model):
    type = models.CharField(max_length=255, blank=True, default='')
    developer_name = models.CharField(max_length=255, blank=True, default='')
    project_location = models.CharField(max_length=255, blank=True, default='')
    commissioned_capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    commission_date = models.DateField(null=True, blank=True)
    district = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Solar Kusum'
        verbose_name_plural = 'Solar Kusum'

    def __str__(self):
        return f"Solar Kusum - {self.developer_name} ({self.commissioned_capacity_mw} MW)"


class Wind(models.Model):
    developer = models.TextField(blank=True, default='')
    investor = models.TextField(blank=True, default='')
    capacity_mw = models.DecimalField(max_digits=15, decimal_places=3, null=True, blank=True)
    standardized_date = models.DateField(null=True, blank=True)
    date_of_commissioned = models.DateField(null=True, blank=True)
    gut_no = models.TextField(blank=True, default='')
    taluka = models.CharField(max_length=255, blank=True, default='')
    village = models.CharField(max_length=255, blank=True, default='')
    district = models.CharField(max_length=255, blank=True, default='')
    site_name = models.TextField(blank=True, default='')
    source = models.CharField(max_length=255, blank=True, default='')
    year = models.CharField(max_length=50, blank=True, default='')

    class Meta:
        verbose_name = 'Wind'
        verbose_name_plural = 'Wind'

    def __str__(self):
        return f"Wind - {self.developer or self.gut_no} ({self.capacity_mw} MW)"
