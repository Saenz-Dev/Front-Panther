import * as login from './login.js';
const apiUrl = "http://localhost/panther/rest/login";

$("#btn-form").on("click", function (event) {
    /* Convierto las entradas del Formulario en JSON */
    let json = {};
    json.user = $("#usuario").val();
    json.password = $("#contrasenia").val();
    // console.log(json);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
    }

    fetch(apiUrl, requestOptions)
        .then(response => {
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            if (data.code != 200) {
                // console.log("Entra\n", data);
                mostrarMensaje();
                let titulo = $(".alert div strong");
                titulo.text(data.data);

                login.validarInput("#usuario", event);
                login.validarInput("#contrasenia", event);
                login.editarInput($("#usuario"), "#div-usuario");
                login.editarInput($("#contrasenia"), "#div-contrasenia");
                login.validarUsuario();
                login.validarContrasenia();
            }

            if (data.code == 200) {
                localStorage.setItem('token', data.data.keyAPI);
                window.location.href = "../persons.html";
            }
        })
        .catch(error => console.log("Error", error));
});

$('#usuario').on("input", function(event) {
    habilitarBoton(event);
    login.validarUsuario();
    login.validarContrasenia();
});

$('#contrasenia').on("input", function(event) {
    habilitarBoton(event);
    login.validarUsuario();
    login.validarContrasenia();
});

function habilitarBoton( event) {
    let usuarioVerificado = login.validarInput("#usuario", event);
    let contraseniaVerificada = login.validarInput("#contrasenia", event);
    if(usuarioVerificado != contraseniaVerificada || (usuarioVerificado == false && contraseniaVerificada == false)) {
        $('#btn-form').addClass('disabled');
        return;
    }
    $('#btn-form').removeClass('disabled');
}

function mostrarMensaje() {
    $(".alert").stop(true, true).fadeIn(400);
    $(".alert").css("display", "flex");
    setTimeout(() => {
        $(".alert").fadeOut(500);
    }, 5000);
}

$(".container div a").on('click', function (event) {
    event.preventDefault();
    $(".alert").slideDown(500).fadeOut(500);
})

$("#usuario").on("input", function (event) {
    login.validarInput(this, event);
    login.editarInput($(this), "#div-usuario");
    login.validarUsuario();

});

$("#contrasenia").on("input", function (event) {
    login.validarInput(this, event);
    login.editarInput($(this), "#div-contrasenia");
    login.validarContrasenia();
});
