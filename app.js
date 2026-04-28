// CONFIGURA ESTO CON TU FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDNeN0AIcXw0aAiwc6S7472y7YMjHzbV94",
    authDomain: "tienda-virtual-883ef.firebaseapp.com",
    databaseURL: "https://tienda-virtual-883ef-default-rtdb.firebaseio.com",
    projectId: "tienda-virtual-883ef",
    storageBucket: "tienda-virtual-883ef.firebasestorage.app",
    messagingSenderId: "871120614985",
    appId: "1:871120614985:web:0274d91497b7f1e3d33198"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// LOGIN
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => alert("Bienvenido"))
        .catch(err => alert(err.message));
}

// GUARDAR PRODUCTO
function guardarProducto() {
    let nombre = document.getElementById("nombre").value;
    let precio = document.getElementById("precio").value;
    let stock = document.getElementById("stock").value;
    let tipo = document.getElementById("tipoNegocio").value;

    let id = Date.now();

    db.ref("productos/" + id).set({
        nombre,
        precio,
        stock,
        tipo
    });

    alert("Producto guardado");
}

// MOSTRAR PRODUCTOS
db.ref("productos").on("value", snapshot => {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    snapshot.forEach(item => {
        let data = item.val();
        lista.innerHTML += `<li>${data.nombre} - S/ ${data.precio} - Stock: ${data.stock}</li>`;
    });
});


//función vender()
function vender() {
    let nombre = document.getElementById("productoVenta").value;
    let cantidad = parseInt(document.getElementById("cantidadVenta").value);

    db.ref("productos").once("value", snapshot => {
        snapshot.forEach(item => {
            let data = item.val();
            let key = item.key;
            let ventaId = Date.now();

            db.ref("ventas/" + ventaId).set({
                producto: data.nombre,
                cantidad: cantidad,
                total: cantidad * data.precio,
                fecha: new Date().toLocaleString()
            });

            if (data.nombre === nombre) {

                if (data.stock >= cantidad) {
                    let nuevoStock = data.stock - cantidad;

                    db.ref("productos/" + key).update({
                        stock: nuevoStock
                    });

                    alert("Venta realizada");
                } else {
                    alert("Stock insuficiente");
                }
            }
        });
    });
}

db.ref("ventas").on("value", snapshot => {
    let lista = document.getElementById("historial");
    lista.innerHTML = "";

    snapshot.forEach(item => {
        let v = item.val();
        lista.innerHTML += `<li>${v.producto} - ${v.cantidad} unidades - S/ ${v.total} - ${v.fecha}</li>`;
    });
});


//TOTAL DE GANANCIAS

db.ref("ventas").on("value", snapshot => {
    let total = 0;

    snapshot.forEach(item => {
        total += item.val().total;
    });

    document.getElementById("totalGanado").innerText = "S/ " + total;
});


//Código del gráfico

let chart;

db.ref("ventas").on("value", snapshot => {

    let productos = {};

    snapshot.forEach(item => {
        let v = item.val();

        if (!productos[v.producto]) {
            productos[v.producto] = 0;
        }

        productos[v.producto] += v.total;
    });

    let labels = Object.keys(productos);
    let datos = Object.values(productos);

    let ctx = document.getElementById("graficoVentas").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Ventas (S/)",
                data: datos
            }]
        }
    });

});


import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore();

async function eliminarProducto(id) {
    try {
        await deleteDoc(doc(db, "productos", id));
        alert("Producto eliminado correctamente");
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar producto");
    }
}


async function eliminarProducto(id) {
    const confirmacion = confirm("¿Seguro que deseas eliminar este producto?");
    
    if (!confirmacion) return;

    try {
        await deleteDoc(doc(db, "productos", id));
        alert("Producto eliminado correctamente");
    } catch (error) {
        console.error(error);
        alert("Error al eliminar");
    }
}

cargarProductos();
































