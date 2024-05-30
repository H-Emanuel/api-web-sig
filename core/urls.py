from django.urls import path
from . import views

urlpatterns = [
    # Ruta para la página principal (mostrar el mapa)

    path('equipamiento', views.home, name="home"),


    path('infraestructura', views.homePublic, name="homePublic"),

    # Ruta para la página principal (mostrar el mapa)
    path('', views.DatosCenso, name="DatosCenso"),
    
    path('homeComplete/', views.homeComplete, name="homeComplete"),    

    # Ruta para editar una ubicación específica
    path('edit/<int:gid>/', views.edit_location, name='edit_location'),

    # Ruta para eliminar una ubicación específica
    path('delete/<int:gid>/', views.delete_location, name='delete_location'),
    
    path('create/', views.create_location, name='create_location'),
    
    path('barra/', views.Barra, name='Barra'),


    path('get_active_locations/', views.get_active_locations, name='get_active_locations'),
]
