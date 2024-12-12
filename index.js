var categorias;
var productos;
var containerInicio;
var containerProductos;
var tiempCarga;

var limite;
var offset;
var enCurso;

var categoriaActual;
var porCategorias = false;

var formCategorias;

var carrito = [];

window.onload = function () {
    containerInicio = document.getElementsByClassName("containerInicio")[0];
    containerProductos = document.getElementsByClassName("containerProductos")[0];
    const hamburguer = document.getElementById("hamburguesa");
    const cerrar = document.getElementById("x");
    const nav = document.getElementsByClassName("navbar")[0];
    categorias = document.getElementById("categorias");
    const navProductos = document.getElementById("NavProductos");
    const navInicio = document.getElementById("inicio");
    tiempCarga = document.getElementById("tiempoCarga");
    const cargarMasbtn = document.getElementById("cargarMas");
    const logo = document.getElementById("logo");

    const btnBuscar = document.getElementById("btnBuscar");
    formCategorias = document.getElementById("formCategorias");

    const carrito = document.getElementById("carrito");

    productos = document.getElementById("productoCategoria");

    navProductos.addEventListener("click", () =>{
        containerInicio.style.display = "none";
        containerProductos.style.display = "grid";
        document.documentElement.scrollTop = 0;
    })

    navInicio.addEventListener("click", () =>{
        containerInicio.style.display = "grid";
        containerProductos.style.display = "none";
        document.documentElement.scrollTop = 0;
    })

    logo.addEventListener("click", () =>{
        containerInicio.style.display = "grid";
        containerProductos.style.display = "none";
        document.documentElement.scrollTop = 0;
    })

    carrito.addEventListener("click", (e) =>{
        mostrarCarrito();
    });
    
    hamburguer.addEventListener("click", () => {
        nav.style.right = "0";
        hamburguer.style.right = "-1000%";
    });

    cerrar.addEventListener("click", () => {
        nav.style.right = "-100%"; 
        hamburguer.style.right = "0";
    });

    btnBuscar.addEventListener("click", (e) => {
        categoriaActual = formCategorias.value;
        porCategorias = true;
        offset = 0;
        limite = 10;
        mostrarProductosPorCategorias();
    });

    mostrarCategorias();
    mostrarProductos();
    listarCategorias();

    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + document.documentElement.scrollTop >= (document.body.offsetHeight * 0.7)

        if(endOfPage){
            if(!enCurso){
                if(porCategorias == true){
                    cargarMasProductosPorCategorias();
                }
                else{
                    cargarMasProductos();
                }
            }
        }
    });

    cargarMasbtn.addEventListener("click", () =>{
        if(!enCurso){
            if(porCategorias == true){
                cargarMasProductosPorCategorias();
            }
            else{
                cargarMasProductos();
            }
        }
    })
}

function listarCategorias(){
    fetch("https://api.escuelajs.co/api/v1/categories?limit=5", { method: "GET" })
    .then((res) => res.json())
    .then((categoria) => {
        categoria.forEach(element => {
            let option = document.createElement("option");
            option.value = element.id;
            option.textContent = element.name;
            formCategorias.appendChild(option);

        });
    })
    .catch((err) => {
        console.log("error:", err);
    });
}

function mostrarCategorias() {
    fetch("https://api.escuelajs.co/api/v1/categories?limit=5", { method: "GET" })
    .then((res) => res.json())
    .then((categoria) => {
        categoria.forEach(element => {
            let div = document.createElement("div");
            let nombre = document.createElement("h3");
            let img = document.createElement("img");
            nombre.textContent = element.name;
            img.src = element.image;
            img.addEventListener("error", (e) =>{
                img.src = "./Imagenes/error.jpg";
            })

            div.idCategoria = element.id;
            nombre.idCategoria = element.id;
            img.idCategoria = element.id;
            
            div.addEventListener("click", (e) => {
                categoriaActual = e.target.idCategoria;
                porCategorias = true;
                offset = 0;
                limite = 10;
                mostrarProductosPorCategorias();
            });
            div.addEventListener("click", () =>{
                containerInicio.style.display = "none";
                containerProductos.style.display = "grid";
                document.documentElement.scrollTop = 0;
            })

            div.appendChild(nombre);
            div.appendChild(img);

            categorias.appendChild(div);
            
        });
    })
    .catch((err) => {
        console.log("error:", err);
    });
}

