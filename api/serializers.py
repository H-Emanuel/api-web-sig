from rest_framework import serializers
from .models import *
from shapely.wkb import loads

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
        fields = ['id', 'uv','total_pers', 'total_vivi','hombres', 'mujeres','edad_0a5', 'edad_6a14','edad_15a64', 'edad_15a64','edad_65yma']
