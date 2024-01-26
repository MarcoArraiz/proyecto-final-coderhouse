const socket = io.connect('http://localhost:4000')
const form = document.getElementById('idForm')
const botonProds = document.getElementById('botonProductos')
const firstVisit = true;

    socket.on('show-products', (products) => {
        const tableBody = document.querySelector("#productsTable tbody");
        let tableContent = '';
        if (products && Array.isArray(products)) {
        products.forEach(product => {
            tableContent += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>${product.thumbnail}</td>
                    <td>${product.code}</td>
                    <td>${product.stock}</td>
                    <td>${product.status}</td>
                </tr>
            `;
        });
    } else {
        console.error('Productos no definidos o no es un array:', products);
    }

        tableBody.innerHTML = tableContent;
        
    });

    
    socket.emit('update-products');


    
    document.addEventListener('DOMContentLoaded', () => { // Asegurarse de que el documento esté completamente cargado

        const userDataCookie = getCookie('userData');
        // Si la cookie está presente, muestra el SwalFire
        if (userDataCookie) {
            const decodedUserDataCookie = decodeURIComponent(userDataCookie);
            const userData = JSON.parse(decodedUserDataCookie);
            if(userData.welcome){
                Swal.fire({
                    icon: 'success',
                    title: '¡Conexión exitosa!',
                    text: `¡Bienvenido ${userData.first_name} (${userData.email}) tu rol es ${userData.rol}!`
                }).then( 
                    fetch('/api/sessions/update-welcome', { method: 'POST' })
                )
            }

        }

    });

    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    