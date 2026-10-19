const TIME_ZONE = 'America/Argentina/Buenos_Aires';
const REQUESTS_SHEET = 'Solicitudes';
const BARBERS_SHEET = 'Barberos';
const SERVICES_SHEET = 'Servicios';
const REQUEST_HEADERS = ['ID', 'Creado', 'Fecha solicitada', 'Hora solicitada', 'Cliente', 'Teléfono', 'Barbero preferido', 'Servicio', 'Notas', 'Estado', 'Aviso al barbero'];
const BARBER_HEADERS = ['Nombre', 'Email de aviso', 'Activo'];
const SERVICE_HEADERS = ['Nombre', 'Duración (min)', 'Activo'];

/** Run once from the Apps Script editor. Creates/reuses a private spreadsheet without erasing rows. */
function initialize() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  const spreadsheet = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create('Dark Level - Turnos');
  props.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  ensureHeaders_(spreadsheet, REQUESTS_SHEET, REQUEST_HEADERS);
  ensureHeaders_(spreadsheet, BARBERS_SHEET, BARBER_HEADERS);
  ensureHeaders_(spreadsheet, SERVICES_SHEET, SERVICE_HEADERS);
  MailApp.getRemainingDailyQuota(); // Request mail authorization before the public web-app deployment.

  Logger.log('Planilla privada: ' + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function ensureHeaders_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, headers.length);
    return;
  }
  const lastColumn = sheet.getLastColumn();
  const existing = sheet.getRange(1, 1, 1, Math.max(1, lastColumn)).getDisplayValues()[0];
  for (let i = 0; i < Math.min(existing.length, headers.length); i++) {
    if (existing[i] && existing[i] !== headers[i]) {
      throw new Error('La hoja ' + name + ' tiene encabezados distintos. No se modificó ningún dato.');
    }
  }
  const missing = headers.slice(existing.length);
  if (missing.length) sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
  sheet.setFrozenRows(1);
}

