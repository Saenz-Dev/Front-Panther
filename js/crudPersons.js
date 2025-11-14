/**  CARGAR TABLA AL CARGAR PAGINA  **/

$(function () {
    getHTTP();
});

/**  CONSTANTES DE BOTONES DEL CRUD  **/

const btnActualizar = $('.btn-actualizar');

/**  CONSTANTE DE URL PARA ACCEDER A SERVICIOS RESTful  **/

const apiUrl = 'http://localhost/panther/rest/persons';

/**  LLAMADA A LA API CON METODO GET  **/

btnActualizar.on("click", function () {
    getHTTP();
});

function getHTTP() {
    const requestOptions = {
        headers: {
            'Authorization': localStorage.getItem('token')
        },
    }
    fetch(apiUrl, requestOptions)
        .then(response => { return response.json() })
        .then((data) => {
            console.log(data);
            llenarTabla(data.data);
            mostrarMensaje(true, "Tabla actualizada.")
        });
}

function llenarTabla(persons) {
    let tbody = $('tbody');
    tbody.empty();
    for (const person of persons) {
        tbody.append(row(person.id, person.name, person.lastName, person.phone));
    }
}

function row(id, name, lastName, phone) {
    return `
    <tr>
        <th scope="row">${id}</th>
        <td>${name}</td>
        <td>${lastName}</td>
        <td>${phone}</td>
        <td>
            <button class="btn btn-danger mx-2"><i class="bi bi-trash3-fill"></i></button>
            <button class="btn btn-warning mx-2"><i class="bi bi-pen-fill"></i></button>
        </td>
    </tr>`
}

function mostrarMensaje(success, mensaje) {
    const alert = $(".alert");
    alert.removeClass('alert-danger alert-success');
    if (success) alert.addClass('alert-success');
    if (!success) alert.addClass('alert-danger');
    alert.text(mensaje);
    alert.stop(true, true).fadeIn(400);
    alert.removeClass("d-none");
    setTimeout(() => {
        alert.fadeOut(500);
    }, 5000);
}

/**  AGREGAR PERSONAS  **/

function obtenerDatosCrearPersona() {
    return {
        name: $('#nombres').val(),
        lastName: $('#apellidos').val(),
        phone: $('#telefono').val()
    }
}

function validarDatosVacios() {
    
}

function postHTTP() {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(obtenerDatosCrearPersona())
    }
    fetch(apiUrl, requestOptions)
        .then(response => { return response.json(); })
        .then((data) => {
            console.log(data);
        });
}

$('#btn-crear-persona').on('click', function () {
    postHTTP();
    getHTTP();
})

