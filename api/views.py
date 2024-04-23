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


class CopasaguaList(generics.ListAPIView):
    queryset = CopasAgua.objects.all()
    serializer_class = CopasaguaSerializer
    
class CopasaguaDetail(generics.RetrieveAPIView):
    queryset = CopasAgua.objects.all()
    serializer_class = CopasaguaSerializer

class EstacionesdeservicioEsvalList(generics.ListAPIView):
    queryset = EstacionesDeServicio.objects.all()
    serializer_class = EstacionesdeservicioSerializer
class EstacionesdeservicioDetail(generics.RetrieveAPIView):
    queryset = EstacionesDeServicio.objects.all()
    serializer_class = EstacionesdeservicioSerializer

class ElectrolineraList(generics.ListAPIView):
    queryset = Electrolineras.objects.all()
    serializer_class = ElectrolineraSerializer
class ElectrolineraDetail(generics.RetrieveAPIView):
    queryset = Electrolineras.objects.all()
    serializer_class = ElectrolineraSerializer


class PtasEsvalList(generics.ListAPIView):
    queryset = PtasEsval.objects.all()
    serializer_class = PtasesvalSerializer
class PtasEsvalDetail(generics.RetrieveAPIView):
    queryset = PtasEsval.objects.all()
    serializer_class = PtasesvalSerializer

class SubestacionesElectricaslList(generics.ListAPIView):
    queryset = SubestacionesElectricas.objects.all()
    serializer_class = SubestacioneselectricasSerializer

class SubestacionesElectricaslDetail(generics.RetrieveAPIView):
    queryset = SubestacionesElectricas.objects.all()
    serializer_class = SubestacioneselectricasSerializer

class ProyectoList(generics.ListAPIView):
    queryset = Proyectos.objects.all()
    serializer_class = ProyectoSerializer

class ProyectolDetail(generics.RetrieveAPIView):
    queryset = Proyectos.objects.all()
    serializer_class = ProyectoSerializer


