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
        iconUrl: `${baseUrlMarker}/centro_educativo_icon.svg`,
    }),
    'EDUC BASICA Y MEDIA': L.icon({
        ...iconOptions,
        iconUrl: `${baseUrlMarker}/educ_basica_y_media_icon.svg`,
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
//document.body.classList.contains('body-light'); // Cambia el color de fondo de la página a blanco

// Activa el modo oscuro al cargar la página
mapContainer.classList.add('body-dark');

// Crea el control personalizado con el modo oscuro
const initialMode = 'light_mode';
const button = L.DomUtil.create('button', `custom-control-button btn-yellow`);
button.innerHTML = `<span class="material-symbols-outlined">${initialMode}</span>`;

// Agrega un manejador de eventos clic al botón
if (button) {
    button.addEventListener('click', function (event) {
        event.stopPropagation();

        // Toggle dark mode
        mapContainer.classList.toggle('body-dark');
        button.classList.toggle('btn-black');
        button.classList.toggle('btn-yellow');


        const newMode = mapContainer.classList.contains('body-dark') ? 'light_mode' : 'dark_mode';
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
        //document.body.style.backgroundColor = ''; // Restaura el color de fondo predeterminado
        document.body.classList.remove('body-light'); // Cambia el color de fondo de la página a blanco
        mapContainer.classList.add('body-dark');

        isLightMode = false;
        lightModeButton.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
        button.innerHTML = `<span class="material-symbols-outlined">light_mode</span>`;

    } else {
        // Cambiar a modo claro
        document.body.classList.add('body-light'); // Cambia el color de fondo de la página a blanco
        mapContainer.classList.remove('body-dark');
        button.innerHTML = `<span class="material-symbols-outlined">dark_mode</span>`;
        
        

        lightModeButton.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
        isLightMode = true;



    }


}

// Asociar la función al botón de modo claro
const lightModeButton = document.getElementById('light-mode-btn');

if (lightModeButton) {
    lightModeButton.addEventListener('click', function () {
        togglePageMode();
    });
}
