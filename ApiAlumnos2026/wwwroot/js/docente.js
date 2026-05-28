

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
             <td>${docente.email} </td>
                  <td class="text-center columnaBtn">
                <button class="btn btn-utilidad" onclick="AbrirModalHistorial(${docente.docenteID})">
                 <i class="fa-solid fa-history"></i>
                 Historial</button>
            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-editar" onclick="AbrirModalEditar(${docente.docenteID})">
                  <i class="fa-solid fa-pen"></i>
                  Editar</button>

            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-eliminar" onclick="Eliminar(${docente.docenteID})">
                   <i class="fa-solid fa-trash"></i>
                   Eliminar</button>
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
    document.getElementById("email").value = docente.email;
    document.getElementById("email").disabled = true;

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
  const email = document.getElementById("email").value.trim();

  const docente = {
    docenteID: docenteID,
    nombreCompleto: nombreDocente,
    dNI: dni,
    sexo: sexo,
    email: email
  };
  document.getElementById("errorNombre").textContent = "";
  document.getElementById("errorEmail").textContent = "";
  //console.log(docente);
  if (nombreDocente == "") {
    document.getElementById("errorNombre").textContent = "Ingrese un nombre";
  }
  if (email == "") {
    document.getElementById("errorEmail").textContent = "Ingrese un email";
  }


  if (nombreDocente != "" && email != "") {
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
  document.getElementById("email").value = "";
  document.getElementById("email").disabled = false;
  document.getElementById("errorNombre").textContent = "";
  document.getElementById("errorEmail").textContent = "";
}

ObtenerDocentes();

async function AbrirModalHistorial(id) {

  try {
    const respuesta = await fetch(`${linkApi}/informes/HistorialDocente/${id}`,
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

    const bodyNotasDocentes = document.getElementById("tbody-historial-docentes");
    bodyNotasDocentes.innerHTML = "";

    historial.forEach((nota) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
       <td class="text-center">${nota.fechaCambioString} Hs.</td>
            <td>${nota.campoModificado}</td>
            <td>${nota.valorAnterior} </td>
              <td>${nota.valorNuevo} </td>
        `;

      bodyNotasDocentes.appendChild(tr);
    });


    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalHistorialDocente')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}
