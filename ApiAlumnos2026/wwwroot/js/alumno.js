

async function ObtenerAlumnos() {


 var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAlumno')
    );

    modal.hide();

  const respuesta = await fetch(`${linkApi}/Alumnos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const alumnos = await respuesta.json();
  //console.log(alumnos);

  LimpiarModal();



  const bodyAlumnos = document.getElementById("tbody-alumnos");
  bodyAlumnos.innerHTML = "";

  alumnos.forEach((alumno) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${alumno.nombreCompleto}</td>
            <td>${alumno.dni} </td>
            <td>${alumno.domicilio} </td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="AbrirModalEditar(${alumno.alumnoID})">Editar</button>

            </td>
            <td>
                <button class="btn btn-sm btn-danger me-2" onclick="Eliminar(${alumno.alumnoID})">Eliminar</button>
            </td>
        `;

    bodyAlumnos.appendChild(tr);
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
    const respuesta = await fetch(`${linkApi}/Alumnos/${id}`,
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

    const alumno = await respuesta.json();
    //console.log(tipoActividad);

    document.getElementById("alumnoID").value = alumno.alumnoID;
    document.getElementById("alumnoNombre").value = alumno.nombreCompleto;
    document.getElementById("dni").value = alumno.dni;
    document.getElementById("domicilio").value = alumno.domicilio;
  document.getElementById("sexo").value = alumno.sexo;

    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAlumno')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}

async function Guardar() {

  //const form = document.querySelector(".formAlumno");

  // if (!validarCamposRequeridos(form)) {
  //   return;
  // }

  const alumnoID = document.getElementById("alumnoID").value;
  const nombreAlumno = document.getElementById("alumnoNombre").value.trim();
  const dni = document.getElementById("dni").value;
  const domicilio = document.getElementById("domicilio").value.trim();
  const sexo = parseInt(document.getElementById("sexo").value);

  const alumno = {
    alumnoID: alumnoID,
    nombreCompleto: nombreAlumno,
    dNI: dni,
    domicilio: domicilio,
    sexo: sexo
  };

  console.log(alumno);

  if (nombreAlumno != "") {
    if (alumnoID > 0) {
      const respuesta = await fetch(`${linkApi}/Alumnos/${alumnoID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(alumno)
      });
    }
    else {
      const respuesta = await fetch(`${linkApi}/Alumnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(alumno)
      });
    }

    ObtenerAlumnos();
  }

}


async function Eliminar(id) {

  try {
    const respuesta = await fetch(`${linkApi}/Alumnos/${id}`,
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

    ObtenerAlumnos();

  } catch (error) {
    console.error("Error ELIMINAR:", error);
  }
}

async function LimpiarModal() {
  document.getElementById("alumnoID").value = 0;
  document.getElementById("alumnoNombre").value = "";
  document.getElementById("dni").value = "";
  document.getElementById("domicilio").value = "";
}

ObtenerAlumnos();
