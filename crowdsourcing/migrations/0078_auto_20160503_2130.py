# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-05-03 21:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcing', '0077_project_is_paid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='sender_type',
            field=models.CharField(default=b'self', max_length=32),
        ),
    ]
