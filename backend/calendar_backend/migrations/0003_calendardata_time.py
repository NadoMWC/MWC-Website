# Generated by Django 5.0.6 on 2025-04-02 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendar_backend', '0002_calendardata_date_text_alter_calendardata_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendardata',
            name='time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
