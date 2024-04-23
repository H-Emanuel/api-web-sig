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
    is_active = models.BooleanField(default=True)  # Campo para el borrado lógico
    
    class Meta:
        managed = False
        db_table = 'equipamiento_educacion'
    
    def update_data(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        self.save()
        
    def delete_location(self):
        self.is_active = False
        self.save()
    

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
    edad_65yma   = models.IntegerField(blank=True, null=True)

class CopasAgua(models.Model):
    gid = models.AutoField(primary_key=True)
    nombre_pro = models.CharField(max_length=254, blank=True, null=True)
    direccion_field = models.CharField(db_column='direccion_', max_length=254, blank=True, null=True)  # Field renamed because it ended with '_'.
    superficie = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    tipo = models.CharField(max_length=50, blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    geom = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'copas_agua'

class Electrolineras(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.FloatField(blank=True, null=True)
    nombre = models.CharField(max_length=50, blank=True, null=True)
    propiedad = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    tipologia = models.CharField(max_length=20, blank=True, null=True)
    geom = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'electrolineras'
    
class EstacionesDeServicio(models.Model):
    gid = models.AutoField(primary_key=True)
    razon_soci = models.CharField(max_length=254, blank=True, null=True)
    consultori = models.CharField(max_length=254, blank=True, null=True)
    tipologia = models.CharField(max_length=50, blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    geom = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'estaciones_de_servicio'

class PtasEsval(models.Model):
    gid = models.AutoField(primary_key=True)
    nom_obra = models.CharField(max_length=254, blank=True, null=True)
    estado_uso = models.CharField(max_length=254, blank=True, null=True)
    tip_tratam = models.CharField(max_length=254, blank=True, null=True)
    receptor = models.CharField(max_length=254, blank=True, null=True)
    utm_norte = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    utm_este = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    tipologia = models.CharField(max_length=20, blank=True, null=True)
    geom = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'ptas_esval'
    

class SubestacionesElectricas(models.Model):
    gid = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150, blank=True, null=True)
    propiedad = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=15, blank=True, null=True)
    coord_este = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    coord_nort = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    tipologia = models.CharField(max_length=50, blank=True, null=True)
    geom = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'subestaciones_electricas'
class Proyectos(models.Model):
    id = models.AutoField(primary_key=True)
    idiniciativa = models.IntegerField(blank=True, null=True)
    nombre_iniciativa = models.TextField(blank=True, null=True)
    tipologia = models.TextField(blank=True, null=True)
    fuente = models.TextField(blank=True, null=True)
    programa = models.TextField(blank=True, null=True)
    idmercado = models.TextField(blank=True, null=True)
    monto = models.BigIntegerField(blank=True, null=True)
    fecha_contrato = models.DateField(blank=True, null=True)
    fecha_termino = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proyectos'