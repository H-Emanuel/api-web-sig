from rest_framework import generics
from .models import *
from .serializers import *

class EquipamientoList(generics.ListAPIView):
    queryset = EquipamientoEducacion.objects.all()
    serializer_class = EquipamientoSerializer

class EquipamientoDetail(generics.RetrieveAPIView):
    queryset = EquipamientoEducacion.objects.all()
    serializer_class = EquipamientoSerializer

class limiteList(generics.ListAPIView):
    queryset = Limite_poligono.objects.all()
    serializer_class = limiteSerializer

class CensoList(generics.ListAPIView):
    queryset = Censo.objects.all()
    serializer_class = censoSerializer
class CensoDetail(generics.RetrieveAPIView):
    queryset = Censo.objects.all()
    serializer_class = censoSerializer