function mostrarProductosPorCategorias() {
    tiempCarga.style.display = "block";
    productos.innerHTML = "";
    offset = 0;
    limite = 10;
    
    fetch("https://api.escuelajs.co/api/v1/categories/" + categoriaActual + "/products?offset=" + offset + "&limit=" + limite, { method: "GET" })
    .then((res) => res.json())
    .then((producto) => {
            tiempCarga.style.display = "none";
            forEachProductos(producto);
        
    })
    .catch((err) => {
        tiempCarga.style.display = "none";
        console.log("error:", err);
    });
}

function cargarMasProductosPorCategorias() {
    porCategorias = true;
    tiempCarga.style.display = "block";
    offset++;
    limite += 10;
    enCurso = true;
    
    fetch("https://api.escuelajs.co/api/v1/categories/" + categoriaActual + "/products?offset=" + offset + "&limit=" + limite + "", { method: "GET" })
    .then((res) => res.json())
    .then((producto) => {
        tiempCarga.style.display = "none";
        forEachProductos(producto)
        enCurso = false;

        if (producto.length === 0) {
            if (!document.querySelector('.numProductos')) {
                let numProductos = document.createElement("h2");
                numProductos.textContent = "No hay más productos";
                numProductos.classList.add("numProductos");
                containerProductos.appendChild(numProductos);
            }
            return;
        }
        
    })
    .catch((err) => {
        tiempCarga.style.display = "none";
        console.log("error:", err);
    });
}

function mostrarProductos() {
    tiempCarga.style.display = "block";
    productos.innerHTML = "";
    offset = 0;
    limite = 10;
    porCategorias = false;
    
    fetch("https://api.escuelajs.co/api/v1/products?offset=" + offset + "&limit=" + limite, { method: "GET" })
    .then((res) => res.json())
    .then((producto) => {
            tiempCarga.style.display = "none";
            forEachProductos(producto);
    })
    .catch((err) => {
        tiempCarga.style.display = "none";
        console.log("error:", err);
    });
}

function cargarMasProductos() {
    offset++;
    limite += 10;
    enCurso = true;
    tiempCarga.style.display = "block";
    fetch("https://api.escuelajs.co/api/v1/products?offset=" + offset + "&limit=" + limite + "", { method: "GET" })
    .then((res) => res.json())
    .then((producto) => {
            tiempCarga.style.display = "none";
            forEachProductos(producto)
            enCurso = false;

            if (producto.length === 0) {
                if (!document.querySelector('.numProductos')) {
                    let numProductos = document.createElement("h2");
                    numProductos.textContent = "No hay más productos";
                    numProductos.classList.add("numProductos");
                    containerProductos.appendChild(numProductos);
                }
                return;
            }
        
    })
    .catch((err) => {
        tiempCarga.style.display = "none";
        console.log("error:", err);
    });
}

function forEachProductos(producto) {
    producto.forEach(element => {
        let div1 = document.createElement("div");
        div1.classList.add("contenedorProducto");
        let div2 = document.createElement("div");
        div2.classList.add("contenedorIMGProducto");
        let div3 = document.createElement("div");
        div3.classList.add("contenedorTexto");
        let img = document.createElement("img");
        let titulo = document.createElement("h3");
        let descripcion = document.createElement("p")
        let precio = document.createElement("h4");

        img.src = element.images[0];
        img.addEventListener("error", (e) =>{
            img.src = "./Imagenes/error.jpg";
        })
        titulo.textContent = element.title;
        descripcion.textContent = element.category.name;
        precio.textContent = element.price;

        div2.appendChild(img);
        div3.appendChild(titulo);
        div3.appendChild(descripcion);
        div3.appendChild(precio);

        div1.idElemento = element.id;
        div1.addEventListener("click", detalleProducto);


        div1.appendChild(div2);
        div1.appendChild(div3);

        
        productos.appendChild(div1);
    });
}

