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
    IniciarFechas();
   
ObtenerAlumnos();
}

async function ObtenerAlumnos() {

  const respuesta = await fetch(`${linkApi}/Alumnos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const alumnos = await respuesta.json();

  const comboSelect = document.querySelector("#selectAlumnos");
  comboSelect.innerHTML = "";


  let opciones = `<option value="0">[TODOS LOS ALUMNOS]</option>`;
  alumnos.forEach((alumno) => {
    opciones += `<option value="${alumno.alumnoID}">${alumno.nombreCompleto}</option>`;
  });
  comboSelect.innerHTML = opciones;

   getPromedioAlumnos();
}

function IniciarFechas() {
    const hoy = new Date();
    
    const fechaDesde = hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-01';

    const fechaHasta = hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0');

    document.getElementById("FechaDesdeBuscar").value = fechaDesde;
    document.getElementById("FechaHastaBuscar").value = fechaHasta;
}

//DECLARAMOS LOS EVENTOS A ESOS INPUT
document
  .getElementById("selectAsignaturas")
  ?.addEventListener("change", getPromedioAlumnos);

  document
  .getElementById("selectAlumnos")
  ?.addEventListener("change", getPromedioAlumnos);

  document
  .getElementById("FechaDesdeBuscar")
  ?.addEventListener("change", getPromedioAlumnos);

  document
  .getElementById("FechaHastaBuscar")
  ?.addEventListener("change", getPromedioAlumnos);



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
        asignaturaID: document.getElementById("selectAsignaturas").value,
        alumnoID: document.getElementById("selectAlumnos").value
    };
    const res = await fetch(`${linkApi}/informes/promedioasignaturas`, {
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
            <td>${alumno.asignaturaNombre}</td>   
            <td class="text-center text-bold">${alumno.promedio.toFixed(2)}</td>       
        `;
        tbody.appendChild(rowInsertar);

    });
}

ObtenerAsignaturas();