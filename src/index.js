const [,, method, resource, ...parametros] = process.argv;
const API_BASE_URL = 'https://fakestoreapi.com';

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if(!response.ok){
            throw new Error(`error fetch: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json;
        return data;

    } catch (error) {
        console.error('Ocurrió un error en el fetch', error.message)
    }
}

async function tomarProductosTodos() {
    const productos = await fetchAPI('/products');
    console.log(JSON.stringify(productos, null, 2));//trae todos los atributos
}

async function tomarProductoPorID(id) {
    if(isNaN(id)) {
        console.log('El ID del producto debe ser numérico.');
        process.exit(1);
    }

    console.log('Datos del producto:\n');
    const producto = await fetchAPI(`/products/${id}`);
    console.log(JSON.stringify(producto, null, 2));
}
async function crearProducto(nombre, precio, descripcion, categoria) {
    console.log("Creando un nuevo producto...\n");
    const nuevoProducto = {
        "id": 0,
        "title": nombre,
        "price": precio,
        "description": descripcion,
        "category": categoria,
        "image": "http://example.com"
    }

    const options ={
        method: 'POST',
        Headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
    }

    const resultado = await fetchAPI('/products', options)
    console.log('Producto creado con éxito:\n');
    console.log(JSON.stringify(resultado, null, 2));
}

async function eliminarProducto(id) {
    if(isNaN(id)) {
        console.error('El ID suministrado debe ser numérico.');
        process.exit(1);
    }
    
    console.log(`Elimiando producto: ${id}...\n`);

    const options = {
        method: 'DELETE'
    }

    const resultado = await fetchAPI(`/products/${id}`, options);
    console.log('Producto eliminado:\n');
    console.log(JSON.stringify(resultado,null, 2));

}

async function processarComando() {
    if(!method || !resource){
        console.error('Comando inválido');
        process.exit(1);
    }

    const httpMethod = method.toUpperCase();

    switch (httpMethod) {
        case 'GET':
            if(resource.includes('/')){
                const [, id] = resource.split('/');
                await tomarProductoPorID(id);
            } else if (resource === 'products'){
                await tomarProductosTodos();
            } else {
                console.error('Comando no válido, se requiere la forma: "npm run start GET products" o "npm run start GET products/<ID>".');
                process.exit(1);
            }

            break;
        case 'POST':
            if(resource === 'products'){
                const [nombre, precio, descripcion, categoria] = parametros;
                if(!nombre || !precio || !descripcion || ! categoria){
                    console.error('Falta uno o mas parámetros, los requeridos son en este orden: nombre, precio, descripcion, categoria.')
                    process.exit(1);
                }
                await crearProducto(nombre, precio, descripcion, categoria);
            } else {
                console.error('Comando no válido, se requiere "npm run start POST products <NOMBRE>, <PRECIO>, <DESCRIPCION>, <CATEGORIA>".')
                process.exit(1);
            }

            break;
        case 'DELETE':
            if(resource.includes('/')){
                const [, id] = resource.split('/');
                await eliminarProducto(id);
            } else {
                console.error('Comando no válido, se requiere: "npm run start DELETE products/<ID>".');
                process.exit(1);
            }

            break;
        default:
            console.Error(`Método ${httpMethod} no soportado por la app.\n`);
            console.log('Métodos soportados: \n GET \n POST \n DELETE');
            
            break;
    }
}

processarComando();