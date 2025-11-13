import * as login from './login.js';
const formulario = document.getElementById("contactForm");
const apiUrl = "https://pru.clarisacloud.com:8443/seguridad/rest/api/v1/login/";

$("#btn-form").on("click", function (event) {
    /* Convierto las entradas del Formulario en JSON */
    const formData = new FormData(formulario);
    const jsonData = Object.fromEntries(formData.entries());
    let alertTime;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    }

    fetch(apiUrl, requestOptions)
        .then(response => {
            return response.json();
        })
        .then((data) => {
            if (!data.success) {
                mostrarMensaje();
                let titulo = $(".alert div strong");
                let mensaje = $(".alert div p");
                titulo.text(data.textResponse);
                mensaje.text(data.errores.errores[0].errorMessage);

                login.validarInput("#usuario", event);
                login.validarInput("#contrasenia", event);
                login.editarInput($("#usuario"), "#div-usuario");
                login.editarInput($("#contrasenia"), "#div-contrasenia");
                login.validarUsuario();
                login.validarContrasenia();
            }

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('response', JSON.stringify(data));
                window.location.href = "../inicio.html";
            }
        })
        .catch(error => console.error("Error", error));
});

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
