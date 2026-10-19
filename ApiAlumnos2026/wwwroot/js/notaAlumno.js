async function ObtenerCarreras() {
  const respuesta = await authFetch("/Carreras");
  const carreras = await respuesta.json();
  return carreras;
}

async function ObtenerAsignaturasCarrera(carreraID) {
  const respuesta = await authFetch("/Asignaturas/AsignaturasCarrera/" + carreraID);
  const asignaturas = await respuesta.json();
  return asignaturas;
}

async function ArmarComboCarreras() {
  let carreras = await ObtenerCarreras();

  const comboSelect = document.querySelector("#selectCarreras");
  comboSelect.innerHTML = "";

  let opciones = '';
  carreras.forEach((carrera) => {
    opciones += `<option value="${carrera.carreraID}">${carrera.nombre}</option>`;
  });
  comboSelect.innerHTML = opciones;

  ArmarComboAsignaturas();
}


async function ArmarComboAsignaturas() {
  const carreraID = document.querySelector("#selectCarreras").value;
  let asignaturas = await ObtenerAsignaturasCarrera(carreraID);
  const comboSelect = document.querySelector("#selectAsignaturas");
  comboSelect.innerHTML = "";


  let opciones = '';
  asignaturas.forEach((asignatura) => {
    opciones += `<option value="${asignatura.asignaturaID}">${asignatura.descripcion}</option>`;
  });
  comboSelect.innerHTML = opciones;
}


async function ArmarComboCarrerasFiltrar() {
  let carreras = await ObtenerCarreras();

  const comboSelect = document.querySelector("#selectCarrerasFiltrar");
  comboSelect.innerHTML = "";

  let opciones = '';
  carreras.forEach((carrera) => {
    opciones += `<option value="${carrera.carreraID}">${carrera.nombre}</option>`;
  });
  comboSelect.innerHTML = opciones;

  ArmarComboAsignaturasFiltrar();
}

async function ArmarComboAsignaturasFiltrar() {
  const carreraID = document.querySelector("#selectCarrerasFiltrar").value;
  let asignaturas = await ObtenerAsignaturasCarrera(carreraID);
  const comboSelect = document.querySelector("#selectAsignaturasFiltrar");
  comboSelect.innerHTML = "";

  let opciones = '';
  asignaturas.forEach((asignatura) => {
    opciones += `<option value="${asignatura.asignaturaID}">${asignatura.descripcion}</option>`;
  });
  comboSelect.innerHTML = opciones;
  ArmarComboCarreras();
  ObtenerAlumnos();
}



async function ObtenerAlumnos() {

  //PRIMERO SE HACE EL FETCH A LA API PARA BUSCAR LOS DATOS
  const respuesta = await authFetch("/Alumnos");

  const alumnos = await respuesta.json();

  //LUEGO CON ESOS DATOS LOS RECORREMOS Y LOS INSERTAMOS EN EL SELECT
  const comboSelect = document.querySelector("#selectAlumnos");
  comboSelect.innerHTML = "";

  let opciones = '';
  alumnos.forEach((alumno) => {
    opciones += `<option value="${alumno.alumnoID}">${alumno.nombreCompleto}</option>`;
  });
  comboSelect.innerHTML = opciones;

  ObtenerNotasAlumnos();

}




