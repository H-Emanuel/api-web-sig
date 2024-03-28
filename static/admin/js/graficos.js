let baseUrl;

// Lógica para determinar la URL base de la API según el entorno
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Estás en un entorno local en Windows
    baseUrl = 'http://127.0.0.1:8000'; // O cualquier otra URL local que necesites en Windows
} else {
    // Estás en producción o en otro entorno diferente a localhost
    baseUrl = 'https://apisig.munivalpo.cl';
}

// Función para obtener los datos del censo desde la API
async function fetchData() {
    try {
        const response = await fetch(`${baseUrl}/api/censo`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del censo:', error);
    }
}

// Función para procesar los datos y crear los gráficos
async function createCharts() {
    const dataList = await fetchData();
    if (dataList) {
        // Crear arrays para almacenar los datos agregados de todos los objetos JSON
        let totalHombres = 0;
        let totalMujeres = 0;
        let total0a5 = 0;
        let total6a14 = 0;
        let total15a64 = 0;
        let total65yma = 0;
        let totalPers = 0;
        let totalVivi = 0;

        // Iterar sobre la lista de datos y agregarlos a los totales
        dataList.forEach(data => {
            totalHombres += data.hombres;
            totalMujeres += data.mujeres;
            total0a5 += data.edad_0a5;
            total6a14 += data.edad_6a14;
            total15a64 += data.edad_15a64;
            total65yma += data.edad_65yma;
            totalPers += data.total_pers;
            totalVivi += data.total_vivi;
        });

        // Gráfico de distribución por género
        const genderData = {
            labels: ['Hombres', 'Mujeres'],
            datasets: [{
                label: 'Distribución por género',
                data: [totalHombres, totalMujeres],
                backgroundColor: [
                    'rgb(55, 73, 98)', // Color azul para hombres
                    'rgb(61, 48, 82)' // Color naranja para mujeres
                ]

            }]
        };
        const genderCtx = document.getElementById('genderChart').getContext('2d');
        new Chart(genderCtx, {
            type: 'pie',
            data: genderData
        });

        // Gráfico de distribución por edad
        const ageData = {
            labels: ['0-5', '6-14', '15-64', '65+'],
            datasets: [{
                label: 'Distribución por edad',
                data: [total0a5, total6a14, total15a64, total65yma],
                backgroundColor: ['rgb(55, 73, 98)', 'rgb(55, 73, 98)', 'rgb(55, 73, 98)', 'rgb(55, 73, 98)']
            }]
        };
        const ageCtx = document.getElementById('ageChart').getContext('2d');
        new Chart(ageCtx, {
            type: 'bar',
            data: ageData
        });

        // Gráfico de total de personas y viviendas
        const populationData = {
            labels: ['Total Personas', 'Total Viviendas'],
            datasets: [{
                label: 'Total de personas y viviendas',
                data: [totalPers, totalVivi],
                backgroundColor: ['rgb(55, 73, 98)', 'rgb(55, 73, 98)']
            }]
        };
        const populationCtx = document.getElementById('populationChart').getContext('2d');
        new Chart(populationCtx, {
            type: 'bar',
            data: populationData
        });
    }
}

// Llamar a la función para crear los gráficos cuando la página se cargue
window.onload = createCharts;
