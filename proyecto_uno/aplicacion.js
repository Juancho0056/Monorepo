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

async function obtenerListado() {
  try {
    const respuesta = await fetch(`${urlBase}/Todos`);
    const datos = await respuesta.json();
    const pendientes = datos.data || [];
    dibujarTabla(pendientes);
  } catch (error) {
    alert("No fue posible cargar el listado de pendientes");
    console.error(error);
  }
}

function dibujarTabla(pendientes) {
  cuerpoTabla.innerHTML = "";
  pendientes.forEach((pendiente) => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(pendiente.id, "Código"));
    fila.appendChild(crearCelda(pendiente.title || "Sin título", "Título"));
    fila.appendChild(
      crearCelda(pendiente.isCompleted ? "Terminado" : "Pendiente", "Estado")
    );
    fila.appendChild(crearCelda(pendiente.priority, "Prioridad"));

    const celdaAcciones = crearCelda("", "Acciones");
    const contenedorAcciones = document.createElement("div");
    contenedorAcciones.className = "fila-accion";

    const botonVer = document.createElement("button");
    botonVer.dataset.accion = "ver";
    botonVer.dataset.identificador = pendiente.id;
    botonVer.textContent = "Ver";

    const botonEditar = document.createElement("button");
    botonEditar.dataset.accion = "editar";
    botonEditar.dataset.identificador = pendiente.id;
    botonEditar.textContent = "Editar";

    contenedorAcciones.append(botonVer, botonEditar);
    celdaAcciones.appendChild(contenedorAcciones);
    fila.appendChild(celdaAcciones);
    cuerpoTabla.appendChild(fila);
  });
}

function crearCelda(texto, encabezado) {
  const celda = document.createElement("td");
  celda.dataset.encabezado = encabezado;
  celda.textContent = texto;
  return celda;
}

function limpiarFormulario() {
  campoId.value = "";
  campoTitulo.value = "";
  campoDescripcion.value = "";
  campoPrioridad.value = "1";
  campoFecha.value = "";
  campoEstado.value = "false";
}

function prepararDetalle(pendiente) {
  if (!pendiente) {
    areaDetalle.innerHTML = "<p>No se encontró información para mostrar.</p>";
    return;
  }
  const fechaLimite = pendiente.dueAt ? new Date(pendiente.dueAt).toLocaleString() : "Sin definir";
  const fechaCreacion = pendiente.createdAt ? new Date(pendiente.createdAt).toLocaleString() : "Sin registrar";
  const fechaActualizacion = pendiente.updatedAt ? new Date(pendiente.updatedAt).toLocaleString() : "Sin registrar";
  areaDetalle.innerHTML = `
    <p><strong>Código:</strong> ${pendiente.id}</p>
    <p><strong>Título:</strong> ${pendiente.title || "Sin título"}</p>
    <p><strong>Descripción:</strong> ${pendiente.description || "Sin descripción"}</p>
    <p><strong>Estado:</strong> ${pendiente.isCompleted ? "Terminado" : "Pendiente"}</p>
    <p><strong>Prioridad:</strong> ${pendiente.priority}</p>
    <p><strong>Fecha límite:</strong> ${fechaLimite}</p>
    <p><strong>Creado:</strong> ${fechaCreacion}</p>
    <p><strong>Actualizado:</strong> ${fechaActualizacion}</p>
  `;
}

function cargarEnFormulario(pendiente) {
  campoId.value = pendiente.id;
  campoTitulo.value = pendiente.title || "";
  campoDescripcion.value = pendiente.description || "";
  campoPrioridad.value = pendiente.priority ?? 1;
  campoEstado.value = pendiente.isCompleted ? "true" : "false";
  campoFecha.value = pendiente.dueAt ? formatoFechaFormulario(pendiente.dueAt) : "";
}

function formatoFechaFormulario(valor) {
  const fecha = new Date(valor);
  const zona = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return zona.toISOString().slice(0, 16);
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
    const opciones = {
      method: esEdicion ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    };
    const url = esEdicion ? `${urlBase}/Todos/${identificador}` : `${urlBase}/Todos`;
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
      throw new Error("Respuesta no válida");
    }
    const datos = await respuesta.json();
    prepararDetalle(datos.data);
    obtenerListado();
    if (!esEdicion) {
      limpiarFormulario();
    }
    alert(esEdicion ? "Pendiente actualizado correctamente" : "Pendiente creado correctamente");
  } catch (error) {
    alert("No fue posible guardar la información");
    console.error(error);
  }
}

async function buscarPendientePorId(identificador) {
  try {
    const respuesta = await fetch(`${urlBase}/Todos/${identificador}`);
    if (!respuesta.ok) {
      throw new Error("Sin resultado");
    }
    const datos = await respuesta.json();
    return datos.data;
  } catch (error) {
    alert("No fue posible consultar el pendiente solicitado");
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
  if (!confirm("¿Desea eliminar el pendiente seleccionado?")) {
    return;
  }
  try {
    const respuesta = await fetch(`${urlBase}/Todos/${identificador}`, { method: "DELETE" });
    if (!respuesta.ok) {
      throw new Error("Error al eliminar");
    }
    limpiarFormulario();
    areaDetalle.innerHTML = "<p>Seleccione un elemento para ver su información.</p>";
    obtenerListado();
    alert("Pendiente eliminado correctamente");
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
  const pendiente = await buscarPendientePorId(identificador);
  if (!pendiente) {
    return;
  }
  prepararDetalle(pendiente);
  if (boton.dataset.accion === "editar") {
    cargarEnFormulario(pendiente);
  }
});

botonBuscar.addEventListener("click", async () => {
  const identificador = campoBusqueda.value.trim();
  if (!identificador) {
    alert("Ingrese un código antes de buscar");
    return;
  }
  const pendiente = await buscarPendientePorId(identificador);
  if (pendiente) {
    prepararDetalle(pendiente);
    cargarEnFormulario(pendiente);
  }
});

botonLimpiar.addEventListener("click", () => {
  limpiarFormulario();
  campoBusqueda.value = "";
});

botonEliminar.addEventListener("click", eliminarPendiente);

formulario.addEventListener("submit", guardarPendiente);

obtenerListado();
