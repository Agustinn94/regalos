"use strict";
/* Cosas que usan todas las paginas de la tienda: precios, pedido, seña, opiniones. */
(function () {
const T = window.TIENDA || {};
const $ = id => document.getElementById(id);
const money = n => "$" + Math.round(n).toLocaleString("es-AR");
const half = n => Math.round(n / 2 / 10) * 10;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const waNum = () => (T.whatsapp || "").replace(/\D/g, "");
const waLink = msg => waNum() ? `https://wa.me/${waNum()}${msg ? "?text=" + encodeURIComponent(msg) : ""}` : null;
function toast(t) { let e = $("toast"); if (!e) { e = document.createElement("div"); e.id = "toast"; e.className = "toast"; document.body.appendChild(e); }
  e.textContent = t; e.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("on"), 2800); }
function orderId(pre) {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  return `${pre}-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}
// la foto del comprobante se achica para que el mail no pese
function prepImagen(f, nombre, max) {
  return new Promise((res, rej) => {
    if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) { if (f.size > 1.6e6) rej(new Error("pdfgrande")); else res(f); return; }
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => {
      const s = Math.min(1, (max || 1600) / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement("canvas");
      c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
      const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingQuality = "high"; g.drawImage(im, 0, 0, c.width, c.height);
      c.toBlob(b => res(new File([b], nombre || "comprobante.jpg", {type: "image/jpeg"})), "image/jpeg", 0.85);
    }; im.onerror = () => rej(new Error("img")); im.src = fr.result; };
    fr.onerror = rej; fr.readAsDataURL(f);
  });
}
function uploadLabel(input, vacio, listo) {
  input.addEventListener("change", () => {
    const f = input.files[0], lb = input.closest(".upbtn");
    lb.querySelector("span").textContent = f ? (listo || "Listo: ") + f.name : vacio;
    lb.classList.toggle("done", !!f); lb.querySelector("i").textContent = f ? "✓" : "+";
  });
}

/* ---------------------------------------------------------------- opiniones */
function stars(n) { n = Math.max(1, Math.min(5, Math.round(n || 5))); return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
function renderOpiniones(el, producto) {
  if (!el) return;
  const L = (T.opiniones || []).filter(o => !producto || !o.producto || o.producto === producto);
  if (!L.length) {
    el.innerHTML = `<div class="revEmpty">Todavía no publicamos opiniones${producto ? " de este regalo" : ""}. Si ya recibiste el tuyo, contanos qué te pareció: nos ayuda un montón.</div>`;
    return;
  }
  el.innerHTML = `<div class="revs">${L.map(o => `<div class="rev"><div class="st" aria-label="${o.estrellas || 5} de 5">${stars(o.estrellas)}</div>
    ${o.foto ? `<img src="${esc(o.foto)}" alt="Foto de ${esc(o.nombre)}" loading="lazy">` : ""}<p>${esc(o.texto)}</p><div class="who">${esc(o.nombre)}${o.producto ? " · " + esc(nombreProducto(o.producto)) : ""}</div></div>`).join("")}</div>`;
}
function nombreProducto(id) { return ({bloque: "Bloque de Recuerdos", rollo: "Llavero rollo de fotos", caja: "Cajita de regalo"})[id] || id; }
function formOpinion(el, producto) {
  if (!el) return;
  el.innerHTML = `<form class="revForm" novalidate>
    <h3 style="font-size:20px;margin-bottom:4px">Dejá tu opinión</h3>
    <p class="small" style="margin:0 0 14px">Se publica con tu nombre de pila, después de revisarla.</p>
    <div class="two"><div class="field"><label>Tu nombre</label><input name="nombre" maxlength="40" autocomplete="given-name"></div>
    <div class="field"><label>¿Qué regalo te llegó?</label><select name="producto"><option value="bloque">Bloque de Recuerdos</option><option value="rollo">Llavero rollo de fotos</option><option value="caja">Cajita de regalo</option></select></div></div>
    <div class="field"><label>¿Cuántas estrellas?</label><div class="stars">${[5, 4, 3, 2, 1].map(n => `<input type="radio" name="estrellas" id="st${n}${producto || ""}" value="${n}"${n === 5 ? " checked" : ""}><label for="st${n}${producto || ""}" title="${n}">★</label>`).join("")}</div></div>
    <div class="field"><label>Tu opinión</label><textarea name="texto" rows="3" maxlength="600" placeholder="¿Qué te pareció? ¿Cómo lo recibió la otra persona?"></textarea></div>
    <div class="field"><label>Una foto del regalo <small>(opcional)</small></label><label class="upbtn"><input type="file" name="foto" accept="image/*" class="hidden"><i>+</i><span>Subir una foto</span></label></div>
    <button class="btn primary" type="submit">Enviar mi opinión</button><div class="err"></div><div class="ok"></div></form>`;
  const f = el.querySelector("form"), fi = f.querySelector("input[name=foto]");
  if (producto) f.producto.value = producto;
  uploadLabel(fi, "Subir una foto", "Lista: ");
  f.onsubmit = async ev => {
    ev.preventDefault();
    const er = f.querySelector(".err"), ok = f.querySelector(".ok"), b = f.querySelector("button");
    er.style.display = "none";
    const nombre = f.nombre.value.trim(), texto = f.texto.value.trim();
    if (nombre.length < 2 || texto.length < 5) { er.textContent = "Escribí tu nombre y unas palabras sobre el regalo."; er.style.display = "block"; return; }
    b.disabled = true; b.innerHTML = '<span class="spin"></span>Enviando...';
    try {
      const arch = [];
      if (fi.files[0]) arch.push(["foto", await prepImagen(fi.files[0], "opinion.jpg", 1400)]);
      await window.enviarPedido({_subject: `Opinión nueva · ${nombreProducto(f.producto.value)} · ${nombre}`, pedido: "opinion-" + Date.now(),
        tipo: "OPINIÓN PARA PUBLICAR", nombre, producto: nombreProducto(f.producto.value), estrellas: f.estrellas.value, opinion: texto,
        como_publicarla: "Si te gusta, agregala en config.js dentro de opiniones (está explicado ahí mismo)."}, arch);
      f.querySelectorAll(".field,.two,button").forEach(e => e.style.display = "none");
      ok.innerHTML = "<h3>Gracias</h3><p>Recibimos tu opinión.</p>"; ok.style.display = "block";
    } catch (e) {
      er.textContent = "No se pudo enviar. Probá de nuevo en un rato."; er.style.display = "block";
      b.disabled = false; b.textContent = "Enviar mi opinión";
    }
  };
}

/* ---------------------------------------------------------------- pedido */
// cfg: {pre, producto: () => texto, precio: () => numero, faltan: () => [..], campos: id => {..}, archivos: id => Promise<[[nombre, File]]>, ancla}
function pedido(cfg) {
  $("fEntrega").innerHTML = (T.entregas || []).map(e => `<option>${esc(e)}</option>`).join("");
  const dirToggle = () => { $("dirField").style.display = /uber|env[ií]o/i.test($("fEntrega").value) ? "" : "none"; };
  $("fEntrega").onchange = dirToggle; dirToggle();
  uploadLabel($("fComp"), "Subir el comprobante");
  function pago() {
    const t = cfg.precio(), s = half(t);
    const al = T.alias ? `<div class="alias"><code>${esc(T.alias)}</code><button class="btn sm" type="button" id="copyAlias">Copiar</button></div>` : "";
    $("payBox").innerHTML = `<span class="small">Transferí la seña (la mitad):</span><span class="amt">${money(s)}</span>
      <span class="small">Al alias de Mercado Pago${T.titular ? ` a nombre de ${esc(T.titular)}` : ""}:</span>${al}
      <span class="small">Después subí la captura acá abajo. Los otros ${money(t - s)} los pagás cuando lo recibís.</span>`;
    const cb = $("copyAlias");
    if (cb) cb.onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(T.alias) : Promise.reject()).then(() => toast("Alias copiado."), () => toast("Alias: " + T.alias)); };
  }
  function err(html) { const e = $("err"); e.innerHTML = html; e.style.display = "block"; e.scrollIntoView({behavior: "smooth", block: "center"}); }
  let lastId = null;
  $("sendBtn").onclick = async () => {
    $("err").style.display = "none";
    const nombre = $("fNombre").value.trim(), wa = $("fWa").value.replace(/\D/g, ""), uber = /uber|env[ií]o/i.test($("fEntrega").value);
    const comp = $("fComp").files[0], faltan = cfg.faltan().slice();
    if (nombre.length < 3) faltan.push("Escribí tu nombre y apellido.");
    if (wa.length < 8) faltan.push("Escribí tu WhatsApp, así te avisamos cuando esté listo.");
    if (uber && $("fDir").value.trim().length < 5) faltan.push("Escribí la dirección para el Uber Moto.");
    if (!comp) faltan.push("Subí el comprobante de la seña.");
    if (!$("fAcepto").checked) faltan.push("Marcá la casilla de abajo.");
    if (faltan.length) { err("Antes de confirmar:<br>" + faltan.map(f => "· " + esc(f)).join("<br>")); return; }
    const btn = $("sendBtn"); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Enviando tu pedido...';
    try {
      const id = orderId(cfg.pre); lastId = id;
      const t = cfg.precio(), s = half(t);
      const compFile = await prepImagen(comp, `${id} - comprobante.jpg`);
      const base = {
        _subject: `Pedido ${id} · ${cfg.producto()} · ${nombre}`, pedido: id, producto: cfg.producto(),
        precio_total: money(t), sena_pagada: money(s), resta_cobrar: money(t - s),
        cliente: nombre, whatsapp: wa, email: $("fEmail").value.trim(), entrega: $("fEntrega").value,
        direccion: uber ? $("fDir").value.trim() : "", notas_del_cliente: $("fNotas").value.trim()
      };
      const campos = Object.assign({}, cfg.campos(id), base);
      const ord = {};   // primero lo que hay que imprimir, despues los datos
      for (const k of Object.keys(cfg.campos(id))) ord[k] = campos[k];
      Object.assign(ord, campos);
      const arch = (await cfg.archivos(id)).concat([["comprobante", compFile]]);
      await window.enviarPedido(ord, arch);
      const tel = waNum().replace(/^549/, "");
      const contacto = [T.email ? `<a href="mailto:${esc(T.email)}">${esc(T.email)}</a>` : "", tel ? `WhatsApp <a href="${waLink(`Hola, hice el pedido ${id}.`)}" target="_blank" rel="noopener">${esc(tel)}</a>` : ""].filter(Boolean).join(" · ");
      const ok = $("ok");
      ok.innerHTML = `<h3>Listo, recibimos tu pedido</h3><p>Tu número de pedido es <b>${id}</b>. Guardalo por las dudas.</p>
        <p>Cuando se acredite la seña empezamos a hacerlo. Te escribimos por WhatsApp cuando esté listo para ${uber ? "mandártelo por Uber Moto" : "retirar"}.</p>
        ${contacto ? `<p class="small">Si necesitás cambiar algo: ${contacto}</p>` : ""}
        <p class="small">Cuando lo tengas, nos encantaría saber qué te pareció. Podés dejar tu opinión en <a href="index.html#opiniones">la página de inicio</a>.</p>`;
      ok.style.display = "block"; btn.style.display = "none"; ok.scrollIntoView({behavior: "smooth", block: "center"});
      if (cfg.listo) cfg.listo(id);
    } catch (e) {
      console.error(e);
      let msg = "No se pudo enviar el pedido. Revisá la conexión y probá de nuevo.";
      if (e && e.message === "pdfgrande") msg = "El comprobante en PDF pesa mucho. Subí una captura de pantalla.";
      const wl = waLink(`Hola, quise hacer un pedido (${cfg.producto()}) y la página no lo pudo enviar.`);
      err(`${msg}${wl ? `<br>Si sigue sin andar, <a href="${wl}" target="_blank" rel="noopener">avisanos por WhatsApp</a>.` : ""}`);
      btn.disabled = false; btn.textContent = "Confirmar pedido";
    }
  };
  return {pago};
}

/* barra de compra que aparece abajo en el celular */
function barraCompra(precio, texto, ancla) {
  const b = document.createElement("div"); b.className = "stickybuy";
  b.innerHTML = `<div><b id="sbPrice"></b><span>Precio final por transferencia</span></div><a class="btn primary" href="${ancla}">${texto}</a>`;
  document.body.appendChild(b);
  const upd = () => { $("sbPrice").textContent = money(precio()); };
  upd();
  const hero = document.querySelector(".pinfo .btn.primary"), stop = document.getElementById("pedido");
  const on = () => {
    const hb = hero ? hero.getBoundingClientRect().bottom : 0, st = stop ? stop.getBoundingClientRect().top : 1e9;
    b.classList.toggle("on", hb < 0 && st > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", on, {passive: true}); on();
  return upd;
}

function galeria(items) {
  // items: [{src, alt, tag, video:{mp4, webm, poster}}]
  const main = $("gMain"), th = $("thumbs");
  const show = i => {
    const it = items[i];
    main.innerHTML = it.video
      ? `<video poster="${it.video.poster}" autoplay muted loop playsinline preload="metadata"><source src="${it.video.mp4}" type="video/mp4"><source src="${it.video.webm}" type="video/webm"></video>`
      : `<img src="${it.src}" alt="${esc(it.alt)}">`;
    if (it.tag) main.insertAdjacentHTML("beforeend", `<span class="tag">${esc(it.tag)}</span>`);
    th.querySelectorAll("button").forEach((b, k) => b.classList.toggle("on", k === i));
  };
  th.innerHTML = items.map((it, i) => `<button type="button" aria-label="Ver ${esc(it.alt)}"><img src="${it.video ? it.video.poster : it.src}" alt="" loading="lazy">${it.video ? '<span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' : ""}</button>`).join("");
  th.querySelectorAll("button").forEach((b, i) => b.onclick = () => show(i));
  show(0);
  return show;
}

function faq(el, L) { el.innerHTML = L.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join(""); }

document.querySelectorAll("[data-t]").forEach(e => { const k = e.dataset.t; if (T[k]) e.textContent = T[k]; });
window.Tienda = {T, $, money, half, esc, toast, orderId, prepImagen, uploadLabel, renderOpiniones, formOpinion, pedido, barraCompra, galeria, faq, waLink};
})();
