// Manda el pedido a tu mail con los archivos adjuntos, usando FormSubmit (gratis).
// No hace falta tocar nada acá: el mail se toma de config.js (pedidos_a).
window.enviarPedido = function (campos, archivos) {
  const T = window.TIENDA || {};
  const to = (T.pedidos_a || T.email || "").trim();
  if (!to) return Promise.reject(new Error("Falta el mail en config.js"));
  const id = String(campos.pedido || Date.now());
  const base = location.href.replace(/[#?].*$/, "").replace(/[^\/]*$/, "");
  const next = base + "config.js?enviado=" + encodeURIComponent(id);
  // Plan B: si el navegador no deja armar el formulario, se manda igual (sin poder confirmar)
  const planB = () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(campos)) fd.append(k, v == null ? "" : String(v));
    fd.append("_captcha", "false"); fd.append("_template", "table");
    for (const [k, f] of archivos) fd.append(k, f, f.name);
    return fetch("https://formsubmit.co/" + to, { method: "POST", body: fd, mode: "no-cors" }).then(() => ({ success: "true" }));
  };
  return new Promise((resolve, reject) => {
    let ifr, f;
    try {
      const name = "envio_" + Date.now();
      ifr = document.createElement("iframe"); ifr.name = name; ifr.style.display = "none"; document.body.appendChild(ifr);
      f = document.createElement("form"); f.method = "POST"; f.action = "https://formsubmit.co/" + to;
      f.enctype = "multipart/form-data"; f.target = name; f.style.display = "none";
      const add = (k, v) => { const i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = v == null ? "" : String(v); f.appendChild(i); };
      for (const [k, v] of Object.entries(campos)) add(k, v);
      add("_captcha", "false"); add("_template", "table"); add("_next", next);
      for (const [k, file] of archivos) {
        const i = document.createElement("input"); i.type = "file"; i.name = k;
        const dt = new DataTransfer(); dt.items.add(file); i.files = dt.files; f.appendChild(i);
      }
      document.body.appendChild(f);
    } catch (e) {
      if (ifr) ifr.remove(); if (f) f.remove();
      planB().then(resolve, reject); return;
    }
    let done = false;
    const timer = setTimeout(() => { if (!done) { done = true; reject(new Error("tiempo")); } }, 120000);
    ifr.addEventListener("load", () => {
      let href = "";
      try { href = ifr.contentWindow.location.href; } catch (e) { return; }   // todavía en FormSubmit
      if (!done && href.indexOf("enviado=") >= 0) {
        done = true; clearTimeout(timer); resolve({ success: "true" });
        setTimeout(() => { ifr.remove(); f.remove(); }, 1500);
      }
    });
    f.submit();
  });
};
