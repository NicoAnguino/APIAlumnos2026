async function ObtenerAsignaturasPorDocente() {

    const res = await fetch(`${linkApi}/informes/asignaturasPorDocente`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const docentes = await res.json();
    const tbody = document.querySelector("#tablaDocentes tbody");
    tbody.innerHTML = "";

    console.log(docentes);

    docentes.forEach(docente => {

        const rowInsertar = document.createElement("tr");
        rowInsertar.innerHTML = `          
            <td class='table-primary'>${docente.nombreCompleto}</td>   
            <td class="table-primary text-center">${docente.dni}</td>
            <td class="table-primary">${docente.email}</td>       
        `;
        tbody.appendChild(rowInsertar);

        //LUEGO DE HABER INSERTADO LA FILA DEL DOCENTE
        //DEBEMOS RECORRER QUE ASIGNATURAS TIENE DICHO DOCENTE
        docente.listadoAsignaturas.forEach(asignatura => {
            const rowInsertar = document.createElement("tr");
            rowInsertar.innerHTML = `               
            <td colspan='3'>${asignatura.descripcion}</td>                  
        `;
            tbody.appendChild(rowInsertar);
        });

    });
}

ObtenerAsignaturasPorDocente();