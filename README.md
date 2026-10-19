# Dark Level Barbería

Sitio estático para GitHub Pages con el logo oficial de Dark Level y un formulario de solicitudes de turno preparado para Google Apps Script y Google Sheets.

## Configurar los avisos de turnos

1. Creá un proyecto en [Google Apps Script](https://script.google.com/) y copiá `apps-script/Code.gs` en el archivo `Code.gs`.
2. Ejecutá `initialize()` una vez y autorizá Google Sheets y el envío de correo. En el registro de ejecución aparecerá el enlace a la planilla privada.
3. En la hoja `Barberos`, cargá una fila por profesional: nombre, correo de aviso y `TRUE` en Activo.
4. En la hoja `Servicios`, cargá cada servicio, duración estimada en minutos y `TRUE` en Activo.
5. En **Project Settings → Script properties**, agregá `NOTIFICATION_EMAIL` con el correo general para solicitudes marcadas como “Sin preferencia”.
6. En **Deploy → New deployment → Web app**, elegí **Execute as: Me** y acceso **Anyone**. Copiá la URL terminada en `/exec`.
7. La aplicación web ya está desplegada para ejecutarse como el propietario y recibir solicitudes de cualquiera. La URL `/exec` ya está configurada en `index.html` y el cambio se subió a GitHub. El formulario carga la lista de barberos y servicios al abrirse.

Cuando el cliente elige un barbero, el aviso llega al correo de esa persona. “Sin preferencia” llega al correo general. La planilla se mantiene privada. El endpoint valida los campos, limita a tres solicitudes diarias por teléfono, evita duplicados simultáneos y bloquea superposiciones para el mismo barbero usando la duración configurada del servicio.

Las solicitudes quedan **pendientes de confirmación**. El perfil no publica horarios exactos, así que el sistema todavía no puede ofrecer espacios libres ni confirmar automáticamente que el local esté abierto. El barbero recibe la solicitud y confirma el horario con el cliente. Los datos de contacto de cada profesional quedan solo en la planilla.

## Lo que falta para activarlo

La conexión con Apps Script ya está hecha. Para recibir solicitudes, todavía hay que cargar en la planilla los barberos con sus correos de aviso y los servicios con sus duraciones, y agregar `NOTIFICATION_EMAIL` en las propiedades del proyecto. El formulario permanece deshabilitado mientras no haya servicios activos. GitHub Pages no puede desplegar Apps Script ni autorizarlo en una cuenta de Google.

El web app debe ser accesible públicamente para recibir solicitudes desde la página. Google Apps Script aplica sus propias cuotas; la planilla no debe compartirse públicamente.
