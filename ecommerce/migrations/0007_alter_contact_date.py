# Generated by Django 4.2.2 on 2023-06-23 05:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0006_alter_contact_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 23, 10, 56, 41, 121251)),
        ),
    ]
