const baseUrlMarker = `${baseUrl}/staticfiles/admin/img`;

// Define los íconos personalizados para cada tipología
const iconOptions = {
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
};

const icons = {
    'CENTRO EDUCATIVO': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/centro_educativo_icon.png`,
    }),
    'EDUC BASICA Y MEDIA': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/educ_basica_y_media_icon.png`,
    }),
    'EDUC ESPECIAL': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/educ_especial_icon.png`,
    }),
    'EDUC MEDIA': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/educ_media_icon.png`,
    }),
    'EDUC PRE Y BASICA': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/educ_pre_y_basica_icon.png`,
    }),
    'EDUC SUPERIOR': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/educ_superior_icon.png`,
    }),
    'EDUC TECNICA': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/educ_tecnica_icon.png`,
    }),
    'JARDIN INFANTIL': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/jardin_infantil_icon.png`,
    }),
    // Agrega íconos para las demás tipologías aquí
};

// Obtén el contenedor del mapa y el botón de alternancia de modo
const mapContainer = document.getElementById('map-container');
const toggleModeButton = document.getElementById('toggle-mode-btn');

// Activa el modo oscuro al cargar la página
mapContainer.classList.add('dark-mode');

// Crea el control personalizado con el modo oscuro
const initialMode = 'light_mode';
const button = L.DomUtil.create('button', `custom-control-button btn-yellow`);
button.innerHTML = `<span class="material-symbols-outlined">${initialMode}</span>`;

// Agrega un manejador de eventos clic al botón
if (button) {
    button.addEventListener('click', function (event) {
        event.stopPropagation();

        // Toggle dark mode
        mapContainer.classList.toggle('dark-mode');
        button.classList.toggle('btn-black');
        button.classList.toggle('btn-yellow');

        const newMode = mapContainer.classList.contains('dark-mode') ? 'light_mode' : 'dark_mode';
        button.innerHTML = `<span class="material-symbols-outlined">${newMode}</span>`;
    });
}

// Agrega el control personalizado al mapa
const customControl = L.Control.extend({
    onAdd: function (map) {
        return button;
    },
});

const customControlInstance = new customControl();
customControlInstance.addTo(map);


// Variable para controlar el estado del modo
let isLightMode = false;

// Función para cambiar entre el modo claro y el modo normal
function togglePageMode() {
    const lightModeButton = document.getElementById('light-mode-btn');

    if (isLightMode) {
        // Cambiar a modo normal
        document.body.classList.remove('body-light'); // Cambia el color de fondo de la página a blanco

        document.body.style.backgroundColor = ''; // Restaura el color de fondo predeterminado
        isLightMode = false;

        // Cambia las clases del botón
        lightModeButton.classList.remove('btn-black');
        lightModeButton.classList.add('btn-yellow');
        mapContainer.classList.add('dark-mode');
        mapContainer.classList.remove('map-container-light');
        

        lightModeButton.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
    } else {
        // Cambiar a modo claro
        document.body.classList.add('body-light'); // Cambia el color de fondo de la página a blanco

        isLightMode = true;

        // Cambia las clases del botón
        lightModeButton.classList.remove('btn-yellow');
        lightModeButton.classList.add('btn-black');
        mapContainer.classList.remove('dark-mode');
        mapContainer.classList.add('map-container-light');
        lightModeButton.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
    }
}

// Asociar la función al botón de modo claro
const lightModeButton = document.getElementById('light-mode-btn');

if (lightModeButton) {
    lightModeButton.addEventListener('click', function () {
        togglePageMode();
    });
}
