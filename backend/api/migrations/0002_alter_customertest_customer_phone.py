# Generated by Django 5.0.6 on 2025-04-02 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customertest',
            name='customer_phone',
            field=models.IntegerField(),
        ),
    ]
