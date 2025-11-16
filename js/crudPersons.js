/**  CARGAR TABLA AL CARGAR PAGINA  **/

$(function () {
    getHTTP();
});

/**  CONSTANTES DE BOTONES DEL CRUD  **/

const btnActualizar = $('.btn-actualizar');
let contadorAlert = 0;

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
    let typeAlert = success ? 'alert-success' : 'alert-danger';
    $('.alertaGlobal').append(`<div class="alert ${typeAlert} my-3 alertDangerItems" id="alert${contadorAlert++}">${mensaje}</div>`).css("font-weight", "bold");
    const alert = $('.alertaGlobal');
    alert.stop(true, true).fadeIn(400);
    setTimeout(() => {
        $('.alertaGlobal').fadeOut(400, function () {
            $(this).empty();
        });
    }, 6000);
}

// function mostrarMensaje(success, mensaje) {
//     $('.alertaGlobal').fadeIn(400);
//     $('.alertaGlobal').append(`<div class="alert alert-danger my-3 alertDangerItems" id="alert${contadorAlert++}">${mensaje}</div>`).css("font-weight", "bold");
//     setTimeout(() => {
//         $('.alertaGlobal').fadeOut(400, function () {
//             $(this).empty();
//         });
//     }, 6000);
// }

/**  AGREGAR PERSONAS  **/

function obtenerDatosCrearPersona() {
    return {
        name: $('#nombres').val(),
        lastName: $('#apellidos').val(),
        phone: $('#telefono').val()
    }
}

function validarTextoVacio(input, divValidation, mensajeValido, mensajeInvalido) {
    if (input.val().length < 3) {
        input.removeClass('is-valid').addClass('is-invalid');
        divValidation.removeClass('valid-feedback').addClass('invalid-feedback').text(mensajeInvalido);
        return false;
    } else {
        input.removeClass('is-invalid').addClass('is-valid');
        divValidation.removeClass('invalid-feedback').addClass('valid-feedback').text(mensajeValido);
        return true;
    }
}

function validarNumeroTelefonico(input, divValidation, mensajeValido, mensajeInvalido) {
    const regex = /^3\d{9}$/;
    if (!regex.test(input.val())) {
        input.removeClass('is-valid').addClass('is-invalid');
        divValidation.removeClass('valid-feedback').addClass('invalid-feedback').text(mensajeInvalido);
        return false;
    } else {
        input.removeClass('is-invalid').addClass('is-valid');
        divValidation.removeClass('invalid-feedback').addClass('valid-feedback').text(mensajeValido);
        return true;
    }
}

function vaciarInputCrearPersona() {
    $('#nombres').val('');
    $('#apellidos').val('');
    $('#telefono').val('');
}

function resetearCrearPersona() {
    $('#nombres').removeClass('is-valid is-invalid');
    $('#apellidos').removeClass('is-valid is-invalid');
    $('#telefono').removeClass('is-valid is-invalid');
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

function validarIngresoDatos() {
    let nombreIsValid = validarTextoVacio($('#nombres'), $('#validation-name'), 'Estructura Válida', 'El nombre debe tener 3 letras o más');
    let apellidoIsValid = validarTextoVacio($('#apellidos'), $('#validation-lastname'), 'Estructura Válida', 'El apellido debe tener 3 letras o más');
    let telefonoIsValid = validarNumeroTelefonico($('#telefono'), $('#validation-phone'), 'Estructura Válida', 'El teléfono debe iniciar con el dígito tres y nueve digitos más');
    if (nombreIsValid && apellidoIsValid && telefonoIsValid) $('#btn-crear-persona').removeClass('disabled');
    if (!(nombreIsValid && apellidoIsValid && telefonoIsValid)) $('#btn-crear-persona').addClass('disabled');
}

$('#btn-crear-persona').on('click', function () {
    postHTTP();
    getHTTP();
    $('.create-person').fadeOut(500);
    vaciarInputCrearPersona();
    resetearCrearPersona();
    $('#btn-crear-persona').addClass('disabled');
    mostrarMensaje(true, "Persona Creada.");
});

$('#nombres').on('input', function () {
    validarIngresoDatos();
});

$('#apellidos').on('input', function () {
    validarIngresoDatos();
});

$('#telefono').on('input', function () {
    validarIngresoDatos();
});


/**  EVENTO PARA ACTIVAR LA VENTANA DE CREAR PERSONAS  **/

$('.btn-crear').on('click', function () {
    $('.create-person').fadeIn(500);
});

$('#btn-cancelar-crear-persona').on('click', function () {
    $('.create-person').fadeOut(500);
    vaciarInputCrearPersona();
    resetearCrearPersona();
    mostrarMensaje(false, 'Ha cancelado la creación de Persona.');
});

