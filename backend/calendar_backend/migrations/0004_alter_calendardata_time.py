# Generated by Django 5.0.6 on 2025-04-02 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendar_backend', '0003_calendardata_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calendardata',
            name='time',
            field=models.DateField(blank=True, null=True),
        ),
    ]
