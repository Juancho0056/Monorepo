# Reporte final de aprendizaje

## 1. Consumo de APIs

### Diferencia entre endpoint y recurso
Un **recurso** representa la entidad que se gestiona en la API, en este caso los pendientes. Los **endpoints** son las rutas específicas para interactuar con ese recurso, por ejemplo `/Todos` para obtener la lista y `/Todos/{id}` para operar sobre un registro puntual. Cada proyecto permite capturar pantallazos del listado general y de la consulta individual para ilustrar ambas ideas.

### Manejo de JSON en el frontend
El código JavaScript transforma las respuestas JSON recibidas en objetos para mostrarlos dentro del DOM. Al momento de guardar información se envían cuerpos JSON con los datos del formulario. Se recomienda capturar pantallazos del formulario, de la consola y de la vista de detalle mientras se realizan peticiones exitosas.

### Importancia de las APIs para la integración de sistemas
Las APIs permiten que distintas aplicaciones compartan datos y funcionalidades sin importar la tecnología utilizada. Gracias a ello los tres proyectos web pueden comunicarse con el backend remoto y mantenerse sincronizados. Al documentar, añadir pantallazos del funcionamiento de cada vista enfatiza esta integración.

## 2. Estilos y diseño web

### CSS puro
En el proyecto uno se emplean hojas de estilo propias con selectores, variables y reglas `@media` para lograr un diseño adaptable. Es ideal registrar pantallazos del mismo diseño en escritorio y en pantallas pequeñas.

### Bootstrap
El proyecto dos utiliza el sistema de grillas y componentes listos de Bootstrap, lo que agiliza la creación de interfaces coherentes. Los pantallazos deben resaltar el uso de tarjetas, tablas responsivas y las utilidades de la biblioteca.

### Tailwind CSS
El proyecto tres aplica clases utilitarias de Tailwind para componer rápidamente la interfaz y ajustar colores personalizados. Capturar pantallazos que muestren la paleta definida y la disposición adaptativa ayudará al análisis.

### Reflexión comparativa
* **CSS puro** otorga máximo control pero requiere definir cada detalle manualmente.
* **Bootstrap** ofrece componentes listos, acelerando el desarrollo a cambio de estilos más reconocibles.
* **Tailwind** combina rapidez con personalización granular gracias a clases utilitarias.

Para completar la actividad, guardar pantallazos de cada interfaz evidenciando los aspectos mencionados.

## 3. Programación en JavaScript

### Manipulación del DOM
Los tres proyectos crean filas de tabla, actualizan secciones de detalle y llenan formularios a partir de los datos de la API. Estos procesos pueden documentarse con capturas que muestren los cambios en pantalla tras cada acción.

### Uso de la API fetch
Se emplea `fetch` con `async/await` para realizar todas las operaciones CRUD. Es recomendable capturar la pestaña de redes del navegador mostrando las peticiones.

### Manejo de promesas y `async/await`
Cada función asíncrona espera la respuesta del servidor y maneja errores mediante mensajes amigables. Las capturas pueden enfocarse en la interacción paso a paso.

### Validaciones en el cliente
Antes de enviar datos se verifican campos obligatorios y se confirma la eliminación, ayudando a evitar acciones accidentales. Registrar pantallazos de los mensajes emergentes completa la evidencia requerida.