/** Public, read-only JSONP endpoint. It exposes names and durations, never staff email addresses. */
function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return HtmlService.createHtmlOutput('Dark Level: endpoint de turnos activo.');
  }
  let config;
  try {
    config = { ok: true, barbers: activeRows_(BARBERS_SHEET, BARBER_HEADERS).map(function (r) { return { name: r.name }; }),
      services: activeRows_(SERVICES_SHEET, SERVICE_HEADERS).map(function (r) { return { name: r.name, duration: r.duration }; }) };
  } catch (err) {
    config = { ok: false, message: 'La agenda todavía no está configurada.' };
  }
  const json = JSON.stringify(config).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  let requestId = '';
  try {
    const p = (e && e.parameter) || {};
    requestId = String(p.requestId || '');
    if (!/^[A-Za-z0-9-]{20,80}$/.test(requestId)) throw new Error('No pudimos validar la solicitud. Actualizá la página e intentá de nuevo.');
    if (String(p.website || '').trim()) return response_(requestId, true, 'Solicitud recibida. El barbero debe confirmar el horario.');

    const props = PropertiesService.getScriptProperties();
    const spreadsheetId = props.getProperty('SPREADSHEET_ID');
    const fallbackEmail = props.getProperty('NOTIFICATION_EMAIL');
    if (!spreadsheetId) throw new Error('El sistema de turnos todavía no está configurado.');
    const values = validate_(p);
    const staff = activeRows_(BARBERS_SHEET, BARBER_HEADERS);
    const services = activeRows_(SERVICES_SHEET, SERVICE_HEADERS);
    const selectedService = services.find(function (s) { return s.name === values.service; });
    if (!selectedService) throw new Error('Elegí un servicio disponible.');
    let recipient = fallbackEmail;
    if (values.barber) {
      const selectedBarber = staff.find(function (b) { return b.name === values.barber; });
      if (!selectedBarber) throw new Error('Elegí un barbero disponible.');
      recipient = selectedBarber.email;
    }
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      throw new Error(values.barber ? 'Ese barbero todavía no tiene un correo de aviso configurado.' : 'Todavía no se configuró el correo general de avisos.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let sheet;
    let row;
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      sheet = spreadsheet.getSheetByName(REQUESTS_SHEET);
      if (!sheet) throw new Error('No se encontró la hoja de solicitudes. Ejecutá initialize().');
      const lastRow = sheet.getLastRow();
      const startRow = Math.max(2, lastRow - 499);
      if (lastRow >= 2) {
        const recent = sheet.getRange(startRow, 1, lastRow - startRow + 1, REQUEST_HEADERS.length).getDisplayValues();
        const phone = values.phone.replace(/\D/g, '');
        const todayKey = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd');
        let requestsToday = 0;
        for (let i = 0; i < recent.length; i++) {
          const old = recent[i];
          if (old[1].indexOf(todayKey) === 0 && old[5].replace(/\D/g, '') === phone) requestsToday++;
          if (old[0] === requestId) throw new Error('Esta solicitud ya fue enviada. Esperá la respuesta del barbero.');
          const sameBarber = old[6] === (values.barber || 'Sin preferencia');
          if (old[2] === values.date && old[3] === values.time && old[5].replace(/\D/g, '') === phone && sameBarber && old[9] !== 'CANCELADA') {
            throw new Error('Ya recibimos una solicitud tuya para ese horario.');
          }
          if (values.barber && sameBarber && old[2] === values.date && old[9] !== 'CANCELADA' && old[9] !== 'RECHAZADA') {
            const oldService = services.find(function (service) { return service.name === old[7]; });
            const oldDuration = oldService ? oldService.duration : 30;
            if (overlaps_(values.time, selectedService.duration, old[3], oldDuration)) {
              throw new Error('Ese barbero ya tiene una solicitud en ese horario. Elegí otra hora.');
            }
          }
        }
        if (requestsToday >= 3) throw new Error('Ese teléfono ya envió el máximo de solicitudes de hoy. Intentá mañana.');
      }
      const createdAt = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
      row = sheet.getLastRow() + 1;
      const rowValues = [requestId, createdAt, values.date, values.time, values.name, values.phone,
        values.barber || 'Sin preferencia', values.service, values.notes, 'PENDIENTE_CONFIRMACION', 'PENDIENTE'];
      sheet.getRange(row, 1, 1, REQUEST_HEADERS.length).setNumberFormat('@');
      sheet.getRange(row, 1, 1, REQUEST_HEADERS.length).setValues([rowValues.map(textCell_)]);
    } finally {
      lock.releaseLock();
    }

    const body = [
      'Entró una solicitud de turno para Dark Level.', '',
      'Estado: PENDIENTE DE CONFIRMACIÓN', 'Fecha solicitada: ' + values.date, 'Hora solicitada: ' + values.time,
      'Cliente: ' + values.name, 'Teléfono: ' + values.phone, 'Barbero preferido: ' + (values.barber || 'Sin preferencia'),
      'Servicio: ' + values.service, 'Duración estimada: ' + selectedService.duration + ' min',
      'Notas: ' + (values.notes || 'Sin notas'), '',
      'El horario todavía no está confirmado. Contactá al cliente para verificar disponibilidad.'
    ].join('\n');
    try {
      MailApp.sendEmail(recipient, 'Nuevo turno solicitado - Dark Level - ' + values.date + ' ' + values.time, body);
      sheet.getRange(row, 11).setValue('ENVIADO');
      return response_(requestId, true, 'Solicitud enviada. El barbero recibió el aviso; el horario queda pendiente de confirmación.');
    } catch (mailError) {
      sheet.getRange(row, 11).setValue('FALLO');
      return response_(requestId, true, 'La solicitud quedó guardada, pero falló el aviso automático. El turno no está confirmado; no la envíes otra vez.');
    }
  } catch (err) {
    return response_(requestId, false, safeMessage_(err));
  }
}

