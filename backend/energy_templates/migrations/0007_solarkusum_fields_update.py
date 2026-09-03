from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('energy_templates', '0006_remove_biomass_commissioning_year_remove_biomass_day_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='solarkusum',
            name='source',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='region',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='zone',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='circle',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='division',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='subdivision',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='taluka',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='village',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='sub_station_code',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='substation_description',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='solar_capacity_as_per_ppa_mw',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='solar_capacity_installed_mw',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='commissioning_date',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='balance_solar_capacity_mw',
        ),
        migrations.RemoveField(
            model_name='solarkusum',
            name='name_of_successful_bidder',
        ),
        migrations.AddField(
            model_name='solarkusum',
            name='type',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='solarkusum',
            name='developer_name',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='solarkusum',
            name='project_location',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='solarkusum',
            name='commissioned_capacity_mw',
            field=models.DecimalField(blank=True, decimal_places=3, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='solarkusum',
            name='commission_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
