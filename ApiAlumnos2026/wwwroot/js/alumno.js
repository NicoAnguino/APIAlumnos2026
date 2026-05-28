

async function ObtenerAlumnos() {


  //  var modal = bootstrap.Modal.getOrCreateInstance(
  //       document.getElementById('modalAlumno')
  //     );

  //     modal.hide();

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
              <td>${alumno.email} </td>
               <td class="text-center columnaBtn">
                <button class="btn btn-utilidad" onclick="AbrirModalHistorial(${alumno.alumnoID})">
                 <i class="fa-solid fa-history"></i>
                 Historial</button>
            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-editar" onclick="AbrirModalEditar(${alumno.alumnoID})">
                <i class="fa-solid fa-pen"></i>
                Editar
                </button>

            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-eliminar" onclick="Eliminar(${alumno.alumnoID})">
                 <i class="fa-solid fa-trash"></i>
                 Eliminar</button>
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
    document.getElementById("email").value = alumno.email;
    document.getElementById("email").disabled = true;

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
  const email = document.getElementById("email").value.trim();

  const alumno = {
    alumnoID: alumnoID,
    nombreCompleto: nombreAlumno,
    dNI: dni,
    domicilio: domicilio,
    sexo: sexo,
    email: email
  };

  document.getElementById("errorNombre").textContent = "";
  document.getElementById("errorEmail").textContent = "";
  //console.log(alumno);
  if (nombreAlumno == "") {
    document.getElementById("errorNombre").textContent = "Ingrese un nombre";
  }
  if (email == "") {
    document.getElementById("errorEmail").textContent = "Ingrese un email";
  }

  if (nombreAlumno != "" && email != "") {
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


      const data = await respuesta.json();

if (!respuesta.ok) {
    //console.log(data.mensaje);
    document.getElementById("errorNombre").textContent = data.mensaje;
    //alert(data.mensaje);
    return;
}

console.log(data);
    }

    //if(alumnoID > 0){
    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAlumno')
    );

    modal.hide();
    //}

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
  document.getElementById("email").value = "";
  document.getElementById("email").disabled = false;
  document.getElementById("errorNombre").textContent = "";
  document.getElementById("errorEmail").textContent = "";
}

ObtenerAlumnos();

async function AbrirModalHistorial(id) {

  try {
    const respuesta = await fetch(`${linkApi}/informes/HistorialAlumno/${id}`,
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

    const bodyNotasAlumnos = document.getElementById("tbody-historial-alumnos");
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
      document.getElementById('modalHistorialAlumno')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}