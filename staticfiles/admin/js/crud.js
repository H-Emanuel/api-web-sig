//const baseUrl = 'http://127.0.0.1:8000';
//const baseUrl = 'https://a415-200-50-126-98.ngrok-free.app';


function deleteLocation(gid) {
  const confirmation = confirm('¿Estás seguro de que deseas eliminar esta ubicación?');
  if (confirmation) {
    fetch(`${baseUrl}/delete/${gid}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        location.reload();
      })
      .catch((error) => console.error('Error al marcar la ubicación como eliminada:', error));
  }
}

function openEditDialog(gid) {
  fetch(`${baseUrl}/api/equipamientos/${gid}/`)
    .then((response) => response.json())
    .then((location) => {
      const csrftoken = getCookie('csrftoken');
      const formContent = `
      <h2>Editar Ubicación</h2>
      <form id="editForm" method="post" action="/edit/${gid}/">
        <input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}">
        <label for="nombre">Nombre:</label>
        <input type="text" name="nombre" value="${location.nombre}" /><br />
        <label for="nombre">Tipología:</label>
        <input type="text" name="tipologia" value="${location.tipologia}" /><br />
        <label for="nombre">Consultorio:</label>
        <input type="text" name="consultori" value="${location.consultori}" /><br />
        <input type="submit" value="Guardar cambios" />
      </form>
      `;
      const editPopup = L.popup()
        .setLatLng([location.y_coord, location.x_coord])
        .setContent(formContent)
        .openOn(map);

      document.getElementById('editForm').addEventListener('submit', function () {
        // Recargar las ubicaciones después de enviar el formulario
      });
    })
    .catch((error) => console.error('Error al cargar los detalles de la ubicación desde la API:', error));
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function closeCreateDialog(event) {
  const createContainer = document.getElementById('create-form-container');
  if (createContainer && !createContainer.contains(event.target)) {
    document.body.removeChild(createContainer);
    document.removeEventListener('mousedown', closeCreateDialog);
  }
}
