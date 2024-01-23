from django.db import models

class EquipamientoEducacion(models.Model):
    gid = models.AutoField(primary_key=True)
    join_count = models.FloatField(blank=True, null=True)
    target_fid = models.FloatField(blank=True, null=True)
    nombre = models.CharField(max_length=254, blank=True, null=True)
    tipologia = models.CharField(max_length=50, blank=True, null=True)
    consultori = models.CharField(max_length=254, blank=True, null=True)
    poblacion = models.FloatField(blank=True, null=True)
    sum_sup_m2 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    sum_sup_to = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    geom = models.TextField(blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'equipamiento_educacion'

class Limite_poligono(models.Model):
    gid = models.AutoField(primary_key=True)
    geom = models.TextField(blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'Limite_poligono'