function activeRows_(sheetName, headers) {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('No está inicializada la planilla.');
  const sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const data = sheet.getDataRange().getDisplayValues();
  const header = data.shift();
  const index = {};
  header.forEach(function (key, i) { index[key] = i; });
  headers.forEach(function (key) { if (index[key] === undefined) throw new Error('Falta un encabezado requerido.'); });
  return data.filter(function (r) { return isActive_(r[index.Activo]); }).map(function (r) {
    if (sheetName === BARBERS_SHEET) return { name: clean_(r[index.Nombre], 80, 'barbero'), email: String(r[index['Email de aviso']] || '').trim() };
    const duration = Number(r[index['Duración (min)']]);

    if (!Number.isFinite(duration) || duration < 5 || duration > 480) throw new Error('Configurá una duración válida para cada servicio.');

    return { name: clean_(r[index.Nombre], 100, 'servicio'), duration: duration };
  });
}

function isActive_(value) {
  return ['TRUE', 'SI', 'SÍ', '1', 'ACTIVO', 'YES'].indexOf(String(value || '').trim().toUpperCase()) >= 0;
}

function overlaps_(timeA, durationA, timeB, durationB) {
  const startA = minutes_(timeA);
  const startB = minutes_(timeB);
  return startA < startB + durationB && startB < startA + durationA;
}

function minutes_(time) {
  const parts = String(time).split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}
function validate_(p) {
  const name = clean_(p.name, 80, 'nombre');
  const phone = clean_(p.phone, 24, 'teléfono');
  const barber = String(p.barber || '').trim();
  const service = clean_(p.service, 100, 'servicio');
  const notes = cleanOptional_(p.notes, 500, 'notas');
  const date = String(p.date || '').trim();
  const time = String(p.time || '').trim();
  if (!/^[0-9+()\s.-]{7,24}$/.test(phone)) throw new Error('Revisá el teléfono e incluí un número válido.');
  if (barber && (barber.length > 80 || /[<>\u0000-\u001F]/.test(barber))) throw new Error('Revisá el barbero elegido.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Elegí una fecha y hora válidas.');
  const requested = Utilities.parseDate(date + ' ' + time, TIME_ZONE, 'yyyy-MM-dd HH:mm');
  if (Utilities.formatDate(requested, TIME_ZONE, 'yyyy-MM-dd HH:mm') !== date + ' ' + time) throw new Error('La fecha u hora no existe.');
  if (requested.getTime() <= Date.now()) throw new Error('Elegí un horario futuro.');
  if (String(p.consent || '') !== 'yes') throw new Error('Autorizá el uso de tus datos para coordinar el turno.');
  return { name: name, phone: phone, barber: barber, service: service, notes: notes, date: date, time: time };
}

function clean_(value, max, label) {
  const result = String(value || '').replace(/[<>\u0000-\u001F]/g, ' ').replace(/\s+/g, ' ').trim();
  if (result.length < 2 || result.length > max) throw new Error('Revisá el campo ' + label + '.');
  return result;
}

function cleanOptional_(value, max, label) {
  const result = String(value || '').replace(/[<>\u0000-\u001F]/g, ' ').replace(/\s+/g, ' ').trim();
  if (result.length > max) throw new Error('El campo ' + label + ' es demasiado largo.');
  return result;
}

function textCell_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+@-]/.test(text) ? "'" + text : text;
}

function response_(requestId, ok, message) {
  const payload = JSON.stringify({ type: 'dark-level-booking', requestId: requestId, ok: ok, message: message })
    .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body><script>' +
    'window.parent.postMessage(' + payload + ', "*");' + '</script></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function safeMessage_(err) {
  const message = String(err && err.message ? err.message : 'No pudimos registrar la solicitud.');
  return message.length > 220 ? 'No pudimos registrar la solicitud. Intentá nuevamente más tarde.' : message;
}




