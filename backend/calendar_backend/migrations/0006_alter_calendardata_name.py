# Generated by Django 5.0.6 on 2025-04-06 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendar_backend', '0005_rename_date_text_calendardata_address_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calendardata',
            name='name',
            field=models.TextField(blank=True, null=True),
        ),
    ]
