async function ObtenerCarreras() {

  const respuesta = await authFetch("/Carreras");

  const carreras = await respuesta.json();

  const comboSelect = document.querySelector("#selectCarreras");
  comboSelect.innerHTML = "";


  let opciones = '';
  carreras.forEach((carrera) => {
    opciones += `<option value="${carrera.carreraID}">${carrera.nombre}</option>`;
  });
  comboSelect.innerHTML = opciones;

  //CUANDO TERMINAMOS DE AGREGAR LAS CARRERAS EN EL SELECT

  CompletarSelectAnios();
  
  ObtenerAsignaturas();
}



async function CompletarSelectAnios() {

  let id = document.getElementById("selectCarreras").value;

  try {

    const respuesta = await authFetch("/Carreras/" + id);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    const carrera = await respuesta.json();

    const comboSelect = document.querySelector("#selectAnios");
    comboSelect.innerHTML = "";

    let opciones = '';
    for (let index = 1; index <= carrera.duracion; index++) {
      opciones += `<option value="${index}">${index} Año</option>`;
    }
    comboSelect.innerHTML = opciones;


  } catch (error) {
    console.error("Error editar:", error);
  }
}



async function ObtenerAsignaturas() {

  var modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('modalAsignatura')
  );

  modal.hide();

  const respuesta = await authFetch("/asignaturas/AsignaturasPorCarreras");

  const carreras = await respuesta.json();

  LimpiarModal();

  const bodyAsignaturas = document.getElementById("tbody-asignaturas");
  bodyAsignaturas.innerHTML = "";

  carreras.forEach((carrera) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td class='table-info' colspan="4">${carrera.nombre} - (DURACIÓN DE ${carrera.duracion} AÑOS)</td>              
        `;

    bodyAsignaturas.appendChild(tr);


    carrera.asignaturas.forEach((asignatura) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
            <td>${asignatura.descripcion}</td>
            <td>${asignatura.anio} AÑO</td>
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

    const respuesta = await authFetch("/Asignaturas/" + id);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    const asignatura = await respuesta.json();
    document.getElementById("titulo-modal").textContent = "EDITAR ASIGNATURA";
    document.getElementById("asignaturaID").value = asignatura.asignaturaID;
    document.getElementById("asignaturaNombre").value = asignatura.descripcion;
    document.getElementById("selectCarreras").value = asignatura.carreraID;
    
    CompletarSelectAnios();
    
    setTimeout(() => {
       document.getElementById("selectAnios").value = asignatura.anio;
    }, 200);
   

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
    carreraID: document.getElementById("selectCarreras").value,
    anio: document.getElementById("selectAnios").value,
    descripcion: descripcion
  };

  //console.log(asignatura);
  //verifico que el usuario tenga escrito una descripcion
  if (descripcion != "") {
    //pregunto si asignatura es mayor a 0 
    if (asignaturaID > 0) {

      const res = await authFetch(`/Asignaturas/${asignaturaID}`, {
        method: "PUT",
        body: JSON.stringify(asignatura)
      });
    }
    else {

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
    const respuesta = await authFetch(`/Asignaturas/${id}`, {
      method: "DELETE"
    });

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

ObtenerCarreras();
