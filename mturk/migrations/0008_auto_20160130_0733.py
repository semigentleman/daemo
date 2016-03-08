# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-30 07:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mturk', '0007_auto_20160129_2321'),
    ]

    operations = [
        migrations.AddField(
            model_name='mturkhit',
            name='num_assignments',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='mturkhit',
            name='status',
            field=models.IntegerField(choices=[(1, 'In Progress'), (2, 'Completed'), (3, 'Expired')], default=1),
        ),
        migrations.AlterField(
            model_name='mturkhit',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mturk_hit', to='crowdsourcing.Task', unique=True),
        ),
    ]