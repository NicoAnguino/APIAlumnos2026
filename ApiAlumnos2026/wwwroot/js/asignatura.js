

async function ObtenerAsignaturas() {

  //const getToken = () => localStorage.getItem("token");

//console.log(getToken());

  var modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('modalAsignatura')
  );

  modal.hide();

  const respuesta = await authFetch("/asignaturas");

  // const respuesta = await fetch(`${linkApi}/Asignaturas`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json"
  //   }
  // });

  const asignaturas = await respuesta.json();

  LimpiarModal();



  const bodyAsignaturas = document.getElementById("tbody-asignaturas");
  bodyAsignaturas.innerHTML = "";

  asignaturas.forEach((asignatura) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${asignatura.descripcion}</td>
            <td class="text-center columnaBtn">
 <button class="btn btn-editar" onclick="AbrirModalEditar(${asignatura.asignaturaID})">
        <i class="fa-solid fa-pen"></i>       
    </button>
            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-eliminar" onclick="Eliminar(${asignatura.asignaturaID})">
                 <i class="fa-solid fa-trash"></i>
                 </button>
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
    // const respuesta = await fetch(`${linkApi}/Asignaturas/${id}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   }
    // );

const respuesta = await authFetch("/Asignaturas/" + id);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    const asignatura = await respuesta.json();
    document.getElementById("titulo-modal").textContent = "EDITAR ASIGNATURA";
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

  //asignatura id puede ser 0 o distinto de 0
  const asignaturaID = document.getElementById("asignaturaID").value;
  //tambien buscamos la descripcion
  const descripcion = document.getElementById("asignaturaNombre").value.trim();

  //con eso armamos el objeto para pasar a la api
  const asignatura = {
    asignaturaID: asignaturaID,
    descripcion: descripcion
  };

  //console.log(asignatura);
//verifico que el usuario tenga escrito una descripcion
  if (descripcion != "") {
    //pregunto si asignatura es mayor a 0 
    if (asignaturaID > 0) {
      //al ser mayor a cero va a llamar a al put de la api para editar
      // const respuesta = await fetch(`${linkApi}/Asignaturas/${asignaturaID}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(asignatura)
      // });

      const res = await authFetch(`/Asignaturas/${asignaturaID}`, {
        method: "PUT",
        body: JSON.stringify(asignatura)
    });
    }
    else {
      // const respuesta = await fetch(`${linkApi}/Asignaturas`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(asignatura)
      // });

 const res = await authFetch(`/Asignaturas`, {
        method: "POST",
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

//si se llama esta funcion es para resetar el modal y permitir cargar un nuevo registro
async function LimpiarModal() {
  document.getElementById("asignaturaID").value = 0;
  document.getElementById("asignaturaNombre").value = "";
  document.getElementById("titulo-modal").textContent = "CREAR ASIGNATURA";
}

ObtenerAsignaturas();
