let linkApi = 'http://localhost:5128/Api';

async function ObtenerNotasAlumnos() {


 var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalNotaAlumno')
    );

    modal.hide();

  const respuesta = await fetch(`${linkApi}/NotasAlumnos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const notas = await respuesta.json();
  console.log(notas);

  LimpiarModal();



  const bodyNotasAlumnos = document.getElementById("tbody-alumnos-notas");
  bodyNotasAlumnos.innerHTML = "";

  notas.forEach((nota) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${nota.nombreCompleto}</td>
            <td>${nota.dni} </td>
            <td>${nota.nota} </td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="AbrirModalEditar(${nota.notaAlumnoID})">Editar</button>

            </td>
            <td>
                <button class="btn btn-sm btn-danger me-2" onclick="Eliminar(${nota.notaAlumnoID})">Eliminar</button>
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
    const respuesta = await fetch(`${linkApi}/NotasAlumnos/${id}`,
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

    const nota = await respuesta.json();
    //console.log(tipoActividad);

    document.getElementById("notaAlumnoID").value = nota.notaAlumnoID;
    document.getElementById("alumnoNombre").value = nota.nombreCompleto;
    document.getElementById("dni").value = nota.dni;
    document.getElementById("nota").value = nota.nota;

    // $("#modalNotaAlumno").modal("show");

    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalNotaAlumno')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}

async function GuardarNota() {

  const form = document.querySelector(".formNotaAlumno");

  // if (!validarCamposRequeridos(form)) {
  //   return;
  // }

  const notaAlumnoID = document.getElementById("notaAlumnoID").value;
  const nombreAlumno = document.getElementById("alumnoNombre").value.trim();
  const nota = document.getElementById("nota").value.trim();
  const dni = document.getElementById("dni").value.trim();

  const notaAlumno = {
    notaAlumnoID: notaAlumnoID,
    NombreCompleto: nombreAlumno,
    DNI: dni,
    Nota: nota
  };

  if (nota > 0 && nota <= 10) {
    if (notaAlumnoID > 0) {
      const respuesta = await fetch(`${linkApi}/NotasAlumnos/${notaAlumnoID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(notaAlumno)
      });
    }
    else {
      const respuesta = await fetch(`${linkApi}/NotasAlumnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(notaAlumno)
      });
    }

    ObtenerNotasAlumnos();
  }

}


async function Eliminar(id) {

  try {
    const respuesta = await fetch(`${linkApi}/NotasAlumnos/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    //const nota = await respuesta.json();
    //console.log(tipoActividad);

    ObtenerNotasAlumnos();

  } catch (error) {
    console.error("Error ELIMINAR:", error);
  }
}





async function LimpiarModal() {
  document.getElementById("notaAlumnoID").value = 0;
  document.getElementById("alumnoNombre").value = "";
  document.getElementById("dni").value = "";
  document.getElementById("nota").value = "";
}

ObtenerNotasAlumnos();
