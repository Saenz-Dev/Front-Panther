/**  BOTON DE DIRECCIONAMIENTO A GESTION DE PERSONAS  **/
$('.btn-redirec').on('click', function () {
    window.location.href = '../persons.html';
});

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
    let requestOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
    }

    fetch(apiUrl, requestOptions)
        .then(response => { return response.json() })
        .then((data) => {
            console.log(data);
            llenarTabla(data.data);
            mostrarMensaje(true, "Tabla actualizada.");
            return data.data;
        })
}

function llenarTabla(persons) {
    let tbody = $('tbody');
    tbody.empty();
    let visibleCount = 0;
    if (Array.isArray(persons)) {
        for (const person of persons) {
            if (person.dateDelete == null) {
                tbody.append(row(person.id, person.name, person.lastName, person.phone));
                visibleCount++;
            }
        }
    }
    // Update person count badge (if present)
    if ($('#person-count').length) {
        $('#person-count').text(visibleCount);
    }
}

function row(id, name, lastName, phone) {
    return `
    <tr class="row-table">
        <th scope="row" class="id">${id}</th>
        <td class="name">${name}</td>
        <td class="lastname">${lastName}</td>
        <td class="phone">${phone}</td>
        <td class="buttons">
            <button class="btn btn-danger mx-2 btn-delete"><i class="bi bi-trash3-fill"></i></button>
            <button class="btn btn-warning mx-2 btn-modify"><i class="bi bi-pen-fill"></i></button>
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

/**  AGREGAR PERSONAS  **/

function obtenerDatosCrearPersona() {
    return {
        name: $('#nombres').val(),
        lastName: $('#apellidos').val(),
        phone: $('#telefono').val()
    }
}

// function validarTextoVacio(input, divValidation, mensajeValido, mensajeInvalido) {
//     if (input.val().length < 3) {
//         input.removeClass('is-valid').addClass('is-invalid');
//         divValidation.removeClass('valid-feedback').addClass('invalid-feedback').text(mensajeInvalido);
//         return false;
//     } else {
//         input.removeClass('is-invalid').addClass('is-valid');
//         divValidation.removeClass('invalid-feedback').addClass('valid-feedback').text(mensajeValido);
//         return true;
//     }
// }

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

function validarLongitudTexto(input, divValidation, mensajeValido, mensajeInvalido) {
    const regex = /^(?=.{3,30}$)[a-zA-ZÁÉÍÓÚáéíóú\sÑñ]+(?:\s[a-zA-ZÁÉÍÓÚáéíóú\sÑñ]+)*$/;
    if (!regex.text(input.val())) {
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
    let nombreIsValid = validarLongitudTexto($('#nombres'), $('#validation-name'), 'Estructura Válida', 'El nombre debe tener entre 3-30 caracteres.');
    let apellidoIsValid = validarLongitudTexto($('#apellidos'), $('#validation-lastname'), 'Estructura Válida', 'El apellido debe tener entre 3-30 caracteres.');
    let telefonoIsValid = validarNumeroTelefonico($('#telefono'), $('#validation-phone'), 'Estructura Válida', 'El teléfono debe iniciar con el dígito tres y nueve digitos más');
    if (nombreIsValid && apellidoIsValid && telefonoIsValid) {
        $('#btn-crear-persona').removeClass('disabled');
        $('#btn-modificar-persona').removeClass('disabled');
    }
    if (!(nombreIsValid && apellidoIsValid && telefonoIsValid)) {   
        $('#btn-crear-persona').addClass('disabled');
        $('#btn-modificar-persona').addClass('disabled');
    }
}

$('#btn-crear-persona').on('click', function () {
    postHTTP();
    getHTTP();
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
    $('.title-cm').text('Crear Persona');
    $('.div-id').css('display', 'none');
    $('#btn-crear-persona').css('display', 'block');
    $('#btn-modificar-persona').css('display', 'none');
    $('.create-person').fadeIn(500);
});

$('#btn-cancelar-crear-persona').on('click', function () {
    $('.create-person').fadeOut(500);
    vaciarInputCrearPersona();
    resetearCrearPersona();
    mostrarMensaje(false, 'Ha cancelado el proceso.');
});

/**  METODOS PARA MODIFICAR UNA PERSONA O UNA FILA DE LA TABLA  **/

$(document).on('click', '.btn-modify', function () {
    $('.title-cm').text('Modificar Persona');
    $('.div-id').css('display', 'block');
    $('#btn-crear-persona').css('display', 'none');
    $('#btn-modificar-persona').css('display', 'block');
    let trParent = $(this).closest('.row-table');
    $('#id').val(trParent.find('th.id').text());
    $('#nombres').val(trParent.find('td.name').text());
    $('#apellidos').val(trParent.find('td.lastname').text());
    $('#telefono').val(trParent.find('td.phone').text());
    $('.create-person').fadeIn(500);
});

function putHTTP() {
    let body = obtenerDatosCrearPersona();
    body.id = parseInt($('#id').val());
    console.log(body);
    $('.create-person').fadeOut(500);
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(body)
    }
    console.log(requestOptions);
    fetch(apiUrl, requestOptions)
        .then(response => { return response.json() })
        .then((data) => {
            if (data.code != 200) {
                console.log(data);
                mostrarMensaje(false, "Datos no modificados.");
                return;
            }
            $('.create-person').fadeOut(500);
            console.log(data);
            mostrarMensaje(true, "Datos modificados.");
        });
}

$('#btn-modificar-persona').on('click', function () {
    putHTTP();
    getHTTP();
    $('.create-person').fadeOut(500);
    vaciarInputCrearPersona();
    resetearCrearPersona();
    $('#btn-modificar-persona').addClass('disabled');
});

/**  EVENTO PARA ELIMINAR PERSONA  **/
$(document).on('click', '.btn-delete', function () {
    deleteHTTP($(this));
    getHTTP();
    getHTTP();
});

function deleteHTTP(elemento) {
    let trParent = elemento.closest('.row-table');
    let body = {
        id: trParent.find('th.id').text()
    }
    let requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(body)
    }
    fetch(apiUrl, requestOptions)
        .then(response => { return response.json() })
        .then(data => {
            if (data.code != 200) {
                console.log(data);
                mostrarMensaje(false, "No fue posible eliminar la persona.");
                return;
            }
            mostrarMensaje(true, 'Persona Eliminada.');
        });
}