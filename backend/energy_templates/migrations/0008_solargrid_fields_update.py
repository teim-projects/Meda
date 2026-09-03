from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('energy_templates', '0007_solarkusum_fields_update'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='solargrid',
            name='source',
        ),
        migrations.RemoveField(
            model_name='solargrid',
            name='power_sale_mode',
        ),
        migrations.RemoveField(
            model_name='solargrid',
            name='project_park',
        ),
    ]
