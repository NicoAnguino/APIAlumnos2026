

async function ObtenerAsignaturas() {


 var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAsignatura')
    );

    modal.hide();

  const respuesta = await fetch(`${linkApi}/Asignaturas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const asignaturas = await respuesta.json();

  LimpiarModal();



  const bodyAsignaturas = document.getElementById("tbody-asignaturas");
  bodyAsignaturas.innerHTML = "";

  asignaturas.forEach((asignatura) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${asignatura.descripcion}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="AbrirModalEditar(${asignatura.asignaturaID})">Editar</button>

            </td>
            <td>
                <button class="btn btn-sm btn-danger me-2" onclick="Eliminar(${asignatura.asignaturaID})">Eliminar</button>
            </td>
        `;

    bodyAsignaturas.appendChild(tr);
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
    const respuesta = await fetch(`${linkApi}/Asignaturas/${id}`,
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

    const asignatura = await respuesta.json();

    document.getElementById("asignaturaID").value = asignatura.asignaturaID;
    document.getElementById("asignaturaNombre").value = asignatura.descripcion;

    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAsignatura')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}

async function Guardar() {

  const asignaturaID = document.getElementById("asignaturaID").value;
  const descripcion = document.getElementById("asignaturaNombre").value.trim();

  const asignatura = {
    asignaturaID: asignaturaID,
    descripcion: descripcion
  };

  console.log(asignatura);

  if (descripcion != "") {
    if (asignaturaID > 0) {
      const respuesta = await fetch(`${linkApi}/Asignaturas/${asignaturaID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(asignatura)
      });
    }
    else {
      const respuesta = await fetch(`${linkApi}/Asignaturas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(asignatura)
      });
    }

    ObtenerAsignaturas();
  }

}


async function Eliminar(id) {

  try {
    const respuesta = await fetch(`${linkApi}/Asignaturas/${id}`,
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

    ObtenerAsignaturas();

  } catch (error) {
    console.error("Error ELIMINAR:", error);
  }
}

async function LimpiarModal() {
  document.getElementById("asignaturaID").value = 0;
  document.getElementById("asignaturaNombre").value = "";
}

ObtenerAsignaturas();
