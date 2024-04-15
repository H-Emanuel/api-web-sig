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
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    //className: 'map-tiles'
  }).addTo(map);
  return map;
}

// Agrega el control de capas al mapa
const controlLayers = L.control.layers().addTo(initializeMap());

// Definir un objeto para almacenar el recuento de equipamientos por origen
const equipamientoPorOrigen = {};

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
        
        // Incrementar el contador de equipamientos por origen
        equipamientoPorOrigen[origen] = (equipamientoPorOrigen[origen] || 0) + 1;
      });

      // Añade el grupo de capas al control de capas con la etiqueta correspondiente
      controlLayers.addOverlay(markerGroup, origen);

      // Una vez procesados los datos de todos los equipamientos, crear los gráficos
      if (Object.keys(equipamientoPorOrigen).length === urls.length) {
        crearGraficos();
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

function crearGraficos() {
  // Obtener los datos para el gráfico de barras
  const datosBarra = {
    etiquetas: Object.keys(equipamientoPorOrigen),
    valores: Object.values(equipamientoPorOrigen)
  };

  // Obtener los datos para el gráfico de pastel
  const totalEquipamientos = datosBarra.valores.reduce((total, valor) => total + valor, 0);
  const datosPastel = {
    etiquetas: datosBarra.etiquetas,
    valores: datosBarra.valores.map(valor => (valor / totalEquipamientos * 100).toFixed(2)) // Calcular porcentajes
  };

  // Crear gráfico de barras
  crearGraficoBarras(datosBarra.etiquetas, datosBarra.valores);

  // Crear gráfico de pastel
  crearGraficoPastel(datosPastel.etiquetas, datosPastel.valores);
}

function crearGraficoBarras(etiquetas, valores) {
  const ctx = document.getElementById('graficoBarras').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Cantidad de Equipamientos por Origen',
        data: valores,
        backgroundColor: 'white', // Color azul claro
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'white' // Color del texto en el eje Y en blanco
          }

        },
        x:{
          ticks: {
            color: 'white' // Color del texto en el eje Y en blanco
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'white' // Color de las etiquetas en blanco
          }
        }
      }
    }
  });
}


function crearGraficoPastel(etiquetas, valores) {
  const ctx = document.getElementById('graficoPastel').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: etiquetas,
      datasets: [{
        
        label: 'Porcentaje de Equipamientos por Origen',
        data: valores,
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)'], // Colores transparentes
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'white' 
          }
        },
        
        title: {
          display: true,
          text: 'Porcentaje de Equipamientos por Origen',
          color: 'white' 
        }
      }
    }
  });
}

// Llamar a la función procesarDatos con diferentes URLs
const urls = [
  { url: baseUrl + '/api/copasagua/', origen: 'Copas De Agua', icono: 'COPAS_AGUA.png' },
  { url: baseUrl + '/api/electrolinera/', origen: 'Electrolinera', icono: 'ELECTROLINERAS.png' },
  { url: baseUrl + '/api/estaciones/', origen: 'Estaciones', icono: 'ESTACION_DE_SERVICIO.png' },
  { url: baseUrl + '/api/esval/', origen: 'Esval', icono: 'PTAS_ESVAL.png' },
  { url: baseUrl + '/api/Subestaciones_electricasl/', origen: 'Subestaciones electricasl', icono: 'BIOENERGIA.png' }
];

urls.forEach(({ url, origen, icono }) => {
  procesarDatos(url, origen, icono);
});

