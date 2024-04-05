let baseUrl;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Estás en un entorno local en Windows
    baseUrl = 'http://127.0.0.1:8000'; // O cualquier otra URL local que necesites en Windows
} else {
    // Estás en producción o en otro entorno diferente a localhost
    baseUrl = 'https://apisig.munivalpo.cl';
}

function initializeMap() {
  const initialView = [-33.0458, -71.6197];
  const map = L.map('map').setView(initialView, 14);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //className: 'map-tiles'
  }).addTo(map);
  return map;
}

// Agrega el control de capas al mapa
const controlLayers = L.control.layers().addTo(initializeMap());

function procesarDatos(url, origen, icono) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Crea un nuevo grupo de capas para este conjunto de marcadores
      const markerGroup = L.layerGroup();

      // Procesar los datos JSON y agregar marcadores al grupo de capas
      data.forEach(item => {
        const lat = item.y_coord || item.latitud;
        const lon = item.x_coord || item.longitud;

        let nombre = item.nombre_pro || item.razon_soci || item.nombre || '';

        const customIcon = L.icon({
          iconUrl: 'media/image/' + icono,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        const marker = L.marker([lat, lon], { icon: customIcon });

        marker.bindPopup(`<b>${nombre}</b><br>Coordenadas: (${lat}, ${lon})<br>Categoría: ${item.categoria || item.tipologia}<br>Consultorio: ${item.consultorio || ''}<br>Origen: ${origen}`);

        markerGroup.addLayer(marker); // Agrega el marcador al grupo de capas
      });

      // Añade el grupo de capas al control de capas con la etiqueta correspondiente
      controlLayers.addOverlay(markerGroup, origen);
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

// Llamar a la función procesarDatos con diferentes URLs
const urls = [
  { url: baseUrl + '/api/copasagua/', origen: 'Copas De Agua', icono: 'COPAS_AGUA.png' },
  { url: baseUrl + '/api/electrolinera/', origen: 'Electrolinera', icono: 'ELECTROLINERAS.png' },
  { url: baseUrl + '/api/estaciones/', origen: 'Estaciones', icono: 'ESTACION_DE_SERVICIO.png' },
  { url: baseUrl + '/api/esval/', origen: 'Esval', icono: 'PTAS_ESVAL.png' },
  { url: baseUrl + '/api/Subestaciones_electricasl/', origen: 'Subestaciones electricasl', icono: 'COPAS_AGUA.png' }
];

urls.forEach(({ url, origen, icono }) => {
  procesarDatos(url, origen, icono);
});
