from django.db.models import Max
from django.shortcuts import render, get_object_or_404, redirect
from api.models import EquipamientoEducacion
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def home(request):
    # Obtén todas las ubicaciones activas y ordénalas por el atributo "gid"
    locations = EquipamientoEducacion.objects.filter(is_active=True).order_by('gid')
    #return render(request, 'presentacion.html')
    return render(request, 'show_map.html', {'locations': locations})

from django.http import JsonResponse

@csrf_protect
def get_active_locations(request):
    # Obtén todas las ubicaciones activas y ordénalas por el atributo "gid"
    active_locations = EquipamientoEducacion.objects.filter(is_active=True).order_by('gid').values('gid', 'nombre', 'tipologia', 'consultori', 'poblacion', 'sum_sup_m2', 'sum_sup_to', 'geom', 'is_active')
    return JsonResponse(list(active_locations), safe=False)



@csrf_protect
def edit_location(request, gid):
    # Obtener la ubicación por su gid
    location = get_object_or_404(EquipamientoEducacion, gid=gid)

    if request.method == 'POST':
        # Actualizar datos de la ubicación con la información del formulario
        data = {
            'nombre': request.POST['nombre'],
            'tipologia': request.POST['tipologia'],
            'consultori': request.POST['consultori'],
        }
        location.update_data(data)
        return redirect('home')

    # Renderizar la página de edición con los detalles de la ubicación
    return JsonResponse({'message': 'Solicitud no válida.'}, status=400)

# views.py

@csrf_protect
def delete_location(request, gid):
    # Obtener la ubicación por su gid
    location = get_object_or_404(EquipamientoEducacion, gid=gid)

    if request.method == 'POST':
        # Marcar la ubicación como no activa si la solicitud es de tipo POST
        location.delete_location()
        return JsonResponse({'message': 'Ubicación eliminada correctamente.'})
    else:
        # Devolver un mensaje de error si la solicitud no es válida
        return JsonResponse({'message': 'Solicitud no válida.'}, status=400)


@csrf_protect
def create_location(request):
    if request.method == 'POST':
        # Obtener datos del formulario de creación
        data = {
            'nombre': request.POST['nombre'],
            'tipologia': request.POST['tipologia'],
            'consultori': request.POST['consultori'],
            'poblacion': request.POST['poblacion'],
            'sum_sup_m2': request.POST['sum_sup_m2'],
            'sum_sup_to': request.POST['sum_sup_to'],
            'geom': request.POST['geom'],
        }

        # Obtener el último valor de gid
        ultimo_gid = EquipamientoEducacion.objects.aggregate(Max('gid'))['gid__max']

        # Asignar un valor válido para gid
        nuevo_gid = ultimo_gid + 1 if ultimo_gid is not None else 1
        data['gid'] = nuevo_gid

        # Crear un nuevo objeto EquipamientoEducacion
        EquipamientoEducacion.objects.create(**data)
        
        return redirect('home')

    else:
        # Renderizar la página de creación con el formulario
        return print("ERROR")
    
    
