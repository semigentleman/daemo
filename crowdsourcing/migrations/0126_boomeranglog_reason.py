# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-08-03 03:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcing', '0125_boomeranglog'),
    ]

    operations = [
        migrations.AddField(
            model_name='boomeranglog',
            name='reason',
            field=models.CharField(max_length=64, null=True),
        ),
    ]