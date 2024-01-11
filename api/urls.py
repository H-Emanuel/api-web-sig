from django.urls import path
from . import views

urlpatterns = [
    path('equipamientos/', views.EquipamientoList.as_view(), name='equipamiento-list'),
    path('equipamientos/<int:pk>/', views.EquipamientoDetail.as_view(), name='equipamiento-detail'),
    path('limite/', views.limiteList.as_view(), name='limite-list'),
]