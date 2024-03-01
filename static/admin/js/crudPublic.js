// Funciones CRUD
// Agregar un evento de clic al mapa para permitir que los usuarios coloquen un marcador
let latitude = 0;
let longitude = 0;
map.on('click', function (e) {
  latitude = e.latlng.lat.toFixed(4); // Limitar a cuatro dígitos después de la coma
  longitude = e.latlng.lng.toFixed(4); // Limitar a cuatro dígitos después de la coma

  // Eliminar cualquier marcador existente
  markerGroup.clearLayers();

  // Crear un nuevo marcador en la ubicación del clic
  const newMarker = L.marker([latitude, longitude])
    .addTo(markerGroup);

  // Agregar un popup al marcador con el botón "Crear Nueva Ubicación"
  newMarker.bindPopup(`
  <strong>Ubicación seleccionada: </strong><br><div id="div-monospace">Lat : ${latitude}<br>Long: ${longitude}<br></div>
    
  `);
  console.log('Coordenadas seleccionadas: ', latitude, longitude);
});




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


function convertGeomToCoordinates(geom) {

  // Extraer los bytes de latitud y longitud del dato geom
  const lonHex = geom.substring(18, 34);
  const latHex = geom.substring(34, 50);

  // Convertir las cadenas hexadecimales a bytes
  const lonBytes = Uint8Array.from(lonHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const latBytes = Uint8Array.from(latHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  // Convertir los bytes a números flotantes (longitude y latitude)
  const lon = new Float64Array(lonBytes.buffer)[0];
  const lat = new Float64Array(latBytes.buffer)[0];

  return { lat, lon };
}


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



// Funciones de información tipológica
// Obtener el botón por su ID
const showTipologyInfoButton = document.getElementById('show-tipology-percentages-button');

// Asignar la función al evento de clic del botón
showTipologyInfoButton.addEventListener('click', obtenerCantidadUbicacionesPorTipologia);

// Variables para controlar el estado del interruptor
//let showPercentages = false; // Inicialmente, mostrar números enteros
// Variable de estado para alternar entre porcentajes y cantidades
let showPercentages = true;
// Función para inicializar la información sobre las tipologías
function initializeTipologyInfo() {
  const tipologyInfoContainer = document.getElementById('tipology-percentages-info');

  // Limpiar el contenido previo del contenedor
  tipologyInfoContainer.innerHTML = '';

  // Mostrar la información de las tipologías al cargar la página
  obtenerCantidadUbicacionesPorTipologia();
}

// Variable global para almacenar las tipologías seleccionadas
let selectedTipologies = [];

// Obtener el botón para mostrar porcentajes o números enteros
const toggleButton = document.getElementById('show-tipology-percentages-button');

// Agregar un evento de clic al botón
toggleButton.addEventListener('click', function () {
  // Cambiar el estado del interruptor
  showPercentages = !showPercentages;

  // Llamar a la función para obtener los datos con el nuevo estado del interruptor
  obtenerCantidadUbicacionesPorTipologia();
});

// Función para obtener la cantidad de ubicaciones por tipología
function obtenerCantidadUbicacionesPorTipologia() {
  // Elemento HTML donde se mostrarán los resultados
  const resultadosContainer = document.getElementById('tipology-percentages-info');

  // Realizar la solicitud HTTP para obtener los datos de la base de datos
  fetch(`${baseUrl}/get_active_locations/`)
    .then(response => response.json())
    .then(data => {
      // Objeto para almacenar la cantidad de ubicaciones por tipología
      const cantidadPorTipologia = {};

      // Iterar sobre los datos recibidos de la base de datos
      data.forEach(ubicacion => {
        // Verificar si la tipología ya está registrada en el objeto
        if (cantidadPorTipologia.hasOwnProperty(ubicacion.tipologia)) {
          // Incrementar la cantidad de ubicaciones para esta tipología
          cantidadPorTipologia[ubicacion.tipologia]++;
        } else {
          // Inicializar la cantidad de ubicaciones para esta tipología
          cantidadPorTipologia[ubicacion.tipologia] = 1;
        }
      });

      // Crear el contenido HTML para mostrar los resultados
      let resultadosHTML = '';
      for (const tipologia in cantidadPorTipologia) {
        if (cantidadPorTipologia.hasOwnProperty(tipologia)) {
          // Calcular el valor a mostrar según el estado del interruptor
          const valor = showPercentages ? ((cantidadPorTipologia[tipologia] / data.length) * 100).toFixed(2) : cantidadPorTipologia[tipologia];

          // Obtener el ícono correspondiente a la tipología
          const icono = icons[tipologia];
          let iconoHTML = '';

          // Verificar si existe un ícono para la tipología
          if (icono) {
            // Añadir el evento de clic a la imagen de la tipología y verificar si está seleccionada
            const isSelected = selectedTipologies.includes(tipologia) ? 'selected' : '';
            iconoHTML = `<img src="${icono.options.iconUrl}" alt="${tipologia}" class="${isSelected}" style="width: ${icono.options.iconSize[0]}px; height: ${icono.options.iconSize[1]}px;" onclick="toggleSelected(this)">`;
          }

          resultadosHTML += `<p>${iconoHTML} ${tipologia}  <br>${valor}${showPercentages ? '%' : ' ubicaciones'}</p>`;
        }
      }

      // Mostrar los resultados en el contenedor
      resultadosContainer.innerHTML = resultadosHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
      // Mostrar un mensaje de error en el contenedor
      resultadosContainer.innerHTML = '<p>Error al obtener los datos. Por favor, inténtalo de nuevo más tarde.</p>';
    });
}

function toggleSelected(image) {
  image.classList.toggle('selected');
  updateSelectedTipologies();
}

function updateSelectedTipologies() {
  // Reiniciar la lista de tipologías seleccionadas
  selectedTipologies = [];

  // Obtener las imágenes seleccionadas y agregar las tipologías correspondientes a la lista
  const selectedImages = document.querySelectorAll('#tipology-percentages-info img.selected');
  selectedImages.forEach(image => {
    selectedTipologies.push(image.alt);
  });

  // Actualizar las ubicaciones en el mapa con las nuevas tipologías seleccionadas
  showLocationsBySelectedTipology();
}

function showLocationsBySelectedTipology() {
  // Limpiar marcadores
  markerGroup.clearLayers();

  // Solicitud para obtener datos de la API
  fetch(`${baseUrl}/get_active_locations/`)
    .then((response) => response.json())
    .then((responseData) => {
      // Filtrar ubicaciones por tipología si se selecciona una
      const filteredLocations = selectedTipologies.includes('all')
        ? responseData
        : responseData.filter((location) => selectedTipologies.includes(location.tipologia));
      filteredLocations.sort((a, b) => a.gid - b.gid); // Ordenar array según "gid"

      // Iterar sobre las ubicaciones filtradas y agregar un marcador
      filteredLocations.forEach((location) => {
        const geom = location.geom;
        // Obtener el ícono correspondiente según la tipología
        const icon = icons[location.tipologia];

        // Verificar si el ícono está definido antes de crear el marcador
        if (icon) {
          // Crear el marcador con el ícono personalizado
          const newMarker = L.marker(convertGeomToCoordinates(geom), { icon })
            .bindPopup(`
              <strong>${location.nombre}</strong><br>
              ${location.tipologia}<br>              
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
// Obtener el botón "Select All"
const selectAllButton = document.getElementById('select-all-button');

// Agregar un evento de clic al botón
selectAllButton.addEventListener('click', function () {
  // Obtener todas las imágenes de tipología
  const tipologyImages = document.querySelectorAll('#tipology-percentages-info img');

  // Iterar sobre las imágenes y alternar la clase "selected"
  tipologyImages.forEach(image => {
    image.classList.toggle('selected');
  });

  // Actualizar las tipologías seleccionadas y mostrar las ubicaciones en el mapa
  updateSelectedTipologies();

  // Obtener el icono dentro del botón
  const iconSpan = selectAllButton.querySelector('span.material-symbols-outlined');

  // Alternar entre los iconos de visibilidad
  if (iconSpan.innerHTML === 'visibility') {
    iconSpan.innerHTML = 'visibility_off';
  } else {
    iconSpan.innerHTML = 'visibility';
  }
});


// Llamar a la función para inicializar la información sobre las tipologías al cargar la página
initializeTipologyInfo();