async function ObtenerNotasAlumnos() {

  const asignaturaFiltrarID = document.querySelector("#selectAsignaturasFiltrar").value;

  const respuesta = await authFetch("/NotasAlumnos/NotasAlumnosAsignaturas/" + asignaturaFiltrarID);


  const notas = await respuesta.json();
  //console.log(notas);

  LimpiarModal();



  const bodyNotasAlumnos = document.getElementById("tbody-alumnos-notas");
  bodyNotasAlumnos.innerHTML = "";

  notas.forEach((notaAlumno) => {
    const tr = document.createElement("tr");

    let nota = notaAlumno.nota;
    if (notaAlumno.nota == 0) {
      nota = 'AUSENTE';
    }

    tr.innerHTML = `
       <td class="text-center">${notaAlumno.fechaString}</td>
            <td>${notaAlumno.nombreCompleto}</td>
            <td class="ocultarElemento768">${notaAlumno.dni} </td>
            <td>${notaAlumno.asignaturaNombre} </td>
            <td class="text-center">${notaAlumno.tipoInstanciaNombre} </td>
            <td class="text-center">${nota} </td>

               <td class="text-center columnaBtn">
                <button class="btn btn-utilidad" onclick="AbrirModalHistorial(${notaAlumno.notaAlumnoID})">
                 <i class="fa-solid fa-history"></i>
                </button>
            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-editar" onclick="AbrirModalEditar(${notaAlumno.notaAlumnoID})">
                 <i class="fa-solid fa-pen"></i>
                </button>
            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-eliminar" onclick="Eliminar(${notaAlumno.notaAlumnoID})">
                 <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

    bodyNotasAlumnos.appendChild(tr);
  });
}

function validarCamposRequeridos(contenedor) { //funcion que valida que los campos requeridos no esten vacios, recive por parametro el form correspondiente y hace las verificaciones
  let valido = true;

  const inputs = contenedor.querySelectorAll(".input-requerido");

  inputs.forEach(input => {
    const error = input.nextElementSibling;

    if (input.value.trim() === "") {
      error.style.display = "block";
      valido = false;
    } else {
      error.style.display = "none";
    }
  });

  return valido;
}

async function AbrirModalEditar(id) {

  try {

    const respuesta = await authFetch("/NotasAlumnos/" + id);


    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    const nota = await respuesta.json();

    document.getElementById("notaAlumnoID").value = nota.notaAlumnoID;
    document.getElementById("selectAlumnos").value = nota.alumnoID;
    document.getElementById("selectAsignaturas").value = nota.asignaturaID;
    document.getElementById("fecha").value = nota.fechaStringInput;
    document.getElementById("nota").value = nota.nota;
    document.getElementById("tipoInstancia").value = nota.tipoInstancia;
    document.getElementById("tipoInstancia").disabled = true;

    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalNotaAlumno')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}

async function GuardarNota() {

  const notaAlumnoID = document.getElementById("notaAlumnoID").value;
  const alumnoID = document.getElementById("selectAlumnos").value.trim();
  const asignaturaID = document.getElementById("selectAsignaturas").value.trim();
  const fecha = document.getElementById("fecha").value.trim();
  const nota = document.getElementById("nota").value.trim();
  const tipoInstancia = document.getElementById("tipoInstancia").value;

  const notaAlumno = {
    notaAlumnoID: notaAlumnoID,
    alumnoID: alumnoID,
    asignaturaID: asignaturaID,
    fecha: fecha,
    Nota: nota,
    tipoInstancia: parseInt(tipoInstancia)
  };

  if (nota >= 0 && nota <= 10 && tipoInstancia > 0) {
    if (notaAlumnoID > 0) {
      const res = await authFetch(`/NotasAlumnos/${notaAlumnoID}`, {
        method: "PUT",
        body: JSON.stringify(notaAlumno)
      });
    }
    else {
      const respuesta = await authFetch(`/NotasAlumnos`, {
        method: "POST",
        body: JSON.stringify(notaAlumno)
      });
    }

    ObtenerNotasAlumnos();
  }

}


async function Eliminar(id) {

  try {

    const respuesta = await authFetch(`/NotasAlumnos/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    ObtenerNotasAlumnos();

  } catch (error) {
    console.error("Error ELIMINAR:", error);
  }
}

async function LimpiarModal() {
  var fechaActual = new Date();

  var anio = fechaActual.getFullYear();
  var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
  var dia = fechaActual.getDate().toString().padStart(2, '0');

  var fechaStringInput = anio + "-" + mes + "-" + dia;
  //console.log(fechaStringInput);

  document.getElementById("notaAlumnoID").value = 0;
  document.getElementById("tipoInstancia").value = 0;
  document.getElementById("tipoInstancia").disabled = false;
  document.getElementById("fecha").value = fechaStringInput;
  document.getElementById("nota").value = "0";
}

ArmarComboCarrerasFiltrar();



async function AbrirModalHistorial(id) {

  try {
    const respuesta = await fetch(`${linkApi}/informes/HistorialNotas/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    const historial = await respuesta.json();

    const bodyNotasAlumnos = document.getElementById("tbody-historial-notas");
    bodyNotasAlumnos.innerHTML = "";

    historial.forEach((nota) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
       <td class="text-center">${nota.fechaCambioString} Hs.</td>
            <td>${nota.campoModificado}</td>
            <td>${nota.valorAnterior} </td>
              <td>${nota.valorNuevo} </td>
        `;

      bodyNotasAlumnos.appendChild(tr);
    });


    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalHistorialNotaAlumno')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}
