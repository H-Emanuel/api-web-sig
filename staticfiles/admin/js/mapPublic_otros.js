let baseUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Estás en un entorno local en Windows
    baseUrl = 'http://127.0.0.1:8000'; // O cualquier otra URL local que necesites en Windows
} else {
    // Estás en producción o en otro entorno diferente a localhost
    baseUrl = 'https://apisig.munivalpo.cl';
}

const map = initializeMap();

// Crear un grupo de capas para los marcadores y agregarlo al mapa
let markerGroup = L.layerGroup().addTo(map);

let data; // Variable para almacenar datos

let isPolygonVisible = false;



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

function procesarDatos(url, origen) {
  fetch(url)
    .then(response => response.json()) // Parsear la respuesta JSON
    .then(data => {
      // Procesar los datos JSON y agregar marcadores al mapa
      data.forEach(item => {
        // Acceder a las coordenadas de cada objeto JSON
        const lat = item.y_coord || item.latitud;
        const lon = item.x_coord || item.longitud;
        
        // Obtener el nombre del proyecto o de la razón social según el tipo de datos
        let nombre = '';
        if (item.nombre_pro) {
          nombre = item.nombre_pro;
        } else if (item.razon_soci) {
          nombre = item.razon_soci;
        } else if (item.nombre) {
          nombre = item.nombre;
        }else if (item.nombre) {
          nombre = item.nombre;
        }
        
        const customIcon = L.icon({
          iconUrl: '/static/admin/img/proyecto.jpg',
          iconSize: [32, 32], // Tamaño del icono en píxeles
          iconAnchor: [16, 32], // Punto de anclaje del icono
          popupAnchor: [0, -32] // Punto de anclaje del popup
        });
        
        // Crear un marcador en la ubicación especificada con el icono personalizado
        const marker = L.marker([lat, lon]).addTo(markerGroup);
        
        // Agregar una etiqueta al marcador para indicar el origen de los datos
        marker.bindPopup(`<b>${nombre}</b><br>Coordenadas: (${lat}, ${lon})<br>Categoría: ${item.categoria || item.tipologia}<br>Consultorio: ${item.consultorio || ''}<br>Origen: ${origen}`).openPopup();
      });
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}


// Llamar a la función procesarDatos con diferentes URLs
// Llamar a la función procesarDatos con diferentes URLs
const urls = [
  { url: baseUrl + '/api/copasagua/', origen: 'Copas De Agua' },
  { url: baseUrl + '/api/electrolinera/', origen: 'Electrolinera' },
  { url: baseUrl + '/api/estaciones/', origen: 'Estaciones' },
  { url: baseUrl + '/api/esval/', origen: 'Esval' },
  { url: baseUrl + '/api/Subestaciones_electricasl/', origen: 'Subestaciones electricasl' },
  // Agrega más URLs aquí según sea necesario
];

urls.forEach(({ url, origen }) => {
  procesarDatos(url, origen);
});
