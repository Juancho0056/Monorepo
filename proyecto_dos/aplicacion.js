const urlBase = "https://todoapitest.juansegaliz.com";

const formulario = document.getElementById("formulario");
const campoId = document.getElementById("campo-id");
const campoTitulo = document.getElementById("campo-titulo");
const campoDescripcion = document.getElementById("campo-descripcion");
const campoPrioridad = document.getElementById("campo-prioridad");
const campoFecha = document.getElementById("campo-fecha");
const campoEstado = document.getElementById("campo-estado");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const areaDetalle = document.getElementById("detalle");
const campoBusqueda = document.getElementById("campo-busqueda");
const botonBuscar = document.getElementById("boton-buscar");
const botonLimpiar = document.getElementById("boton-limpiar");
const botonEliminar = document.getElementById("boton-eliminar");

async function cargarListado() {
  try {
    const respuesta = await fetch(`${urlBase}/Todos`);
    const datos = await respuesta.json();
    const pendientes = datos.data || [];
    construirTabla(pendientes);
  } catch (error) {
    alert("No fue posible cargar los pendientes");
    console.error(error);
  }
}

function construirTabla(pendientes) {
  cuerpoTabla.innerHTML = "";
  pendientes.forEach((pendiente) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${pendiente.id}</td>
      <td>${pendiente.title || "Sin título"}</td>
      <td>
        <span class="badge ${pendiente.isCompleted ? "bg-success" : "bg-warning text-dark"}">
          ${pendiente.isCompleted ? "Terminado" : "Pendiente"}
        </span>
      </td>
      <td>${pendiente.priority}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" data-accion="ver" data-identificador="${pendiente.id}">Ver</button>
          <button class="btn btn-sm btn-outline-secondary" data-accion="editar" data-identificador="${pendiente.id}">Editar</button>
        </div>
      </td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

function limpiarFormulario() {
  campoId.value = "";
  campoTitulo.value = "";
  campoDescripcion.value = "";
  campoPrioridad.value = "1";
  campoFecha.value = "";
  campoEstado.value = "false";
}

function mostrarDetalle(pendiente) {
  if (!pendiente) {
    areaDetalle.innerHTML = '<p class="text-danger">No se encontró el pendiente solicitado.</p>';
    return;
  }
  const fechaLimite = pendiente.dueAt ? new Date(pendiente.dueAt).toLocaleString() : "Sin definir";
  const fechaCreacion = pendiente.createdAt ? new Date(pendiente.createdAt).toLocaleString() : "Sin registrar";
  const fechaActualizacion = pendiente.updatedAt ? new Date(pendiente.updatedAt).toLocaleString() : "Sin registrar";
  areaDetalle.innerHTML = `
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>Código:</strong> ${pendiente.id}</li>
      <li class="list-group-item"><strong>Título:</strong> ${pendiente.title || "Sin título"}</li>
      <li class="list-group-item"><strong>Descripción:</strong> ${pendiente.description || "Sin descripción"}</li>
      <li class="list-group-item"><strong>Estado:</strong> ${pendiente.isCompleted ? "Terminado" : "Pendiente"}</li>
      <li class="list-group-item"><strong>Prioridad:</strong> ${pendiente.priority}</li>
      <li class="list-group-item"><strong>Fecha límite:</strong> ${fechaLimite}</li>
      <li class="list-group-item"><strong>Creado:</strong> ${fechaCreacion}</li>
      <li class="list-group-item"><strong>Actualizado:</strong> ${fechaActualizacion}</li>
    </ul>
  `;
}

function llenarFormulario(pendiente) {
  campoId.value = pendiente.id;
  campoTitulo.value = pendiente.title || "";
  campoDescripcion.value = pendiente.description || "";
  campoPrioridad.value = pendiente.priority ?? 1;
  campoEstado.value = pendiente.isCompleted ? "true" : "false";
  campoFecha.value = pendiente.dueAt ? transformarFecha(pendiente.dueAt) : "";
}

function transformarFecha(valor) {
  const fecha = new Date(valor);
  const ajustada = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return ajustada.toISOString().slice(0, 16);
}

async function guardarPendiente(evento) {
  evento.preventDefault();
  const cuerpo = {
    title: campoTitulo.value.trim(),
    description: campoDescripcion.value.trim(),
    isCompleted: campoEstado.value === "true",
    priority: Number(campoPrioridad.value) || 1,
    dueAt: campoFecha.value ? new Date(campoFecha.value).toISOString() : null,
  };
  const identificador = campoId.value;
  const esEdicion = Boolean(identificador);
  try {
    const respuesta = await fetch(esEdicion ? `${urlBase}/Todos/${identificador}` : `${urlBase}/Todos`, {
      method: esEdicion ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    if (!respuesta.ok) {
      throw new Error("Error al guardar");
    }
    const datos = await respuesta.json();
    mostrarDetalle(datos.data);
    cargarListado();
    if (!esEdicion) {
      limpiarFormulario();
    }
    alert(esEdicion ? "Información actualizada" : "Pendiente creado");
  } catch (error) {
    alert("Ocurrió un problema al guardar");
    console.error(error);
  }
}

async function obtenerPorId(identificador) {
  try {
    const respuesta = await fetch(`${urlBase}/Todos/${identificador}`);
    if (!respuesta.ok) {
      throw new Error("Sin resultado");
    }
    const datos = await respuesta.json();
    return datos.data;
  } catch (error) {
    alert("No fue posible consultar el pendiente");
    console.error(error);
    return null;
  }
}

async function eliminarPendiente() {
  const identificador = campoId.value.trim();
  if (!identificador) {
    alert("Seleccione un pendiente antes de eliminar");
    return;
  }
  if (!confirm("¿Está seguro de eliminar este pendiente?")) {
    return;
  }
  try {
    const respuesta = await fetch(`${urlBase}/Todos/${identificador}`, { method: "DELETE" });
    if (!respuesta.ok) {
      throw new Error("Error al eliminar");
    }
    limpiarFormulario();
    areaDetalle.innerHTML = '<p class="text-muted">Seleccione un pendiente para revisar su información.</p>';
    cargarListado();
    alert("Pendiente eliminado");
  } catch (error) {
    alert("No fue posible eliminar el pendiente");
    console.error(error);
  }
}

cuerpoTabla.addEventListener("click", async (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) {
    return;
  }
  const identificador = boton.dataset.identificador;
  if (!identificador) {
    return;
  }
  const pendiente = await obtenerPorId(identificador);
  if (!pendiente) {
    return;
  }
  mostrarDetalle(pendiente);
  if (boton.dataset.accion === "editar") {
    llenarFormulario(pendiente);
  }
});

botonBuscar.addEventListener("click", async () => {
  const identificador = campoBusqueda.value.trim();
  if (!identificador) {
    alert("Ingrese un código para buscar");
    return;
  }
  const pendiente = await obtenerPorId(identificador);
  if (pendiente) {
    mostrarDetalle(pendiente);
    llenarFormulario(pendiente);
  }
});

botonLimpiar.addEventListener("click", () => {
  limpiarFormulario();
  campoBusqueda.value = "";
});

botonEliminar.addEventListener("click", eliminarPendiente);

formulario.addEventListener("submit", guardarPendiente);

cargarListado();
