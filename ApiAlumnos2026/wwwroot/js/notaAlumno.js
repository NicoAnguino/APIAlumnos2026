

async function ObtenerAlumnos() {

  const respuesta = await authFetch("/Alumnos");

  const alumnos = await respuesta.json();

  const comboSelect = document.querySelector("#selectAlumnos");
  comboSelect.innerHTML = "";


  let opciones = '';
  alumnos.forEach((alumno) => {
    opciones += `<option value="${alumno.alumnoID}">${alumno.nombreCompleto}</option>`;
  });
  comboSelect.innerHTML = opciones;

  ObtenerAsignaturas();
}

async function ObtenerAsignaturas() {

  const respuesta = await authFetch("/Asignaturas");

  const asignaturas = await respuesta.json();

  const comboSelect = document.querySelector("#selectAsignaturas");
  comboSelect.innerHTML = "";


  let opciones = '';
  asignaturas.forEach((asignatura) => {
    opciones += `<option value="${asignatura.asignaturaID}">${asignatura.descripcion}</option>`;
  });
  comboSelect.innerHTML = opciones;

  ObtenerNotasAlumnos();
}


async function ObtenerNotasAlumnos() {


  var modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('modalNotaAlumno')
  );

  modal.hide();

  // const respuesta = await fetch(`${linkApi}/NotasAlumnos`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json"
  //   }
  // });

  const respuesta = await authFetch("/NotasAlumnos");


  const notas = await respuesta.json();
  console.log(notas);

  LimpiarModal();



  const bodyNotasAlumnos = document.getElementById("tbody-alumnos-notas");
  bodyNotasAlumnos.innerHTML = "";

  notas.forEach((notaAlumno) => {
    const tr = document.createElement("tr");

    let nota = notaAlumno.nota;
    if(notaAlumno.nota == 0){
       nota = 'AUSENTE';
    }

    tr.innerHTML = `
       <td class="text-center">${notaAlumno.fechaString}</td>
            <td>${notaAlumno.nombreCompleto}</td>
            <td class="ocultarElemento768">${notaAlumno.dni} </td>
              <td>${notaAlumno.asignaturaNombre} </td>
            
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
    // const respuesta = await fetch(`${linkApi}/NotasAlumnos/${id}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   }
    // );

    const respuesta = await authFetch("/NotasAlumnos/" + id);


    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    const nota = await respuesta.json();
    //console.log(tipoActividad);

    document.getElementById("notaAlumnoID").value = nota.notaAlumnoID;
    document.getElementById("selectAlumnos").value = nota.alumnoID;
    document.getElementById("selectAsignaturas").value = nota.asignaturaID;
    document.getElementById("fecha").value = nota.fechaStringInput;
    document.getElementById("nota").value = nota.nota;

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


  const notaAlumno = {
    notaAlumnoID: notaAlumnoID,
    alumnoID: alumnoID,
    asignaturaID: asignaturaID,
    fecha: fecha,
    Nota: nota
  };

  if (nota >= 0 && nota <= 10) {
    if (notaAlumnoID > 0) {
      // const respuesta = await fetch(`${linkApi}/NotasAlumnos/${notaAlumnoID}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(notaAlumno)
      // });

      const res = await authFetch(`/NotasAlumnos/${notaAlumnoID}`, {
        method: "PUT",
        body: JSON.stringify(notaAlumno)
      });
    }
    else {
      // const respuesta = await fetch(`${linkApi}/NotasAlumnos`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(notaAlumno)
      // });

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
    // const respuesta = await fetch(`${linkApi}/NotasAlumnos/${id}`,
    //   {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   }
    // );

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
  // document.getElementById("alumnoNombre").value = "";
  document.getElementById("fecha").value = fechaStringInput;
  document.getElementById("nota").value = "0";
}

ObtenerAlumnos();



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
