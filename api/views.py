from rest_framework import generics,status
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User

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

class UserRecordView(APIView):
    """
    API View to create or get a list of all the registered
    users. GET request returns the registered users whereas
    a POST request allows to create a new user.
    """
    permission_classes = [IsAdminUser]

    def get(self, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            serializer.create(validated_data=request.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "error": True,
                "error_msg": serializer.error_messages,
            },
            status=status.HTTP_400_BAD_REQUEST
        )

