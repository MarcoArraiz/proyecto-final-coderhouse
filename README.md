# **ENTREGA FINAL - CURSO DESARROLLO BACKEND**
## RESUMEN DE FEATURES
### Tecnologia del proyecto
- La estructura del  frontend está hecho con React y Vite y la UI con Bootstrap y los modulos de alerta con SweetAlert2
- La autentificacion en el backend está hecha con passport y el hasheo de datos sensibles esta hecho con bcrypt
- El sistema de permanencia de dsatos está hecho sobre MongoDB integrado con mongoose
- El sistema de permanencia de archivos esta hecho sobre multer
- Los endpoints del backend estan documentados en 'api/docs' a traves de swagger
- La gestion de errores en el backend cuenta con sistema de logs con permanencia local a traves de winston y son manejado a traves de una manejador de errores personalizados  
- El sistema de notificaciones de usuarios son hechas con nodemailer 
### Gestion de usuarios
- El proceso de signup se puede hacer a traves de estrategia local y estrategia github, incluye validación de email con código de verificacion
- Las rutas estan protegidas por niveles de autorización, para fines de la evaluación del proyecto estan todas las habilitadas a todos los roles
- La autentificación de usuario se realiza a traves de cookies jwt a nivel del cliente, el logout se maneja exclusivamente a traves de eliminación de cookie en el cliente
- El usuario puede hacer la carga de documentos a traves de multer, luego el upgrade a rpemium puede ser solicitado por el usuario siempre y cuando los documentos esten cargados y asociados a su perfil
- Desde el front en la seccion de admin/user se pueden visualizar los usuarios y eliminarlos
- Desde el backend se puede hacer una limpieza de los usuarios con dos dias o mas dias sin conexion, los usuarios eliminados son notitificados via mail

### Gestion de productos
- La gestion de productos se hace exclusivamente a traves del backend
- Los productos cuentan con sistema de elimincación lógica y con limite por stock 

### Gestion de carritos y órdenes
- El sistema de carritos es de permanencia en MongoDB
- El frontend cuenta con un sistema de limitación por stock
- Al momento de la preparación de la orden, los productos contenidos pasan por un sistemna de verficación de stocks y los productos sin stock suficientes son excluidos de la orden, los productos con stock suficientes son descontados del stock total y el contenido de la orden es confirmado via mail al usuario
- 

## PREMISAS DE LA ENTREGA

- [x]  GET / deberá obtener todos los usuarios, éste sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol)

```
LOCAL
GET http://localhost:4000/api/users

RENDER
GET https://curso-backend-proyecto-final.onrender.com/api/users
```

- [x]  DELETE / deberá limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días. (puedes hacer pruebas con los últimos 30 minutos, por ejemplo). Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad

```
LOCAL
DELETE http://localhost:4000/api/users

RENDER
DELETE https://curso-backend-proyecto-final.onrender.com/api/users
```

- [x]  Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce

```
LOCAL
DELETE http://localhost:5173/admin/users

RENDER
DELETE https://curso-backend-proyecto-final.onrender.com/api/users
```

- [x]  Despliegue del proyecto desde Render.com

```
BACKEND
https://curso-backend-proyecto-final.onrender.com/

RENDER
https://curso-backend-entrega-final-frontend.onrender.com
```

## POSTMAN COLLECTION

### SESSIONS

- [x]  REGISTER - POST http://localhost:4000/api/users/signup

```json
{
    "first_name": "Panchito",
    "last_name": "Perez",
    "age": 33,
    "email": "perez@perez.com",
    "password":"coderhouse"
}
```

- [x]  LOGIN - POST http://localhost:4000/api/sessions/login

```json
{
    "email": "perez@perez.com",
    "password":"coderhouse" 
}
```

- [x]  CURRENT - GET http://localhost:4000/api/sessions/current
- [x]  LOGOUT - GET http://localhost:4000/api/sessions/logout

### USERS

- [x]  GET USERS (modificado para que solo devuelva email, first_name y last_name) - GET http://localhost:4000/api/users

### PRODUCTS

- [x]  CREATE - http://localhost:4000/api/products
- [x]  GET - http://localhost:4000/api/products?limit=&page=&sort&category
- [x]  UPDATE - PUT http://localhost:4000/api/products/65a2dc26d5583fe054c91e74
- [x]  DELETE - http://localhost:4000/api/products/65a2dc26d5583fe054c91e74

### CARTS

- [x]  GET CARTS - GET http://localhost:4000/api/carts
- [x]  ADD PRODUCT - PUT http://localhost:4000/api/carts/:cid/products/:pid

```json
{
    "quantity": 3
}
```

- [x]  UPDATE PRODUCT CART - PUT http://localhost:3000/api/carts
- [x]  UPDATE QUANTITY - PUT http://localhost:4000/api/carts/:cid/products/:pid
- [x]  CLEAN CART - DELETE http://localhost:4000/api/carts/:pid
- [x]  DELETE PRODUCT - DELETE http://localhost:4000/api/carts/:cid/products/:pid
- [x]  CREATE TICKET - POST http://localhost:4000/api/orders/:cid
```json
{
    "address": "Av Cabildo 235"
}
```


