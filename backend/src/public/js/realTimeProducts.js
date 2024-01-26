const socket = io.connect('http://localhost:4000')
const form = document.getElementById('addForm')
const botonProds = document.getElementById('botonProductos')
const removeform = document.getElementById('removeForm')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //Me genera un objeto iterador
    const prod = Object.fromEntries(datForm) //De un objeto iterable genero un objeto simple
    await socket.emit('add-product', prod)
    await socket.emit('update-products');
    e.target.reset()
})

removeform.addEventListener('submit', async (e) => {
    e.preventDefault()
    const code = removeform.elements["code"].value;
    await socket.emit('remove-product', { code: code })
    await socket.emit('update-products');
    e.target.reset()
})


    socket.on('show-products', (products) => {
        const tableBody = document.querySelector("#productsTable tbody");
        let tableContent = '';
        if (products && Array.isArray(products)) {
        products.forEach(product => {
            tableContent += `
                <tr>
                    <td>${product._id}</td>
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