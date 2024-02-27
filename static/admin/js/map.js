const baseUrl = window.location.origin;

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
//const showAllLocationsButton = document.getElementById('show-all-locations-button');
// BOTÓN DE POLÍGONO
const showPolygonButton = document.getElementById('show-polygon-button');
// Asignar la función al evento de clic del botón de creación
const createLocationButton = document.getElementById('create-location-button');
// Asignar la función al evento de clic del botón
showLocationButton.addEventListener('click', showSelectedLocation);
// showAllLocationsButton.addEventListener('click', showAllLocations);
//createLocationButton.addEventListener('click', openCreateDialog);
// showPolygonButton.addEventListener('click', showPolygon);
showPolygonButton.addEventListener('click', () => {
  showPolygon();
  //showPolygonButton.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 1.35)';
});

// Solicitud para obtener datos de la API
fetch(`${baseUrl}/get_active_locations/`)
  .then((response) => response.json())
  .then((responseData) => {
    // Filtrar las ubicaciones activas
    const activeLocations = responseData.filter(location => location.is_active);
    //console.log(activeLocations);

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
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //className: 'map-tiles'

  }).addTo(map);

  document.querySelector('#create-location-button-outMap').addEventListener('click', function () {
    // Llamar a openCreateDialog con las coordenadas
    if (latitude !== 0 && longitude !== 0) {
      openCreateDialog(latitude, longitude);
      markerGroup.clearLayers();

      latitude = 0;
      longitude = 0;
    } else {
      window.alert(`Error: error`);
    }
  });
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

      // Obtener el ícono correspondiente según la tipología
      const icon = icons[selectedLocation.tipologia];

      // Verificar si el ícono está definido antes de crear el marcador
      if (icon) {
        // Crear el marcador con el ícono personalizado
        const newMarker = L.marker([selectedLocation.y_coord, selectedLocation.x_coord], { icon })
          .bindPopup(`
            <strong>${selectedLocation.nombre}</strong><br>
            ${selectedLocation.tipologia}<br>
            Población: ${selectedLocation.poblacion}<br>
            <button class="edit-btn" onclick="openEditDialog(${selectedLocation.gid})">Editar</button>
            <button class="delete-btn" onclick="deleteLocation(${selectedLocation.gid})">Eliminar</button>
          `)
          .openPopup();

        markerGroup.addLayer(newMarker);
      } else {
        console.error('Ícono no definido para la tipología:', selectedLocation.tipologia);
      }
    })
    .catch((error) => console.error('Error al cargar los detalles de la ubicación desde la API:', error));
}

// Asigna la función al evento de clic del botón de mostrar todas las ubicaciones
//showAllLocationsButton.addEventListener('click', showAllLocations);

// Función para mostrar todas las ubicaciones según las tipologías seleccionadas
function showAllLocations() {
  // Limpiar marcadores
  markerGroup.clearLayers();

  // Obtener las imágenes seleccionadas
  const selectedImages = document.querySelectorAll('#tipology-percentages-info img.selected');
  // Obtener las tipologías seleccionadas a partir de las imágenes seleccionadas
  const selectedTipologies = Array.from(selectedImages).map(image => image.alt);

  // Solicitud para obtener datos de la API
  fetch(`${baseUrl}/get_active_locations/`)
    //fetch(`${baseUrl}/api/equipamientos/`)
    .then((response) => response.json())
    .then((responseData) => {
      // Filtrar ubicaciones por tipología si se selecciona una
      const filteredLocations = selectedTipologies.includes('all')
        ? responseData
        : responseData.filter((location) => selectedTipologies.includes(location.tipologia));
      filteredLocations.sort((a, b) => a.gid - b.gid); // Ordenar array según "gid"


      // Iterar sobre las ubicaciones filtradas y agregar un marcador
      filteredLocations.forEach((location) => {

        geom = location.geom
        // Obtener el ícono correspondiente según la tipología
        const icon = icons[location.tipologia];

        // Verificar si el ícono está definido antes de crear el marcador
        if (icon) {
          // Crear el marcador con el ícono personalizado
          const newMarker = L.marker(convertGeomToCoordinates(geom), { icon })
            .bindPopup(`
              <strong>${location.nombre}</strong><br>
              ${location.tipologia}<br>
              Población: ${location.poblacion}<br>
              <button class="edit-btn" onclick="openEditDialog(${location.gid})">Editar</button>
              <button class="delete-btn" onclick="deleteLocation(${location.gid})">Eliminar</button>
            `)
            .openPopup();

          markerGroup.addLayer(newMarker);
        } else {
          console.error('Ícono no definido para la tipología:', location.tipologia);
        }
      });
    })
    .catch((error) => console.error('Error al cargar los datos desde la API:', error));

}

