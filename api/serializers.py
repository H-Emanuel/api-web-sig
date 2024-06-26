from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import *
from shapely.wkb import loads
from django.contrib.auth.models import User



class EquipamientoSerializer(serializers.ModelSerializer):
    x_coord = serializers.SerializerMethodField()  # Coordenada X
    y_coord = serializers.SerializerMethodField()  # Coordenada Y

    def get_x_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        x_coord = shapely_geometry.x
        return x_coord

    def get_y_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        y_coord = shapely_geometry.y
        return y_coord

    class Meta:
        model = EquipamientoEducacion
        fields = ['gid', 'nombre', 'tipologia', 'consultori', 'poblacion', 'x_coord', 'y_coord','is_active']

class limiteSerializer(serializers.ModelSerializer):
    geom = serializers.SerializerMethodField()  # Campo personalizado para la geometría formateada

    def get_geom(self, obj):
        # Convierte el valor WKB a un objeto Shapely
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        # Convierte el objeto Shapely en una cadena multipolígono formateada
        multipolygon_str = shapely_geometry.wkt

        return multipolygon_str

    class Meta:
        model = Limite_poligono
        fields = ['gid', 'geom']

class censoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Censo
        fields = ['id', 'uv','total_pers', 'total_vivi','hombres', 'mujeres','edad_0a5', 'edad_6a14','edad_15a64', 'edad_15a64','edad_65yma','cerro']

class CopasaguaSerializer(serializers.ModelSerializer):
    x_coord = serializers.SerializerMethodField()  # Coordenada X
    y_coord = serializers.SerializerMethodField()  # Coordenada Y

    def get_x_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        x_coord = shapely_geometry.x
        return x_coord

    def get_y_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        y_coord = shapely_geometry.y
        return y_coord

    class Meta:
        model = CopasAgua
        fields = ['gid', 'nombre_pro', 'direccion_field', 'superficie','categoria', 'x_coord', 'y_coord']

class ElectrolineraSerializer(serializers.ModelSerializer):
    x_coord = serializers.SerializerMethodField()  # Coordenada X
    y_coord = serializers.SerializerMethodField()  # Coordenada Y

    def get_x_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        x_coord = shapely_geometry.x
        return x_coord

    def get_y_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        y_coord = shapely_geometry.y
        return y_coord

    class Meta:
        model = Electrolineras
        fields = ['gid', 'nombre', 'tipologia', 'x_coord', 'y_coord']

class EstacionesdeservicioSerializer(serializers.ModelSerializer):
    x_coord = serializers.SerializerMethodField()  # Coordenada X
    y_coord = serializers.SerializerMethodField()  # Coordenada Y

    def get_x_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        x_coord = shapely_geometry.x
        return x_coord

    def get_y_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        y_coord = shapely_geometry.y
        return y_coord

    class Meta:
        model = EstacionesDeServicio
        fields = ['gid', 'razon_soci', 'consultori','categoria', 'tipologia', 'x_coord', 'y_coord']

class PtasesvalSerializer(serializers.ModelSerializer):
    x_coord = serializers.SerializerMethodField()  # Coordenada X
    y_coord = serializers.SerializerMethodField()  # Coordenada Y

    def get_x_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        x_coord = shapely_geometry.x
        return x_coord

    def get_y_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        y_coord = shapely_geometry.y
        return y_coord

    class Meta:
        model = PtasEsval
        fields = ['gid', 'nom_obra', 'estado_uso', 'tip_tratam', 'receptor', 'utm_norte', 'utm_este', 'categoria', 'tipologia', 'x_coord', 'y_coord']

class SubestacioneselectricasSerializer(serializers.ModelSerializer):
    x_coord = serializers.SerializerMethodField()  # Coordenada X
    y_coord = serializers.SerializerMethodField()  # Coordenada Y

    def get_x_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        x_coord = shapely_geometry.x
        return x_coord

    def get_y_coord(self, obj):
        wkb_geometry = obj.geom
        shapely_geometry = loads(bytes.fromhex(wkb_geometry))

        y_coord = shapely_geometry.y
        return y_coord

    class Meta:
        model = SubestacionesElectricas
        fields = ['gid', 'nombre', 'propiedad', 'estado', 'coord_este', 'coord_nort', 'categoria', 'tipologia','x_coord', 'y_coord',]

class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos
        fields = ['id','idiniciativa', 'nombre_iniciativa', 'tipologia', 'fuente', 'programa', 'idmercado', 'monto', 'fecha_contrato','fecha_termino',]

class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = (
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
        )
        validators = [
            UniqueTogetherValidator(
                queryset=User.objects.all(),
                fields=['username', 'email']
            )
        ]