const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let email = null
const userDataCookie = getCookie('userData');
// Si la cookie está presente, muestra el SwalFire
if (userDataCookie) {
    const decodedUserDataCookie = decodeURIComponent(userDataCookie);
    const userData = JSON.parse(decodedUserDataCookie);
    email = userData.email
}
socket.emit('display-inicial')


botonChat.addEventListener('click', () => {

    if (valInput.value.trim().length > 0) {
        socket.emit('add-message', {email: email, mensaje: valInput.value })
        valInput.value = ""
        socket.on()
    }
})

socket.on('show-messages', (arrayMensajes) => {
    parrafosMensajes.innerHTML = ""
    // Invertimos el orden del array
    const reversedMensajes = arrayMensajes.reverse();

    reversedMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `
        <div class="card mt-3">
            <div class="card-header">
                <span class="badge badge-primary text-dark">${mensaje.postTime}</span> <i class="fas fa-user-circle"></i> ${mensaje.email}
            </div>
            <div class="card-body">
                <p class="card-text">${mensaje.message}</p>
            </div>
        </div>`;
    });
})
