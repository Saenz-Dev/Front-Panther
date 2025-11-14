
export function validarInput(input, event) {
    event.preventDefault();
    if ($(input).val().length < 5) {
        $(input).css("border", "red solid 2px");
        return false;
    } else {
        $(input).css("border", "#52f052 solid 2px");
        return true;
    }
}

export function editarInput(input, selector) {
    if (input.val().length == 0) {
        $(selector).css("display", "block");
    }
    // if ($(input).val().length > 5) {
    //     $(selector).css("display", "none");
    // }
}

export function validarUsuario() {
    $("#div-usuario").css("color", "red").css("font-weight", "400");
    if ($("#usuario").val().length == 0) $("#div-usuario").text("Usuario es obligatorio.");
    if ($("#usuario").val().length > 0 && $("#usuario").val().length < 5) $("#div-usuario").text("Usuario debe tener al menos 5 caracteres o más.");
    if ($("#usuario").val().length >= 5) {
        $("#div-usuario").css("color", "#23ca23ff").css("font-weight", "bolder");
        $("#div-usuario").removeClass("text-danger");
        $("#div-usuario").text("Correcto");
    }
}

export function validarContrasenia() {
    $("#div-contrasenia").css("color", "red").css("font-weight", "400");
    if ($("#contrasenia").val().length == 0) $("#div-contrasenia").text("Contraseña es requerida.");
    if ($("#contrasenia").val().length > 0 && $("#div-contrasenia").val().length < 5) $("#div-contrasenia").text("Contraseña debe tener al menos 5 caracteres o más.");
    if ($("#contrasenia").val().length >= 5) {
        $("#div-contrasenia").css("color", "#23ca23ff").css("font-weight", "bolder");
        $("#div-contrasenia").removeClass("text-danger");
        $("#div-contrasenia").text("Correcto");
    }
}

