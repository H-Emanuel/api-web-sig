const baseUrl = 'http://127.0.0.1:8000';
//const baseUrl = 'https://a415-200-50-126-98.ngrok-free.app';

// Configuración inicial del mapa y capas
const map = initializeMap();

// Crear un grupo de capas para los marcadores y agregarlo al mapa
let markerGroup = L.layerGroup().addTo(map);

let data; // Variable para almacenar datos

let isPolygonVisible = false;

// Obtener el elemento select por su ID
const locationSelector = document.getElementById('locations');
// Obtener el botón por su ID
const showLocationButton = document.getElementById('show-location-button');
// Obtener el botón de mostrar todas las ubicaciones por su ID y asignar la función al evento de clic
const showAllLocationsButton = document.getElementById('show-all-locations-button');
// BOTÓN DE POLÍGONO
const showPolygonButton = document.getElementById('show-polygon-button');
// Asignar la función al evento de clic del botón de creación
const createLocationButton = document.getElementById('create-location-button');
// Asignar la función al evento de clic del botón
showLocationButton.addEventListener('click', showSelectedLocation);
showAllLocationsButton.addEventListener('click', showAllLocations);
//createLocationButton.addEventListener('click', openCreateDialog);
// showPolygonButton.addEventListener('click', showPolygon);
showPolygonButton.addEventListener('click', () => {
  showPolygon();
  showPolygonButton.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 1.35)';
});
// Solicitud para obtener datos de la API
fetch(`${baseUrl}/get_active_locations/`)
  .then((response) => response.json())
  .then((responseData) => {
    // Filtrar las ubicaciones activas
    const activeLocations = responseData.filter(location => location.is_active);

    activeLocations.sort((a, b) => a.gid - b.gid); // Ordenar array según "gid"

    // Llenar el menú desplegable con opciones
    activeLocations.forEach((location) => {
      const option = document.createElement('option');
      option.value = location.gid;
      option.text = location.nombre;

      locationSelector.appendChild(option);
    });
  })
  .catch((error) => console.error('Error al cargar los datos desde la API:', error));