function showPolygon() {
  // Limpiar todas las capas de polígonos existentes en el mapa
  map.eachLayer(layer => {
    if (layer instanceof L.Polygon) {
      map.removeLayer(layer);
    }
  });
  // Cambiar el estado de visibilidad del polígono
  isPolygonVisible = !isPolygonVisible;

  // Establecer el botón adecuado y su estilo según la visibilidad del polígono
  const showPolygonButton = document.getElementById('show-polygon-button');

  if (isPolygonVisible) {
    // Establecer el estilo del botón cuando el polígono está visible    
    showPolygonButton.classList.remove('btn-cyan');
    showPolygonButton.classList.add('btn-red');
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
                polygonPoints.push([polygonTest[1], polygonTest[0]]);
              }

              // Crear el polígono y agregarlo al mapa
              const polygon = L.polygon(polygonPoints).addTo(map);

              // Ajustar la vista del mapa para que todos los puntos del polígono sean visibles
              if (polygon) {
                map.fitBounds(polygon.getBounds());
              }
            });
          } else {
            console.error(`La geometría recibida (${polygonGeometry.type}) no es un polígono.`);
          }
        } else {
          console.error('No se encontró ningún polígono.');
        }
      })
      .catch((error) => console.error('Error al cargar el polígono desde la API:', error));
  } else {
    // Establecer el estilo del botón cuando el polígono está oculto     
    showPolygonButton.classList.remove('btn-red');
    showPolygonButton.classList.add('btn-cyan');
    console.log('Polígono oculto.');
  }
}

// Obtener el botón para seleccionar todas las imágenes
const selectAllButton = document.getElementById('select-all-button');
selectAllButton.addEventListener('click', selectAllImages);

// Variable para rastrear el estado de la selección
let isAllSelected = false;

// Función para seleccionar o deseleccionar todas las imágenes automáticamente
function selectAllImages() {
  // Obtén todas las imágenes en el contenedor de información de tipologías
  const tipologyImages = document.querySelectorAll('#tipology-percentages-info img');
  const newMode = selectAllButton.classList.contains('selected') ? 'visibility' : 'visibility_off';
  const initialMode = 'visibility';
  selectAllButton.innerHTML = `<span class="material-symbols-outlined">${initialMode}</span>`;

  // Verifica el estado actual de la selección
  if (!isAllSelected) {
    // Itera sobre todas las imágenes y añade la clase "selected"
    tipologyImages.forEach((image) => {
      image.classList.remove('selected');
      image.classList.add('non-selected');

      selectAllButton.innerHTML = `<span class="material-symbols-outlined">${newMode}</span>`;
    });

    isAllSelected = true; // Actualiza el estado de la selección
  } else {
    // Itera sobre todas las imágenes y elimina la clase "selected"
    tipologyImages.forEach((image) => {
      image.classList.add('selected');

      //selectAllButton.innerHTML = `<span class="material-symbols-outlined">${newMode}</span>`;

    });

    isAllSelected = false; // Actualiza el estado de la selección
  }
  showAllLocations();

}
