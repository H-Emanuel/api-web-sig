    // Función para crear las opciones del select con las "uv" disponibles
    async function createUvOptions() {
        const data = await fetchData();
        if (data) {
            const uvSelect = document.getElementById('uvSelect');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.uv;
                option.textContent = `UV ${item.uv}`;
                uvSelect.appendChild(option);
            });
        }
    }

    // Función para crear el gráfico según la "uv" seleccionada
    async function createChartByUv(selectedUv) {
        const data = await fetchData();
        if (data) {
            const selectedData = data.find(item => item.uv === selectedUv);
            if (selectedData) {
                // Eliminar el gráfico anterior si existe
                const existingChart = Chart.getChart('uvChart');
                if (existingChart) {
                    existingChart.destroy();
                }

                const uvChartCtx = document.getElementById('uvChart').getContext('2d');
                const uvChart = new Chart(uvChartCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Total Personas', 'Total Viviendas'],
                        datasets: [{
                            label: `UV ${selectedData.uv}`,
                            data: [selectedData.total_pers, selectedData.total_vivi],
                            backgroundColor: ['purple', 'gray']
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            }
        }
    }

    // Llamar a la función para crear las opciones del select cuando la página se cargue
    window.onload = () => {
        createUvOptions();
    };

    // Agregar un evento de cambio al select para generar el gráfico correspondiente
    document.getElementById('uvSelect').addEventListener('change', (event) => {
        const selectedUv = event.target.value;
        createChartByUv(selectedUv);
    });
