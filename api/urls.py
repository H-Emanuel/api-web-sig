from django.urls import path
from . import views

urlpatterns = [
    path('equipamientos/', views.EquipamientoList.as_view(), name='equipamiento-list'),
    path('equipamientos/<int:pk>/', views.EquipamientoDetail.as_view(), name='equipamiento-detail'),
    path('limite/', views.limiteList.as_view(), name='limite-list'),
    path('censo/', views.CensoList.as_view(), name='censo-list'),
    path('censo/<int:pk>/', views.CensoDetail.as_view(), name='censo-detail'),
    
    path('copasagua/', views.CopasaguaList.as_view(), name='copasagua-list'),
    path('copasagua/<int:pk>/', views.CopasaguaDetail.as_view(), name='copasagua-detail'),

    path('electrolinera/', views.ElectrolineraList.as_view(), name='electrolinera-list'),
    path('electrolinera/<int:pk>/', views.ElectrolineraDetail.as_view(), name='electrolinera-detail'),  

    path('estaciones/', views.EstacionesdeservicioEsvalList.as_view(), name='estacion-list'),
    path('estaciones/<int:pk>/', views.EstacionesdeservicioDetail.as_view(), name='estacion-detail'),


    path('esval/', views.PtasEsvalList.as_view(), name='esval-list'),
    path('esval/<int:pk>/', views.PtasEsvalDetail.as_view(), name='esval-detail'),
    
    path('Subestaciones_electricasl/', views.SubestacionesElectricaslList.as_view(), name='censo-list'),
    path('Subestaciones_electricasl/<int:pk>/', views.SubestacionesElectricaslDetail.as_view(), name='censo-detail'),


]