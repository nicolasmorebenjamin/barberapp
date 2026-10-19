# Dark Level Barbería

Sitio estático para GitHub Pages con el logo oficial de Dark Level y un formulario de solicitudes de turno preparado para Google Apps Script y Google Sheets.

## Configurar los avisos de turnos

1. Creá un proyecto en [Google Apps Script](https://script.google.com/) y copiá `apps-script/Code.gs` en el archivo `Code.gs`.
2. Ejecutá `initialize()` una vez y autorizá Google Sheets y el envío de correo. En el registro de ejecución aparecerá el enlace a la planilla privada.
3. En la hoja `Barberos`, cargá una fila por profesional: nombre, correo de aviso y `TRUE` en Activo.
4. En la hoja `Servicios`, cargá cada servicio, duración estimada en minutos y `TRUE` en Activo.
5. En **Project Settings → Script properties**, agregá `NOTIFICATION_EMAIL` con el correo general para solicitudes marcadas como “Sin preferencia”.
6. En **Deploy → New deployment → Web app**, elegí **Execute as: Me** y acceso **Anyone**. Copiá la URL terminada en `/exec`.
7. En `index.html`, reemplazá `PEGAR_URL_DE_APPS_SCRIPT` por esa URL y subí el cambio a GitHub. El formulario carga la lista de barberos y servicios al abrirse.

Cuando el cliente elige un barbero, el aviso llega al correo de esa persona. “Sin preferencia” llega al correo general. La planilla se mantiene privada. El endpoint valida los campos, limita a tres solicitudes diarias por teléfono, evita duplicados simultáneos y bloquea superposiciones para el mismo barbero usando la duración configurada del servicio.

Las solicitudes quedan **pendientes de confirmación**. El perfil no publica horarios exactos, así que el sistema todavía no puede ofrecer espacios libres ni confirmar automáticamente que el local esté abierto. El barbero recibe la solicitud y confirma el horario con el cliente. Los datos de contacto de cada profesional quedan solo en la planilla.

## Lo que falta para activarlo

La conexión aún requiere que el dueño cree y autorice el proyecto de Apps Script, cargue el equipo y los servicios reales, elija el correo de avisos y pegue la URL `/exec` en `index.html`. El formulario permanece deshabilitado hasta que se agregue esa URL. GitHub Pages no puede desplegar Apps Script ni autorizarlo en una cuenta de Google.

El web app debe ser accesible públicamente para recibir solicitudes desde la página. Google Apps Script aplica sus propias cuotas; la planilla no debe compartirse públicamente.
