
// PRODUCTOS
let productos = []

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data
        cargarProductos(productos)
    })


//INFO QUE ME TRAIGO DEL HTML PARA CARGAR CON JS
//================================================================================================================================================================================================
/* 
<div class="producto">
    <img class="producto-imagen" src="./img/abrigos/01.jpg" alt="Abrigo 01">
    <div class="producto-detalles">
        <h3 class="producto-titulo">Abrigo 01</h3>
        <p class="producto-precio">$1000</p>
        <button class="producto-agregar">Agregar</button>
    </div>
</div>
    */



//==============================================================================Elementos que voy llamando del DOM================================================================================

const contenedorProductos = document.querySelector("#contenedor-productos")
const botonesCategorias = document.querySelectorAll(".boton-categoria")//id que me sirve para traer todos los productos y separar por las categorias(evento)
const tituloPrincipal = document.querySelector("#titulo-principal") //para que me traiga el titulo de cada uno
let botonesAgregar = document.querySelectorAll(".producto-agregar") //solo para usarlo dentro de la fx. Da cero por ahora
const numerito = document.querySelector("#numerito")

//================================================================================================================================================================================================

//funcion que recorre el array y permite agregar los productos


function cargarProductos(productosElegidos) {

    //necestamos vaciar todo el contenedor productos para que no se repitan por debajo al filtrar
    contenedorProductos.innerHTML = ""

    productosElegidos.forEach(producto => {

        const box = document.createElement("box")
        box.classList.add("producto")
        box.innerHTML = `
                        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                        <div class="producto-detalles">
                            <h3 class="producto-titulo">${producto.titulo}</h3>
                            <p class="producto-precio">$${producto.precio}</p>
                            <button class="producto-agregar" id="${producto.id}">Agregar</button>
                        </div>
                        `
    contenedorProductos.append(box);
    })

    actualizarBotonesAgregar();
}

cargarProductos(productos)//llamo a la fx para que me cargue todos los productos


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        
        botonesCategorias.forEach(boton => boton.classList.remove("active"))
        e.currentTarget.classList.add("active")

        if (e.currentTarget.id != "todos") {
            const textoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id)
            tituloPrincipal.innerText = textoCategoria.categoria.nombre
            const productosPorCategoria = productos.filter(producto => producto.categoria.id === e.currentTarget.id)//para que solo me muestre por categorias
            cargarProductos(productosPorCategoria)
        }else{
            tituloPrincipal.innerText =  "Todos los productos"
            cargarProductos(productos)//que me muestre los productos de nuevo
        }     
    })
})



//agregar productos al carrito boton

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar")

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}

let productosEnCarrito 



let productosEnCarritoLS = localStorage.getItem("productos-en-carrito")

//si hay en mi carrito, va a ser igual a lo que traiga del localStore, si no, me devuelve un array con cero productos. Lo aplico despues si no me da error
if(productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS)
    actualizarNumerito()
}else{
    productosEnCarrito =[]
}



function agregarAlCarrito(e){

    Toastify({
        text: "Producto agregado 😊",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #bf4646, #e76363)",
            borderRadius:'1.3rem',
            textTransform:'uppercase',
            fontFamily:"'Rubik', sans-serif",
            color:'white',
            fontSize: '.75rem'
        },
        offset: {
          x: '1rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id
    // console.log(id) para ver si funciona el id de los productos.
    const productoAgregado = productos.find(producto => producto.id === idBoton)

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++
    } else {
        productoAgregado.cantidad = 1
        productosEnCarrito.push(productoAgregado)
    }

    actualizarNumerito()

    localStorage.setItem("productos-en-carrito",JSON.stringify(productosEnCarrito))
}


//fx que actualiza la cantidad de productos en el carrito(numerito)
function actualizarNumerito() {
    nuevoNumerito = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}