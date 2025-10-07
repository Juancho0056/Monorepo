# Guia para iniciar el proyecto uno con Docker Compose

1. Asegúrate de tener instalado Docker y el complemento Docker Compose en tu equipo.
2. Abre una terminal y posicionate en la carpeta `proyecto_uno` de este repositorio.
3. Ejecuta el siguiente comando para construir la imagen y levantar el servicio directamente:

   ```
   docker compose -f docker-compose-construir.yml up --build
   ```

   Este archivo de composición toma el contexto actual, crea la imagen y publica la aplicación en el puerto 8081.

4. Si ya cuentas con una imagen creada mediante el archivo `Dockerfile`, puedes iniciar el contenedor reutilizándola con:

   ```
   docker compose -f docker-compose-imagen.yml up
   ```

5. Cuando desees detener los contenedores, presiona `Ctrl + C` en la terminal o ejecuta:

   ```
   docker compose -f docker-compose-construir.yml down
   ```

   o, si usaste el archivo de imagen previa:

   ```
   docker compose -f docker-compose-imagen.yml down
   ```

Estos pasos muestran cómo iniciar y detener el proyecto uno utilizando Docker Compose según el archivo que prefieras emplear.
