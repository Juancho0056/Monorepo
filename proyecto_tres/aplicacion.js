const urlBase = "https://todoapitest.juansegaliz.com";

const formulario = document.getElementById("formulario");
const campoId = document.getElementById("campo-id");
const campoTitulo = document.getElementById("campo-titulo");
const campoDescripcion = document.getElementById("campo-descripcion");
const campoPrioridad = document.getElementById("campo-prioridad");
const campoFecha = document.getElementById("campo-fecha");
const campoEstado = document.getElementById("campo-estado");
const campoBusqueda = document.getElementById("campo-busqueda");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const areaDetalle = document.getElementById("detalle");
const botonBuscar = document.getElementById("boton-buscar");
const botonLimpiar = document.getElementById("boton-limpiar");
const botonEliminar = document.getElementById("boton-eliminar");

async function recuperarListado() {
  try {
    const respuesta = await fetch(`${urlBase}/Todos`);
    const datos = await respuesta.json();
    const pendientes = datos.data || [];
    representarTabla(pendientes);
  } catch (error) {
    alert("No fue posible obtener el listado");
    console.error(error);
  }
}

function representarTabla(pendientes) {
  cuerpoTabla.innerHTML = "";
  pendientes.forEach((pendiente) => {
    const fila = document.createElement("tr");
    fila.className = "hover:bg-slate-100";
    fila.appendChild(crearCelda(pendiente.id, "Código"));
    fila.appendChild(crearCelda(pendiente.title || "Sin título", "Título"));

    const celdaEstado = crearCelda("", "Estado");
    const insignia = document.createElement("span");
    insignia.className = `px-2 py-1 rounded-full text-xs font-semibold ${pendiente.isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-700"}`;
    insignia.textContent = pendiente.isCompleted ? "Terminado" : "Pendiente";
    celdaEstado.textContent = "";
    celdaEstado.appendChild(insignia);
    fila.appendChild(celdaEstado);

    fila.appendChild(crearCelda(pendiente.priority, "Prioridad"));

    const celdaAcciones = crearCelda("", "Acciones");
    const contenedorAcciones = document.createElement("div");
    contenedorAcciones.className = "flex gap-2 flex-wrap grupo-acciones";

    const botonVer = document.createElement("button");
    botonVer.className = "px-3 py-1 border border-primario text-primario rounded-lg text-xs";
    botonVer.dataset.accion = "ver";
    botonVer.dataset.identificador = pendiente.id;
    botonVer.textContent = "Ver";

    const botonEditar = document.createElement("button");
    botonEditar.className = "px-3 py-1 border border-gray-400 text-gray-600 rounded-lg text-xs";
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
  celda.className = "px-4 py-3 text-sm";
  celda.dataset.celda = encabezado;
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

function detallarPendiente(pendiente) {
  if (!pendiente) {
    areaDetalle.innerHTML = '<p class="text-sm text-red-500">No fue posible mostrar la información solicitada.</p>';
    return;
  }
  const fechaLimite = pendiente.dueAt ? new Date(pendiente.dueAt).toLocaleString() : "Sin definir";
  const fechaCreacion = pendiente.createdAt ? new Date(pendiente.createdAt).toLocaleString() : "Sin registrar";
  const fechaActualizacion = pendiente.updatedAt ? new Date(pendiente.updatedAt).toLocaleString() : "Sin registrar";
  areaDetalle.innerHTML = `
    <dl class="grid gap-2 text-sm">
      <div>
        <dt class="font-semibold text-gray-800">Código</dt>
        <dd>${pendiente.id}</dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-800">Título</dt>
        <dd>${pendiente.title || "Sin título"}</dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-800">Descripción</dt>
        <dd>${pendiente.description || "Sin descripción"}</dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-800">Estado</dt>
        <dd>${pendiente.isCompleted ? "Terminado" : "Pendiente"}</dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-800">Prioridad</dt>
        <dd>${pendiente.priority}</dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-800">Fecha límite</dt>
        <dd>${fechaLimite}</dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-800">Creado</dt>
        <dd>${fechaCreacion}</dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-800">Actualizado</dt>
        <dd>${fechaActualizacion}</dd>
      </div>
    </dl>
  `;
}

function colocarEnFormulario(pendiente) {
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
    detallarPendiente(datos.data);
    recuperarListado();
    if (!esEdicion) {
      limpiarFormulario();
    }
    alert(esEdicion ? "Pendiente actualizado" : "Pendiente creado");
  } catch (error) {
    alert("No fue posible guardar la información");
    console.error(error);
  }
}

async function consultarPorId(identificador) {
  try {
    const respuesta = await fetch(`${urlBase}/Todos/${identificador}`);
    if (!respuesta.ok) {
      throw new Error("Sin resultado");
    }
    const datos = await respuesta.json();
    return datos.data;
  } catch (error) {
    alert("No se encontró el pendiente indicado");
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
  if (!confirm("¿Está seguro de eliminar el pendiente actual?")) {
    return;
  }
  try {
    const respuesta = await fetch(`${urlBase}/Todos/${identificador}`, { method: "DELETE" });
    if (!respuesta.ok) {
      throw new Error("Error al eliminar");
    }
    limpiarFormulario();
    areaDetalle.innerHTML = '<p class="text-sm text-gray-500">Aún no se ha seleccionado ningún pendiente.</p>';
    recuperarListado();
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
  const pendiente = await consultarPorId(identificador);
  if (!pendiente) {
    return;
  }
  detallarPendiente(pendiente);
  if (boton.dataset.accion === "editar") {
    colocarEnFormulario(pendiente);
  }
});

botonBuscar.addEventListener("click", async () => {
  const identificador = campoBusqueda.value.trim();
  if (!identificador) {
    alert("Ingrese un código para buscar");
    return;
  }
  const pendiente = await consultarPorId(identificador);
  if (pendiente) {
    detallarPendiente(pendiente);
    colocarEnFormulario(pendiente);
  }
});

botonLimpiar.addEventListener("click", () => {
  limpiarFormulario();
  campoBusqueda.value = "";
});

botonEliminar.addEventListener("click", eliminarPendiente);

formulario.addEventListener("submit", guardarPendiente);

recuperarListado();