function detalleProducto(e){
    tiempCarga.style.display = "block";
    fetch("https://api.escuelajs.co/api/v1/products/" + e.currentTarget.idElemento + "", { method: "GET" })
    .then((res) => res.json())
    .then((producto) => {

        tiempCarga.style.display = "none";

        let divDetalle = document.createElement("div");
        divDetalle.classList.add("divDetalle");

        let btnCerrar = document.createElement("button");
        btnCerrar.textContent = "X";
        btnCerrar.classList.add("botonCerrar");
        btnCerrar.addEventListener("click", ()=>{
            divDetalle.remove();
        })

        let contenidoDetalle = document.createElement("div");
        contenidoDetalle.classList.add("contenidoDetalle");

        let imgProducto = document.createElement("img");
        imgProducto.classList.add("imagenDetalle");

        let textoDetalle = document.createElement("div");
        textoDetalle.classList.add("textoDetalle");

        let tituloProducto = document.createElement("h2");
        let precioProducto = document.createElement("li");
        let descripcionProducto = document.createElement("li");
        let nombreCategoriaProducto = document.createElement("li");

        let btnCesta = document.createElement("button");
        btnCesta.classList.add("btnCesta");
        btnCesta.id = producto.id;
        btnCesta.textContent = "🛒 Añadir producto al carrito";
        btnCesta.addEventListener("click", añadirCarrito);
        
        setInterval(()=>{
             imgProducto.src = cambiarFoto(producto.images);
            
        },5000)

        imgProducto.src = producto.images;
        imgProducto.addEventListener("error", (e) =>{
            imgProducto.src = "./Imagenes/error.jpg";
        })
        

        tituloProducto.textContent = producto.title;
        precioProducto.textContent = "Precio: " + producto.price + "€";
        descripcionProducto.textContent = "Descripción: " + producto.description;
        nombreCategoriaProducto.textContent = "Categoría: " + producto.category.name;
        
        textoDetalle.appendChild(tituloProducto);
        textoDetalle.appendChild(precioProducto);
        textoDetalle.appendChild(descripcionProducto);
        textoDetalle.appendChild(nombreCategoriaProducto);
        textoDetalle.appendChild(btnCesta);

        contenidoDetalle.appendChild(imgProducto);
        contenidoDetalle.appendChild(textoDetalle);
        
        divDetalle.appendChild(btnCerrar);
        divDetalle.appendChild(contenidoDetalle);
    
        document.body.appendChild(divDetalle);
        
    })
    .catch((err) => {
        tiempCarga.style.display = "none";
        console.log("error:", err);
    });
}

function cambiarFoto(array){
    let indiceActual = 0;
    indiceActual = Math.floor(Math.random() * (array.length + 0) + 0)
 
    return array[indiceActual];
}

function añadirCarrito(e){
    
    let idProducto = e.target.id;

    let itemCarrito = carrito.find(item => item.id === idProducto);

    if (itemCarrito) {
        itemCarrito.cantidad += 1;
    } 
    else {
        carrito.push({
            id: idProducto,
            cantidad: 1,
        });
    }

}

