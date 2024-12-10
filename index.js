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
    
    formCategorias = document.getElementById("formCategorias");

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
    
    hamburguer.addEventListener("click", () => {
        nav.style.right = "0";
        hamburguer.style.right = "-1000%";
    });

    cerrar.addEventListener("click", () => {
        nav.style.right = "-100%"; 
        hamburguer.style.right = "0";
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

        div1.appendChild(div2);
        div1.appendChild(div3);

        div1.addEventListener("click", () =>{
            detalleProducto();
        })

        productos.appendChild(div1);
    });
}

function detalleProducto(){

}