// Funciones relacionadas con el mapa
function initializeMap() {
  const initialView = [-33.0458, -71.6197];
  const map = L.map('map').setView(initialView, 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

// Función para mostrar la ubicación seleccionada en el mapa
function showSelectedLocation() {
  const selectedLocationId = locationSelector.value;

  fetch(`${baseUrl}/api/equipamientos/${selectedLocationId}/`)
    .then((response) => response.json())
    .then((selectedLocation) => {
      console.log(selectedLocation);
      markerGroup.clearLayers();
      map.setView([selectedLocation.y_coord, selectedLocation.x_coord], 17);
      const newMarker = L.marker([selectedLocation.y_coord, selectedLocation.x_coord])
        .bindPopup(`
          <strong>${selectedLocation.nombre}</strong><br>
          ${selectedLocation.tipologia}<br>
          Población: ${selectedLocation.poblacion}<br>
          <button class="edit-btn" onclick="openEditDialog(${selectedLocation.gid})">Editar</button>
          <button class="delete-btn" onclick="deleteLocation(${selectedLocation.gid})">Eliminar</button>
        `)
        .openPopup();
      markerGroup.addLayer(newMarker);
    })
    .catch((error) => console.error('Error al cargar los detalles de la ubicación desde la API:', error));
}

// Función para mostrar todas las ubicaciones en el mapa
function showAllLocations() {
  // Limpiar marcadores
  markerGroup.clearLayers();

  // Obtener el valor seleccionado del filtro de tipologías
  const selectedTipology = document.getElementById('tipology-filter').value;

  // Solicitud para obtener datos de la API
  fetch(`${baseUrl}/api/equipamientos/`)
    .then((response) => response.json())
    .then((responseData) => {
      // Filtrar ubicaciones por tipología si se selecciona una
      const filteredLocations = selectedTipology
        ? responseData.filter((location) => location.tipologia === selectedTipology)
        : responseData;

      // Iterar sobre las ubicaciones filtradas y agregar un marcador
      filteredLocations.forEach((location) => {
        // Obtener el ícono correspondiente según la tipología
        const icon = icons[location.tipologia];

        // Crear el marcador con el ícono personalizado
        const newMarker = L.marker([location.y_coord, location.x_coord], { icon })
          .bindPopup(`
            <strong>${location.nombre}</strong><br>
            ${location.tipologia}<br>
            Población: ${location.poblacion}<br>
            <button class="edit-btn" onclick="openEditDialog(${location.gid})">Editar</button>
            <button class="delete-btn" onclick="deleteLocation(${location.gid})">Eliminar</button>
          `)
          .openPopup();

        markerGroup.addLayer(newMarker);
      });
    })
    .catch((error) => console.error('Error al cargar los datos desde la API:', error));
}



// FUNCIÓN PARA MOSTRAR EL POLÍGONO
function showPolygon() {
  // Limpiar todas las capas de polígonos existentes en el mapa
  map.eachLayer(layer => {
    if (layer instanceof L.Polygon) {
      map.removeLayer(layer);
    }
  });
  // Cambiar el estado de visibilidad del polígono
  isPolygonVisible = !isPolygonVisible;

  // Agregar un manejador de eventos para restaurar la sombra cuando el mouse deja el botón
  showPolygonButton.addEventListener('mouseleave', function () {
    // Eliminar cualquier clase de sombra que se haya agregado al pasar el cursor sobre el botón    
    showPolygonButton.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 1.35)';
  });

  if (isPolygonVisible) {
    showPolygonButton.textContent = 'Ocultar Polígono';
    showPolygonButton.style.backgroundColor = '#E73C45';
    showPolygonButton.style.color = 'white';
    showPolygonButton.addEventListener('mouseover', () => {
      showPolygonButton.style.boxShadow = '0px 0px 5px 5px #E73C45';
    });
    // Resto del código para mostrar el polígono

    // Definir la proyección UTM actual (ajustar según sea necesario)
    const utmProjection = '+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs';

    // Solicitud para obtener el polígono desde la API
    fetch(`${baseUrl}/api/limite/`)
      .then((response) => response.json())
      .then((polygonData) => {
        // Verificar si se obtuvo algún dato
        if (polygonData.length > 0) {
          // Obtener la geometría WKT del primer polígono
          const polygonGeometryWKT = polygonData[0].geom;

          // Utilizar wellknown para analizar la geometría WKT
          const polygonGeometry = wellknown.parse(polygonGeometryWKT);
          //console.log(polygonGeometry);

          // Función para convertir [Norte, Este] a grado decimal usando proj4
          const convertToDecimalDegrees = (coordinate) => {
            const [longitude, latitude] = proj4(utmProjection, 'WGS84', coordinate);
            return { latitude, longitude };
          };

          // Verificar el tipo de geometría
          if (polygonGeometry.type === 'Polygon') {
            // Para polígonos simples, tomar solo el primer conjunto de coordenadas
            const coordinates = polygonGeometry.coordinates[0];

            // Imprimir las latitudes y longitudes convertidas por separado
            console.log('Latitudes (Grado Decimal):');
            coordinates.forEach(coord => console.log(convertToDecimalDegrees(coord)));
          } else if (polygonGeometry.type === 'MultiPolygon') {
            // Almacenar las coordenadas convertidas para cada polígono
            const polygons = polygonGeometry.coordinates.map((polygon, index) => {
              //console.log(`Polígono ${index + 1} (Grado Decimal):`);
              const convertedCoords = polygon[0].map(coord => convertToDecimalDegrees(coord));

              // Comprobar si convertedCoords es undefined o vacío
              if (!convertedCoords || convertedCoords.length === 0) {
                console.error('Coordenadas convertidas no válidas.');
                return null;  // Devolver null para indicar un problema
              }

              // Crear un arreglo para almacenar los pares ordenados de coordenadas
              const coordinatesArray = [];

              // Recorrer todas las coordenadas convertidas
              convertedCoords.forEach(coord => {
                // Comprobar si coord es undefined
                if (coord) {
                  // Almacenar cada par ordenado de coordenadas en el arreglo
                  coordinatesArray.push([coord.longitude, coord.latitude]);
                } else {
                  console.error('Coordenada no válida encontrada.');
                }
              });

              return coordinatesArray;  // Retornar las coordenadas convertidas
            });

            // Filtrar los polígonos con coordenadas válidas
            const validPolygons = polygons.filter(polygon => polygon !== null);

            // Crear un polígono con los pares ordenados de coordenadas y agregarlo al mapa
            validPolygons.forEach(coordinatesArray => {
              // Crear un arreglo para almacenar los puntos del polígono
              const polygonPoints = [];
              for (let i = 0; i < coordinatesArray.length; i++) {
                const polygonTest = coordinatesArray[i];
                //console.log(`Elemento ${i}:`, polygonTest);
                //console.log(`Latitud: ${polygonTest[0]}`);
                //console.log(`Longitud: ${polygonTest[1]}`);
                // Agregar el punto al arreglo
                polygonPoints.push([polygonTest[1], polygonTest[0]]);
              }

              // Crear el polígono y agregarlo al mapa
              const polygon = L.polygon(polygonPoints).addTo(map);

              // Ajustar la vista del mapa para que todos los puntos del polígono sean visibles
              if (polygon) {
                map.fitBounds(polygon.getBounds());
              }
              //console.log(coordinatesArray);

            });
            // Hacer algo con la variable 'validPolygons' si es necesario
            // console.log('Todas las coordenadas convertidas:', validPolygons);
          } else {
            console.error(`La geometría recibida (${polygonGeometry.type}) no es un polígono.`);
          }
        } else {
          console.error('No se encontró ningún polígono.');
        }
      })
      .catch((error) => console.error('Error al cargar el polígono desde la API:', error));

  } else {
    showPolygonButton.textContent = 'Mostrar Polígono';
    showPolygonButton.style.backgroundColor = '#4BBFE0';
    showPolygonButton.style.color = 'white';
    showPolygonButton.addEventListener('mouseover', () => {
      showPolygonButton.style.boxShadow = '0px 0px 5px 5px #4BBFE0';
    });
    // Si el polígono no está visible, no hacer nada o puedes mostrar un mensaje, etc.
    console.log('Polígono oculto.');
  }
}

// map.js

// Función para eliminar una ubicación
function deleteLocation(gid) {
  const confirmation = confirm('¿Estás seguro de que deseas eliminar esta ubicación?');
  if (confirmation) {
    fetch(`${baseUrl}/delete/${gid}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        location.reload();
      })
      .catch((error) => console.error('Error al marcar la ubicación como eliminada:', error));
  }
}




function openEditDialog(gid) {
  // Obtener detalles de la ubicación para el gid especificado
  fetch(`${baseUrl}/api/equipamientos/${gid}/`)
    .then((response) => response.json())
    .then((location) => {
      const csrftoken = getCookie('csrftoken');
      // Crear el contenido del formulario
      const formContent = `
      <h2>Editar Ubicación</h2>
        <form id="editForm" method="post" action="/edit/${gid}/">
          <input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}">
          <label for="nombre">Nombre:</label>
          <input type="text" name="nombre" value="${location.nombre}" /><br />
          <label for="tipologia">Tipología:</label>
          <select name="tipologia" required>
            <option value="CENTRO EDUCATIVO">CENTRO EDUCATIVO</option>
            <option value="EDUC BASICA Y MEDIA">EDUC BASICA Y MEDIA</option>
            <option value="EDUC ESPECIAL">EDUC ESPECIAL</option>
            <option value="EDUC MEDIA">EDUC MEDIA</option>
            <option value="EDUC PRE Y BASICA">EDUC PRE Y BASICA</option>
            <option value="EDUC SUPERIOR">EDUC SUPERIOR</option>
            <option value="EDUC TECNICA">EDUC TECNICA</option>
            <option value="JARDIN INFANTIL">JARDIN INFANTIL</option>
          </select><br />
          <label for="nombre">Consultorio:</label>
        <input type="text" name="consultori" value="${location.consultori}" /><br />
          <input type="submit" value="Guardar cambios" />
        </form>
      `;
      // Crear y abrir un popup personalizado con el formulario de edición
      const editPopup = L.popup()
        .setLatLng([location.y_coord, location.x_coord])
        .setContent(formContent)
        .openOn(map);

      // Agregar un manejador de eventos para recargar las ubicaciones después de enviar el formulario
      document.getElementById('editForm').addEventListener('submit', function () {
        // Recargar las ubicaciones después de enviar el formulario

      });
    })
    .catch((error) => console.error('Error al cargar los detalles de la ubicación desde la API:', error));
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Buscar el nombre de la cookie con el prefijo del token CSRF
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function closeCreateDialog(event) {
  const createContainer = document.getElementById('create-form-container');
  if (createContainer && !createContainer.contains(event.target)) {
    // Cerrar la ventana flotante solo si el clic ocurrió fuera del contenedor
    document.body.removeChild(createContainer);
    document.removeEventListener('mousedown', closeCreateDialog);
  }
}



// Agregar un evento de clic al mapa para permitir que los usuarios coloquen un marcador
map.on('click', function (e) {
  const latitude = e.latlng.lat;
  const longitude = e.latlng.lng;

  // Eliminar cualquier marcador existente
  markerGroup.clearLayers();

  // Crear un nuevo marcador en la ubicación del clic
  const newMarker = L.marker([latitude, longitude])
    .addTo(markerGroup);

  // Agregar un popup al marcador con el botón "Crear Nueva Ubicación"
  newMarker.bindPopup(`
  <strong>Ubicación seleccionada: </strong><br><div id="div-monospace">Lat : ${latitude}<br>Long: ${longitude}<br></div>
    <button id="create-location-button">Crear Nueva Ubicación</button>
  `);

  // Agregar un evento de clic al botón "Crear Nueva Ubicación" dentro del popup
  newMarker.on('popupopen', function () {
    document.querySelector('#create-location-button').addEventListener('click', function () {
      // Llamar a openCreateDialog con las coordenadas
      openCreateDialog(latitude, longitude);
    });
  });

  // Enviar las coordenadas al servidor o realizar otras operaciones aquí
  console.log('Coordenadas seleccionadas: ', latitude, longitude);
});

function convertToHexWKB(latitude, longitude) {
  // Convertir la latitud y la longitud a números flotantes
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  // Convertir la latitud y la longitud a bytes
  const latBytes = new Float64Array([lat]).buffer;
  const lonBytes = new Float64Array([lon]).buffer;

  // Convertir los bytes de latitud y longitud a una cadena hexadecimal
  const latHex = Array.from(new Uint8Array(latBytes))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  const lonHex = Array.from(new Uint8Array(lonBytes))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  // Concatenar las cadenas hexadecimal de latitud y longitud en el formato WKB
  const wkb = `0101000020E6100000${lonHex}${latHex}`; // Concatenar según el formato WKB

  return wkb.toUpperCase(); // Devolver la cadena en mayúsculas
}

function openCreateDialog(latitude, longitude) {
  if (latitude !== undefined && longitude !== undefined) {
    const csrftoken = getCookie('csrftoken');
    const formContent = `  
      <h2>Crear Nueva Ubicación</h2>
      <form id="createForm" method="post" action="/create/">
        <input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}">
        <label for="nombre">Nombre:</label>
        <input type="text" name="nombre" required /><br />
        <label for="tipologia">Tipología:</label>
        <select name="tipologia" required>
          <option value="CENTRO EDUCATIVO">CENTRO EDUCATIVO</option>
          <option value="EDUC BASICA Y MEDIA">EDUC BASICA Y MEDIA</option>
          <option value="EDUC ESPECIAL">EDUC ESPECIAL</option>
          <option value="EDUC MEDIA">EDUC MEDIA</option>
          <option value="EDUC PRE Y BASICA">EDUC PRE Y BASICA</option>
          <option value="EDUC SUPERIOR">EDUC SUPERIOR</option>
          <option value="EDUC TECNICA">EDUC TECNICA</option>
          <option value="JARDIN INFANTIL">JARDIN INFANTIL</option>
        
        </select><br />
        <label for="consultori">Consultorio:</label>
        <input type="text" name="consultori" required /><br />
        <label for="poblacion">Poblacion:</label>
        <input type="number" name="poblacion" required /><br />
        <label for="sum_sup_m2">Superficie (m²):</label>
        <input type="number" step="0.01e20" name="sum_sup_m2" required /><br />
        <label for="sum_sup_to">Superficie Total:</label>
        <input type="number" step="0.01e20" name="sum_sup_to" required /><br />
        <label for="geom">Geometría:</label>
        <!-- Autocompletar el campo de geometría con las coordenadas -->
        <input type="text" name="geom" value="${convertToHexWKB(latitude, longitude)}" required readonly /><br />
        <input type="submit" value="Crear ubicación" />
      </form>  
    `;

    const createContainer = document.createElement('div');
    createContainer.id = 'create-form-container';
    createContainer.innerHTML = formContent;

    // Agregar el contenedor a la página
    document.body.appendChild(createContainer);

    // Ajustar el índice Z del contenedor
    createContainer.style.zIndex = '1000';

    // Cerrar la ventana flotante si se hace clic fuera de ella
    document.addEventListener('mousedown', closeCreateDialog);

    // Agregar un manejador de eventos para recargar las ubicaciones después de enviar el formulario
    document.getElementById('createForm').addEventListener('submit', function () {
      // Recargar las ubicaciones después de enviar el formulario

    });
  }
}
// Obtener el botón por su ID
const showTipologyInfoButton = document.getElementById('show-tipology-percentages-button');

// Asignar la función al evento de clic del botón
showTipologyInfoButton.addEventListener('click', showTipologyInfo);

// Variable de estado para alternar entre porcentajes y cantidades
let showPercentages = true;

// Función para inicializar la información sobre las tipologías
function initializeTipologyInfo() {
  const tipologyInfoContainer = document.getElementById('tipology-percentages-info');

  // Limpiar el contenido previo del contenedor
  tipologyInfoContainer.innerHTML = '';

  // Mostrar la información de las tipologías al cargar la página
  showTipologyInfo();
}

// Función para mostrar la información sobre las tipologías
function showTipologyInfo() {
  const tipologyInfoContainer = document.getElementById('tipology-percentages-info');

  // Limpiar el contenido previo del contenedor
  tipologyInfoContainer.innerHTML = '';

  // Solicitud para obtener datos de la API
  fetch(`${baseUrl}/api/equipamientos/`)
    .then((response) => response.json())
    .then((responseData) => {
      // Inicializar un objeto para contar las ubicaciones por tipología
      const tipologyCounts = {
        'CENTRO EDUCATIVO': 0,
        'EDUC BASICA Y MEDIA': 0,
        'EDUC ESPECIAL': 0,
        'EDUC MEDIA': 0,
        'EDUC PRE Y BASICA': 0,
        'EDUC SUPERIOR': 0,
        'EDUC TECNICA': 0,
        'JARDIN INFANTIL': 0
      };

      // Contar las ubicaciones por tipología
      responseData.forEach((location) => {
        tipologyCounts[location.tipologia] += 1;
      });

      // Calcular el total de ubicaciones
      const totalLocations = responseData.length;

      // Crear un elemento <ul> para mostrar la información
      const infoList = document.createElement('ul');

      // Calcular y agregar la información al elemento <ul>
      for (const tipologia in tipologyCounts) {
        if (tipologyCounts.hasOwnProperty(tipologia)) {
          const count = tipologyCounts[tipologia];

          // Mostrar porcentajes o cantidades según el estado actual
          const infoValue = showPercentages ? (count / totalLocations) * 100 : count;

          const infoItem = document.createElement('li');
          infoItem.textContent = `${tipologia}: ${infoValue.toFixed(showPercentages ? 2 : 0)} ${showPercentages ? '%' : 'ubicaciones'}`;
          infoList.appendChild(infoItem);
        }
      }

      // Agregar la lista de información al contenedor
      tipologyInfoContainer.appendChild(infoList);
    })
    .catch((error) => console.error('Error al cargar los datos desde la API:', error));

  // Alternar el estado para la próxima vez
  showPercentages = !showPercentages;
}

// Llamar a la función para inicializar la información sobre las tipologías al cargar la página
initializeTipologyInfo();

// Define los íconos personalizados para cada tipología
const iconOptions = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
};

const icons = {
  'CENTRO EDUCATIVO': L.icon({
    ...iconOptions,
    iconUrl: '{% staticfiles "admin/img/centro_educativo_icon.png" %}',
  }),

  // Agrega íconos para las demás tipologías aquí
};
