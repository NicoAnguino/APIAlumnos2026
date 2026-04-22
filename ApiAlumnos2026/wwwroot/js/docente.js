

async function ObtenerDocentes() {


 var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalDocente')
    );

    modal.hide();

  const respuesta = await fetch(`${linkApi}/Docentes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const docentes = await respuesta.json();
  //console.log(docentes);

  LimpiarModal();



  const bodyDocentes = document.getElementById("tbody-docentes");
  bodyDocentes.innerHTML = "";

  docentes.forEach((docente) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${docente.nombreCompleto}</td>
            <td>${docente.dni} </td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="AbrirModalEditar(${docente.docenteID})">Editar</button>

            </td>
            <td>
                <button class="btn btn-sm btn-danger me-2" onclick="Eliminar(${docente.docenteID})">Eliminar</button>
            </td>
        `;

    bodyDocentes.appendChild(tr);
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
    const respuesta = await fetch(`${linkApi}/Docentes/${id}`,
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

    const docente = await respuesta.json();
    //console.log(tipoActividad);

    document.getElementById("docenteID").value = docente.docenteID;
    document.getElementById("docenteNombre").value = docente.nombreCompleto;
    document.getElementById("dni").value = docente.dni;
  document.getElementById("sexo").value = docente.sexo;

    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalDocente')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}

async function Guardar() {

  const docenteID = document.getElementById("docenteID").value;
  const nombreDocente = document.getElementById("docenteNombre").value.trim();
  const dni = document.getElementById("dni").value;
  const sexo = parseInt(document.getElementById("sexo").value);

  const docente = {
    docenteID: docenteID,
    nombreCompleto: nombreDocente,
    dNI: dni,
    sexo: sexo
  };

  console.log(docente);

  if (nombreDocente != "") {
    if (docenteID > 0) {
      const respuesta = await fetch(`${linkApi}/Docentes/${docenteID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(docente)
      });
    }
    else {
      const respuesta = await fetch(`${linkApi}/Docentes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(docente)
      });
    }

    ObtenerDocentes();
  }

}


async function Eliminar(id) {

  try {
    const respuesta = await fetch(`${linkApi}/Docentes/${id}`,
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

    ObtenerDocentes();

  } catch (error) {
    console.error("Error ELIMINAR:", error);
  }
}

async function LimpiarModal() {
  document.getElementById("docenteID").value = 0;
  document.getElementById("docenteNombre").value = "";
  document.getElementById("dni").value = "";
}

ObtenerDocentes();
