/* LUMA · datos de demostración para la pantalla publicada.
   La pantalla de «pantalla y servicio» llama a su backend; en la demo no hay
   backend desplegado, así que este script responde a esas llamadas con datos
   realistas generados a partir de la forma exacta que espera cada respuesta
   (extraída del código del frontend). No sale nada a la red. */
(function () {
  "use strict";
  var DEMO = {"clave":"Transacción|Cuentas|Full Stack|React + TypeScript|Java + Spring Boot|PostgreSQL","slug":"transaccion-cuentas-fullstack-react-springboot","rutas":[{"m":"GET","ruta":"/accounts","esquema":{"t":"array","de":{"t":"obj","nombre":"Account","campos":{"id":{"t":"number"},"number":{"t":"string"},"currency":{"t":"string"},"balance":{"t":"string"}}}}},{"m":"GET","ruta":"/api/v1/accounts","esquema":{"t":"array","de":{"t":"obj","nombre":"Account","campos":{"id":{"t":"number"},"number":{"t":"string"},"currency":{"t":"string"},"balance":{"t":"string"}}}}},{"m":"POST","ruta":"/transfers","esquema":{"t":"obj","nombre":"TransferReceipt","campos":{"id":{"t":"number"},"sourceAccountId":{"t":"number"},"targetAccountId":{"t":"number"},"amount":{"t":"string"},"currency":{"t":"string"},"status":{"t":"string"},"createdAt":{"t":"string"}}}},{"m":"POST","ruta":"/api/v1/transfers","esquema":{"t":"obj","nombre":"TransferReceipt","campos":{"id":{"t":"number"},"sourceAccountId":{"t":"number"},"targetAccountId":{"t":"number"},"amount":{"t":"string"},"currency":{"t":"string"},"status":{"t":"string"},"createdAt":{"t":"string"}}}}]};
  var NOMBRES = ["María Torres", "Carlos Quispe", "Lucía Fernández", "Jorge Ramírez", "Ana Vargas", "Diego Salazar"];
  var CONCEPTOS = ["Pago de servicios", "Transferencia a ahorros", "Compra en supermercado", "Abono de sueldo", "Pago de tarjeta", "Recarga de celular"];
  var ALIAS = ["Cuenta Sueldo", "Ahorro Vacaciones", "Cuenta Corriente", "Ahorro Meta", "Cuenta Dólares", "Fondo Emergencias"];
  var MENSAJES = ["Se registró un abono en tu cuenta.", "Tu pago se procesó correctamente.", "Compra aprobada con tu tarjeta.",
                  "Tu estado de cuenta ya está disponible.", "Se realizó una transferencia desde tu cuenta.", "Recordatorio: tu pago vence pronto."];
  var COMERCIOS = ["Supermercados Plaza", "Farmacia Salud", "Grifo Central", "Cine Estrella", "Restaurante El Puerto", "Librería Andina"];

  function norm(s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
  function dosDec(n) { return Math.round(n * 100) / 100; }
  function fecha(i, conHora) {
    var d = new Date(Date.UTC(2026, 9, 16 - (i % 20), 9 + (i * 3) % 10, (i * 17) % 60));
    return conHora ? d.toISOString() : d.toISOString().slice(0, 10);
  }
  function deEnum(v, i) { return v && v.length ? v[i % v.length] : null; }

  function cadena(nombre, i, sch) {
    var n = norm(nombre);
    if (sch.fmt === "date" || /fecha|date|vencim|expir|creado|created|updated|actualiz|timestamp|hora|desde|hasta|^at$|at$/.test(n))
      return fecha(i, /hora|time|at$|creado|created|updated|actualiz/.test(n) && !/^fecha$|vencim|expir/.test(n));
    if (/moneda|currency/.test(n)) return i % 4 === 3 ? "USD" : "PEN";
    if (/correo|email/.test(n)) return ["maria.torres", "carlos.quispe", "lucia.fernandez", "jorge.ramirez"][i % 4] + "@correo.pe";
    if (/telef|phone|celular|movil/.test(n)) return "9" + String(87654321 + i * 1111).slice(0, 8);
    if (/cci/.test(n)) return "00219100" + String(1234567890 + i * 7).padStart(10, "0") + "53";
    if (/tarjeta|card|\bpan\b|^pan/.test(n) && /num|pan|mask|enmasc/.test(n)) return "**** **** **** " + String(4417 + i * 113).slice(-4);
    if (/mask|enmasc|oculto/.test(n)) return "191-*****" + String(78 + i * 11).slice(-2) + "-0-" + String(12 + i).slice(-2);   // cuenta enmascarada
    if (/ultimos|last4|ultimosdigitos/.test(n)) return String(4417 + i * 113).slice(-4);
    if (/(num|number|nro).*(cuenta|account)|(cuenta|account).*(num|number)|^numero$|^number$/.test(n)) return "191-" + String(2345678 + i * 9137).slice(0, 7) + "-0-" + String(12 + i).slice(-2);
    if (/^id$|id$|uuid|codigo|code$|referencia|reference|operacion|operation|transaccion|transaction/.test(n)) {
      var pref = /tarjeta|card/.test(n) ? "TJ" : /cuenta|account/.test(n) ? "CT" : /pago|payment/.test(n) ? "PG" : /notif/.test(n) ? "NT" : /transf/.test(n) ? "TR" : /oper|ref|trans/.test(n) ? "OP" : "ID";
      return pref + "-" + String(100100 + i * 37);
    }
    if (/titular|holder|nombre|name|cliente|customer|beneficiar|destinatario|remitente|usuario|user/.test(n)) return NOMBRES[i % NOMBRES.length];
    if (/alias|apodo|producto|product/.test(n)) return ALIAS[i % ALIAS.length];
    if (/comercio|merchant|establec/.test(n)) return COMERCIOS[i % COMERCIOS.length];
    if (/mensaje|message|cuerpo|body|texto|contenido/.test(n)) return MENSAJES[i % MENSAJES.length];
    if (/titulo|title|asunto|subject/.test(n)) return ["Abono recibido", "Pago confirmado", "Compra aprobada", "Estado de cuenta", "Transferencia enviada", "Recordatorio"][i % 6];
    if (/descrip|concepto|glosa|detalle|motivo|nota|comentario/.test(n)) return CONCEPTOS[i % CONCEPTOS.length];
    if (/estado|status|situacion/.test(n)) return ["ACTIVA", "COMPLETADA", "PENDIENTE", "ACTIVA"][i % 4];
    if (/tipo|type|categoria|category|clase/.test(n)) return ["AHORROS", "CORRIENTE", "AHORROS", "PLAZO"][i % 4];
    if (/canal|channel/.test(n)) return ["EMAIL", "SMS", "PUSH"][i % 3];
    if (/banco|bank|entidad/.test(n)) return "Banco Demo";
    if (/marca|brand|red|network/.test(n)) return ["VISA", "MASTERCARD"][i % 2];
    if (/servicio|service|empresa|company|proveedor/.test(n)) return ["Luz del Sur", "Sedapal", "Movistar", "Claro"][i % 4];
    if (/url|link|enlace/.test(n)) return "#";
    if (/token|clave|password|secret/.test(n)) return "demo";
    return CONCEPTOS[(i + hash(nombre)) % CONCEPTOS.length];
  }
  function numero(nombre, i) {
    var n = norm(nombre);
    if (/totalelements|totalitems|totalregistros|totalelementos|^total$|^count$|cantidad|totalcount|unread|noleid/.test(n)) return 4;
    if (/totalpages|totalpaginas/.test(n)) return 1;
    if (/^page$|^pagina$|^number$|pagenumber|offset/.test(n)) return 0;
    if (/size|tamano|limit$|pagesize|perpage/.test(n)) return 20;
    if (/limite|limit|credito|credit/.test(n)) return 15000 + i * 2500;
    if (/minimo|minimum/.test(n)) return dosDec(150 + i * 35.5);
    if (/saldo|balance|disponible|available|deuda|debt/.test(n)) return dosDec(4820.75 + i * 3157.4);
    if (/monto|amount|importe|valor|total|precio|price|comision|fee/.test(n)) return dosDec(120.5 + i * 87.25);
    if (/tasa|rate|interes|tea|tcea/.test(n)) return dosDec(1.5 + i * 0.75);
    if (/^id$|id$/.test(n)) return 1001 + i;
    if (/dia|day|plazo|cuota/.test(n)) return 5 + i;
    return 1 + i;
  }
  function booleano(nombre, i) { var n = norm(nombre); if (/leid|read|visto/.test(n)) return i % 2 === 1; if (/bloque|block|vencid|expired|error/.test(n)) return false; return true; }

  function generar(sch, nombre, i, prof, ids) {
    if (!sch || prof > 6) return null;
    switch (sch.t) {
      case "string": return cadena(nombre, i, sch);
      case "number": return numero(nombre, i);
      case "boolean": return booleano(nombre, i);
      case "lit": return sch.v;
      case "enum": return deEnum(sch.v, i);
      case "null": return null;
      case "array": { var arr = []; for (var k = 0; k < 4; k++) arr.push(generar(sch.de, nombre, k, prof + 1, ids)); return arr; }
      case "obj": {
        var o = {};
        for (var campo in sch.campos) {
          var c = sch.campos[campo];
          if (c.opc && c.t === "null") continue;
          o[campo] = generar(c, campo, i, prof + 1, ids);
        }
        if (prof === 0 && ids && ids.length) {   // el detalle de un recurso conserva el id pedido en la URL
          for (var cc in o) if (/^id$|id$/i.test(cc) && typeof o[cc] === "string") { o[cc] = decodeURIComponent(ids[ids.length - 1]); break; }
        }
        return o;
      }
      default: return null;
    }
  }

  // ── Rutas: el final literal de cada ruta, con {} como tramo variable ─────
  function patron(ruta) {
    var r = String(ruta).replace(/^https?:\/\/[^/]+/, "").split("?")[0].replace(/^(\{\})+/, "");
    var finalLibre = /[^/]\{\}$/.test(r);              // «/accounts{}»: lo de después es opcional (consulta)
    r = r.replace(/\{\}$/, finalLibre ? "" : "{}");
    var partes = r.split("{}");
    var lit = partes.join("").length;
    var re = partes.map(function (p) { return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("[^/?#]+");
    return { re: new RegExp(re + (finalLibre ? "(?:/[^?#]*)?" : "") + "$"), lit: lit };
  }
  var RUTAS = DEMO.rutas.map(function (r) { var p = patron(r.ruta); return { m: r.m, re: p.re, lit: p.lit, esquema: r.esquema, ruta: r.ruta }; });

  function buscar(metodo, url) {
    var u; try { u = new URL(url, location.href); } catch (e) { return null; }
    if (!/\/api(\/|$)/.test(u.pathname) && u.origin === location.origin && !RUTAS.some(function (r) { return r.lit > 1 && r.re.test(u.pathname); })) return null;
    var mejor = null;
    RUTAS.forEach(function (r) {
      if (r.m !== metodo && !(r.m === "FETCH" && metodo === "GET")) return;
      if (!r.re.test(u.pathname)) return;
      if (!mejor || r.lit > mejor.lit) mejor = r;
    });
    if (!mejor && /\/api(\/|$)/.test(u.pathname)) mejor = { esquema: null };   // API sin ruta conocida: respuesta vacía, sin error
    return mejor ? { ruta: mejor, ids: u.pathname.split("/").filter(function (x) { return /\d/.test(x); }) } : null;
  }

  function responder(metodo, url, cuerpo) {
    var hit = buscar(metodo, url); if (!hit) return null;
    if (metodo === "DELETE") return { status: 204, body: "" };
    var datos = hit.ruta.esquema ? generar(hit.ruta.esquema, "", hash(url) % 3, 0, metodo === "GET" ? hit.ids : null) : (metodo === "GET" ? [] : {});
    // Operaciones (POST/PUT/PATCH): la respuesta refleja lo enviado y queda «hecha»,
    // siempre dentro de los valores que admite la pantalla (su esquema).
    var sch = hit.ruta.esquema;
    if (metodo !== "GET" && datos && typeof datos === "object" && !Array.isArray(datos) && sch && sch.t === "obj") {
      var b = null; try { b = typeof cuerpo === "string" ? JSON.parse(cuerpo) : cuerpo; } catch (e) {}
      for (var k in datos) {
        var c = sch.campos[k] || {};
        if (b && b[k] != null && typeof b[k] !== "object" && ((c.t === "number" && typeof b[k] === "number") || (c.t === "string" && typeof b[k] === "string"))) datos[k] = b[k];
        if (c.t === "enum" && /estado|status|situacion/i.test(k)) {
          var hecho = (c.v || []).filter(function (v) { return /complet|aprob|approv|exito|success|paid|pagad|procesad|process|done|ok|confirm|read|leid|enviad|sent|realiz/i.test(String(v)) && !/un.?read|no.?leid|pend|fail|rech|reject|error|cancel/i.test(String(v)); })[0];
          if (hecho !== undefined) datos[k] = hecho;
        } else if (c.t === "string" && /estado|status|situacion/i.test(k)) datos[k] = "COMPLETADA";
        if (c.t === "boolean" && /leid|read|visto/i.test(k)) datos[k] = true;
      }
    }
    return { status: metodo === "POST" ? 201 : 200, body: JSON.stringify(datos) };
  }

  // ── fetch ──────────────────────────────────────────────────────────────
  var fetchReal = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (entrada, init) {
    var url = typeof entrada === "string" ? entrada : (entrada && entrada.url) || String(entrada);
    var metodo = ((init && init.method) || (entrada && entrada.method) || "GET").toUpperCase();
    var r = responder(metodo, url, init && init.body);
    if (!r) return fetchReal(entrada, init);
    return new Promise(function (ok) { setTimeout(function () { ok(new Response(r.status === 204 ? null : r.body, { status: r.status, headers: { "Content-Type": "application/json" } })); }, 250); });
  };

  // ── XMLHttpRequest (Angular HttpClient) ───────────────────────────────
  var XHRReal = window.XMLHttpRequest;
  function XHRDemo() {
    var real = new XHRReal(), self = this, simulada = null, oyentes = {};
    this._real = real; this.readyState = 0; this.status = 0; this.statusText = ""; this.response = ""; this.responseText = ""; this.responseURL = "";
    this.responseType = ""; this.timeout = 0; this.withCredentials = false; this.upload = real.upload;
    ["onreadystatechange", "onload", "onerror", "onloadend", "onloadstart", "onabort", "ontimeout", "onprogress"].forEach(function (h) { self[h] = null; });
    function emitir(tipo) {
      var ev = { type: tipo, target: self, currentTarget: self, lengthComputable: false, loaded: 0, total: 0 };
      if (typeof self["on" + tipo] === "function") self["on" + tipo](ev);
      (oyentes[tipo] || []).forEach(function (f) { f.call(self, ev); });
    }
    function copiar() { ["readyState", "status", "statusText", "response", "responseText", "responseURL"].forEach(function (k) { try { self[k] = real[k]; } catch (e) {} }); }
    ["readystatechange", "load", "error", "loadend", "loadstart", "abort", "timeout", "progress"].forEach(function (t) {
      real.addEventListener(t, function () { if (!simulada) { copiar(); emitir(t); } });
    });
    this.addEventListener = function (t, f) { (oyentes[t] = oyentes[t] || []).push(f); };
    this.removeEventListener = function (t, f) { oyentes[t] = (oyentes[t] || []).filter(function (x) { return x !== f; }); };
    this.open = function (m, url) { this._m = String(m).toUpperCase(); this._url = url; this._args = arguments; simulada = null; return real.open.apply(real, arguments); };
    this.setRequestHeader = function () { if (!simulada) try { real.setRequestHeader.apply(real, arguments); } catch (e) {} };
    this.getAllResponseHeaders = function () { return simulada ? "content-type: application/json\r\n" : real.getAllResponseHeaders(); };
    this.getResponseHeader = function (h) { return simulada ? (/content-type/i.test(h) ? "application/json" : null) : real.getResponseHeader(h); };
    this.overrideMimeType = function () { try { real.overrideMimeType.apply(real, arguments); } catch (e) {} };
    this.abort = function () { if (!simulada) real.abort(); };
    this.send = function (cuerpo) {
      var r = responder(this._m, this._url, cuerpo);
      if (!r) { real.responseType = this.responseType; real.timeout = this.timeout; real.withCredentials = this.withCredentials; return real.send(cuerpo); }
      simulada = r;
      setTimeout(function () {
        self.readyState = 4; self.status = r.status; self.statusText = r.status === 201 ? "Created" : "OK"; self.responseURL = String(self._url);
        self.responseText = r.body;
        self.response = self.responseType === "json" ? (r.body ? JSON.parse(r.body) : null) : r.body;
        emitir("loadstart"); emitir("readystatechange"); emitir("load"); emitir("loadend");
      }, 250);
    };
  }
  window.XMLHttpRequest = XHRDemo;
  window.__LUMA_DEMO_API__ = { rutas: RUTAS.length, clave: DEMO.clave };
})();
