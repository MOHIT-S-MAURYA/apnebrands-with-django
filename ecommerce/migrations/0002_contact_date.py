# Generated by Django 4.2.2 on 2023-06-13 09:13

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 13, 9, 13, 7, 679653)),
        ),
    ]