async function ObtenerCarreras() {


  var modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('modalCarrera')
  );

  modal.hide();

  const respuesta = await authFetch("/carreras");



  const carreras = await respuesta.json();

  LimpiarModal();



  const bodyCarreras = document.getElementById("tbody-carreras");
  bodyCarreras.innerHTML = "";

  carreras.forEach((carrera) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${carrera.nombre}</td>
            <td>${carrera.duracion} AÑOS</td>
            <td class="text-center columnaBtn">
 <button class="btn btn-editar" onclick="AbrirModalEditar(${carrera.carreraID})">
        <i class="fa-solid fa-pen"></i>       
    </button>
            </td>
            <td class="text-center columnaBtn">
                <button class="btn btn-eliminar" onclick="Eliminar(${carrera.carreraID})">
                 <i class="fa-solid fa-trash"></i>
                 </button>
            </td>
        `;

    bodyCarreras.appendChild(tr);
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

const respuesta = await authFetch("/Carreras/" + id);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    const carrera = await respuesta.json();
    document.getElementById("titulo-modal").textContent = "EDITAR CARRERA";
    document.getElementById("carreraID").value = carrera.carreraID;
    document.getElementById("carreraNombre").value = carrera.nombre;
    document.getElementById("duracion").value = carrera.duracion;

    var modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalCarrera')
    );

    modal.show();

  } catch (error) {
    console.error("Error editar:", error);
  }
}

async function Guardar() {

  const carreraID = document.getElementById("carreraID").value;
  //tambien buscamos la descripcion
  const descripcion = document.getElementById("carreraNombre").value.trim();

  //con eso armamos el objeto para pasar a la api
  const carrera = {
    carreraID: carreraID,
    nombre: descripcion,
    duracion: document.getElementById("duracion").value
  };

//verifico que el usuario tenga escrito una descripcion
  if (descripcion != "") {
    //pregunto si carrera es mayor a 0 
    if (carreraID > 0) {

      const res = await authFetch(`/Carreras/${carreraID}`, {
        method: "PUT",
        body: JSON.stringify(carrera)
    });
    }
    else {

 const res = await authFetch(`/Carreras`, {
        method: "POST",
        body: JSON.stringify(carrera)
    });

    }

    ObtenerCarreras();
  }

}


async function Eliminar(id) {

  try {
   const respuesta = await authFetch(`/Carreras/${id}`, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el dato");
    }

    ObtenerCarreras();

  } catch (error) {
    console.error("Error ELIMINAR:", error);
  }
}

//si se llama esta funcion es para resetar el modal y permitir cargar un nuevo registro
async function LimpiarModal() {
  document.getElementById("carreraID").value = 0;
  document.getElementById("carreraNombre").value = "";
  document.getElementById("titulo-modal").textContent = "CREAR CARRERA";
}

ObtenerCarreras();