# **Desafio carga de documentos, upgrade premium y last_connection**
### Premisas
- [x]Se implementó un nuevo atributo de ususario "last_connection" que se actualiza en cada inicio de sesion, no se actualiza en el logout porque en este caso se maneja solo logout del lado del cliente 
- [x]Se implementó un endpoint de caga de uno o varios documentos a traves de Multer, almacenados en la ruta /src/upload/documents
    1. Backend: método PUT en el endpoint '/api/users/:uid/documents', no requiere autentificacion
    2. Frontend: Desde la ruta '/profile' se muestran los datos del usuario y un campo de carga de documentacion
- [x]Se actualizó la función de Upgarde a PREMIUM 
    1. backend: en el endpoint 'api/users/premium/:uid' se puede solicitar el upgrade, que evalua la existencia de al menos un documento cargado en la propiedad 'documents' del usuario que posea en la referencia la regulaer expresion "/document-", en caso de que no exista se devuelve un error personalizado de falta de documentacion.
    2.frontend: del la ruta '/profile' al cargar al menos un document de forma exitosa, en el modal se ofrece la posibilidad de solicitar el upgrade a premium y si existe el documento en el perfil de usuario se muestra la confirmación exitosa del upgrade (Aun no actualiza del lado del cliente el nuevo rol en la cookie hasta el proximo login)


# **Módulos de testing para proyecto final**
### Premisas
- [x]Se implementó el script usersupertest que hace testing de las siguientes funciones:
    1. ruta api/users metodo post
    2. solicitar datos de usuarios mediante GET en /users/email/:email
    3. actualizar usuario mediante PUT en /users/:id
    4. iniciar sesion con post a traves de /sessions/login.
    5. consultar datos de usuario a traves de GET en sessions/current
    6. eliminar usuario mediante DELETE en /users/:id

- [x]Se implementó el script productssupertest que hace testing de las siguientes funciones:
    1. iniciar sesion con post a traves de /sessions/login
    2.crear un producto mediante post
    3. actualizar producto mediante PUT en /products/:id
    4. obtener un producto por id
    5.Eliminar el producto creado con DELETE en /products/:id

- [x]Se implementó el script cartssupertest que hace testing de las siguientes funciones:
    1. crear un cart mediante post
    2. agregar un producto a un cart mediante PUT en /carts/:cid/products/:pid
    3. eliminar cart mediante DELETE en /carts/:id

# **Documentar API**

✓ Se implementó Swagger para disonibilizar en el endpoint http://localhost:4000/apidocs/#/ la documentación de las rutas de API Carts, Users, Products y Sessions

# **Práctica de integración sobre tu ecommerce**

### Sistema de recuperación
✓ El usuario ahora cuenta en el login con un link para ir al recupero de contraseña, ingresando su mail
✓ El link de recuperacion llega via mail que incluye el token que dura 1 hora y funciona con jwt. tiene una codificacion y decodificacion de los puntos que separan los componentes para evitar que genere conflicto con la ruta URL
✓ Al clickear lleva al usuario a la pagina de recuperacion que toma la contraseña y la confirmacion, al hacer clic e enviar valida que sean iguales y envia al backend que en caso de token valido devuelve una notificacion que redirige al login pero si el token esta expirado muestra un modal indicativo y redirige a solicitar nuevamente el link

### Sistema de usuarios premium
✓ Ahora el rol de usuario contempla la opcion premium, que puede ser modificado entre user y premium con un PUT al endpoint http://localhost:4000/api/users/premium/:email
✓ El usuario premium al momento de crear la orden, se le aplica un 10% de descuento que se ve reflejado en el mail de confirmacion. Se conservan el monto original, descuento y montofinal para fines de poder dar visibilidad y trazabiliad



# **Entrega Mocking y manejo de errores**

### Mocking con faker para creacion de productos


✓ El endpoint POST 'api/products/mockingproducts' genera un producto nuevo con faker

✓El endpoint POST 'api/products/mockingproducts/:number' genera una cantidad n de productos segun number

✓Los endpoints de POST y PUT estan restringidos a perfiles con rol:admin por lo cual se debe acceder con email: beta.juanc@gmail.com y password: 123456 y la autenticacion es con jwtCookie


### CUSTOM ERRORS

✓Fueron añadidos custom errors para

- producto no encontrado
- Carrito no encontrado
- Campos faltante en la creacion de producto o de usuario
- Errores de conexion con mongodb
- Productos con stock insuficiente cuando se genera la orden (incluye un log con persistencia local)

✓Para testear los custom error de campo faltante en product o user creation se pueden usar POST en '/api/products/' o '/api/users/signup' excluyendo alguno de los campos obligatorios, dejo ejemplos:
User
{
    "first_name": "lalo",
    "last_name": "landa",
    "age": 35
    "email": "lalolanda20@noreply.con",
    "password": "123456"
}
Product
{
    "title": "Goose Island Lager",
    "description": "473ml",
    "code": "abc9",
    "price": 399,
    "stock": 10,
    "category": "Destilados"
}

✓Para testear Stock Faltante habilite desde el frontend añadir más productos al carrito de lo disponible en stock, el producto "Genérico Granito Guantes" o "Cereveza 27 easy" tiene un stock asignado de 2 unidades asi que si se arma una orden con mas cantidad, al momento de la generacion de la orden lo va a dejar en el cart y generasr en consola y en stockErrors.log  va a dejar detalle del faltante mientras avanza con la oden y envia confirmacion por mail.


### Uso de nodemailer
✓La ordenes cuando se confirman se genera un mail de confirmacion de la orden que incluye detalle de productos y monto
✓En el registro de usuarios, se incluyó una validación de mail, se debe ingresar el codigo enviado por mail al usuario para habilitar el proceso de compra
