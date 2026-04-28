//HACER PRIMERO EL METODO PARA ARMAR EL COMBO DESPLEGABLE DE CATEGORIAS
async function ObtenerAsignaturas() {

  const respuesta = await fetch(`${linkApi}/Asignaturas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const asignaturas = await respuesta.json();

  const comboSelect = document.querySelector("#selectAsignaturas");
  comboSelect.innerHTML = "";


  let opciones = `<option value="0">[TODAS LAS ASIGNATURAS]</option>`;
  asignaturas.forEach((asignatura) => {
    opciones += `<option value="${asignatura.asignaturaID}">${asignatura.descripcion}</option>`;
  });
  comboSelect.innerHTML = opciones;
  
  getPromedioAlumnos();
}

const inputCategoria = document.getElementById("selectAsignaturas");
inputCategoria.onchange = function () {
    getPromedioAlumnos();
};

const inputFechaDesde = document.getElementById("FechaDesdeBuscar");
inputFechaDesde.onchange = function () {
    getPromedioAlumnos();
};

const inputFechaHasta = document.getElementById("FechaHastaBuscar");
inputFechaHasta.onchange = function () {
    getPromedioAlumnos();
};

async function getPromedioAlumnos() {
    let fechaDesde = document.getElementById("FechaDesdeBuscar").value;
    let fechaHasta = document.getElementById("FechaHastaBuscar").value;

    const fecha1 = new Date(fechaDesde);
    const fecha2 = new Date(fechaHasta);

    if (fecha1 > fecha2) {
        fechaHasta = fechaDesde;
        document.getElementById("FechaHastaBuscar").value = fechaDesde;
    }

    const filtros = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        asignaturaID: document.getElementById("selectAsignaturas").value
    };
    const res = await fetch(`${linkApi}/informes/promedioalumnos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
    });

    const alumnos = await res.json();
    const tbody = document.querySelector("#tablaAlumnos tbody");
    tbody.innerHTML = "";
 
    alumnos.forEach(alumno => {

        const rowInsertar = document.createElement("tr");
        rowInsertar.innerHTML = `          
            <td>${alumno.nombreCompleto}</td>   
            <td class="text-center">${alumno.dni}</td>
            <td class="text-center text-bold">${alumno.promedio.toFixed(2)}</td>       
        `;
        tbody.appendChild(rowInsertar);     

    });
}

ObtenerAsignaturas();