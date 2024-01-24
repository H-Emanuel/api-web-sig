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

class Censo(models.Model):
    id = models.AutoField(primary_key=True)
    uv  = models.CharField(max_length=254, blank=True, null=True)
    total_pers  = models.IntegerField(blank=True, null=True)
    total_vivi  = models.IntegerField(blank=True, null=True)
    hombres   = models.IntegerField(blank=True, null=True)
    mujeres   = models.IntegerField(blank=True, null=True)
    
    edad_0a5    = models.IntegerField(blank=True, null=True)
    edad_6a14    = models.IntegerField(blank=True, null=True)
    edad_15a64    = models.IntegerField(blank=True, null=True)
    edad_15a64   = models.IntegerField(blank=True, null=True)