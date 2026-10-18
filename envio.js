// Manda el pedido a tu mail (con los archivos adjuntos) usando FormSubmit, que es gratis.
// No hace falta tocar nada acá: el mail se toma de config.js (pedidos_a).
window.enviarPedido = async function (campos, archivos) {
  const T = window.TIENDA || {};
  const to = (T.pedidos_a || T.email || "").trim();
  if (!to) throw new Error("Falta el mail en config.js");
  const fd = new FormData();
  for (const [k, v] of Object.entries(campos)) fd.append(k, v == null ? "" : String(v));
  fd.append("_captcha", "false"); fd.append("_template", "table"); fd.append("_honey", "");
  for (const [k, f] of archivos) fd.append(k, f, f.name);
  const r = await fetch("https://formsubmit.co/ajax/" + to, { method: "POST", body: fd, headers: { Accept: "application/json" } });
  let j = null; try { j = await r.json(); } catch (e) { }
  if (!r.ok || !j || String(j.success) !== "true") throw new Error((j && j.message) || ("http " + r.status));
  return j;
};
