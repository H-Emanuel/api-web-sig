let baseUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Estás en un entorno local en Windows
    baseUrl = 'http://127.0.0.1:8000'; // O cualquier otra URL local que necesites en Windows
} else {
    // Estás en producción o en otro entorno diferente a localhost
    baseUrl = 'https://apisig.munivalpo.cl';
}


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

      //  <div style="font-family: monospace;">
      //  Lat : ${selectedLocation.y_coord.toFixed(4)}<br> 
      //  Long: ${selectedLocation.x_coord.toFixed(4)}<br>  
      //  </div>

      // Verificar si el ícono está definido antes de crear el marcador
      if (icon) {
        // Crear el marcador con el ícono personalizado
        const newMarker = L.marker([selectedLocation.y_coord, selectedLocation.x_coord], { icon })
          .bindPopup(`
            <strong>${selectedLocation.nombre}</strong><br>
            ${selectedLocation.tipologia}<br>
            
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
