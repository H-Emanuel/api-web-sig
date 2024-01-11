from rest_framework import generics
from .models import EquipamientoEducacion,Limite_poligono
from .serializers import EquipamientoSerializer,limiteSerializer

class EquipamientoList(generics.ListAPIView):
    queryset = EquipamientoEducacion.objects.all()
    serializer_class = EquipamientoSerializer

class EquipamientoDetail(generics.RetrieveAPIView):
    queryset = EquipamientoEducacion.objects.all()
    serializer_class = EquipamientoSerializer

class limiteList(generics.ListAPIView):
    queryset = Limite_poligono.objects.all()
    serializer_class = limiteSerializer