function mostrarCarrito(){
    tiempCarga.style.display = "block";

    let existeCarrito = document.querySelector('.divCarrito');
    if (existeCarrito) {
        existeCarrito.remove(); 
    }

    let divCarrito = document.createElement("div");
    divCarrito.classList.add("divCarrito");

    let tituloCarrito = document.createElement("h2");
    tituloCarrito.classList.add("tituloCarrito");
    tituloCarrito.textContent = "Carrito de la Compra";
    
    let cerrarCarrito = document.createElement("button");
    cerrarCarrito.textContent = "X";
    cerrarCarrito.classList.add("botonCerrarCarrito");
    cerrarCarrito.addEventListener("click", ()=>{
        divCarrito.remove();
    })

    divCarrito.appendChild(cerrarCarrito);
    divCarrito.appendChild(tituloCarrito);

    if(carrito.length == 0){
        let vacio = document.createElement("h2");
        vacio.classList.add("vacio");
        vacio.textContent = "El carrito esta vacio";
        divCarrito.appendChild(vacio)
    }

    let divElementosCarrito = document.createElement("div");
    divElementosCarrito.classList.add("divElementosCarrito");

    carrito.forEach(productoCarrito => {

        let elemento = productoCarrito;

        fetch("https://api.escuelajs.co/api/v1/products/" + elemento.id + "", { method: "GET" })
        .then((res) => res.json())
        .then((producto) => {
    
            tiempCarga.style.display = "none";

            
            let elementoCarrito = document.createElement("div");
            elementoCarrito.classList.add("elementoCarrito");

            let imgCarrito = document.createElement("img");
            imgCarrito.classList.add("imgCarrito");
            imgCarrito.src = producto.images[0];
            imgCarrito.addEventListener("error", (e) =>{
                imgCarrito.src = "./Imagenes/error.jpg";
            })

            let divTextoCarrito = document.createElement("div");
            divTextoCarrito.classList.add("divTextoCarrito");

            let nombreProductoCarrito = document.createElement("h4");
            let precioProductoCarrito = document.createElement("span");

            let divControlarArticulo = document.createElement("div");
            divControlarArticulo.classList.add("divControlarArticulo");

            let botonMenos = document.createElement("button");
            botonMenos.classList.add("botonesArticulos");
            botonMenos.textContent = "-";

            let cantidadProducto = document.createElement("span");

            let botonMas = document.createElement("button");
            botonMas.classList.add("botonesArticulos");
            botonMas.textContent = "+";

            let btnBorrarArticulo = document.createElement("button");
            btnBorrarArticulo.classList.add("btnBorrarArticulo");
            btnBorrarArticulo.textContent = "🗑️";

            nombreProductoCarrito.textContent = producto.title;
            precioProductoCarrito.textContent = producto.price;

            cantidadProducto.textContent = productoCarrito.cantidad;

            botonMenos.addEventListener("click", () =>{
                elemento.cantidad--;
                cantidadProducto.textContent = elemento.cantidad;
                if(elemento.cantidad == 0){
                    carrito = carrito.filter(productoBorrar => productoBorrar.id !== elemento.id);
                    mostrarCarrito();
                }
            })

            botonMas.addEventListener("click", () =>{
                elemento.cantidad++;
                cantidadProducto.textContent = elemento.cantidad;
            })

            btnBorrarArticulo.addEventListener("click", () =>{
                carrito = carrito.filter(productoBorrar => productoBorrar.id !== elemento.id);
                mostrarCarrito();
            })

            

            divControlarArticulo.appendChild(botonMenos);
            divControlarArticulo.appendChild(cantidadProducto);
            divControlarArticulo.appendChild(botonMas);
            divControlarArticulo.appendChild(btnBorrarArticulo);
            
            divTextoCarrito.appendChild(nombreProductoCarrito);
            divTextoCarrito.appendChild(precioProductoCarrito);
            divTextoCarrito.appendChild(divControlarArticulo);

            elementoCarrito.appendChild(imgCarrito);
            elementoCarrito.appendChild(divTextoCarrito);

            divElementosCarrito.appendChild(elementoCarrito);

            divCarrito.appendChild(divElementosCarrito);
            
            
        })
        .catch((err) => {
            tiempCarga.style.display = "none";
            console.log("error:", err);
        });
    });

    document.body.appendChild(divCarrito);
    
}