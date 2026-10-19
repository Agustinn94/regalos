// =====================================================================
//  EDITÁ ACÁ. Es lo único que tenés que tocar de la página.
//  Cambiá solo lo que está entre comillas o los números, sin borrar las comas.
// =====================================================================
window.TIENDA = {
  nombre: "PRINT3D STUDIO",
  whatsapp: "5493813004867",      // solo aparece al final de la compra, para dudas
  email: "agustin.gutierrez.2894@gmail.com",       // solo aparece al final de la compra
  pedidos_a: "agustin.gutierrez.2894@gmail.com",   // a este mail llegan los pedidos con los archivos
  alias: "agustingutierrez.94",   // alias de Mercado Pago para la seña
  titular: "",                    // el nombre que aparece en la cuenta (vacío = no se muestra)
  ciudad: "San Miguel de Tucumán",
  demora: "5 a 7 días hábiles",
  material: "papel",              // cómo imprimís las tiras del llavero: "papel" o "acetato"

  entregas: [
    "Retiro en San Miguel de Tucumán, sin cargo",
    "Uber Moto dentro de San Miguel de Tucumán (el viaje lo pagás al recibir)"
  ],

  // PRECIOS FINALES, pagando por transferencia. La seña es la mitad y se calcula sola.
  bloque: { precio: 22900, desafio: 24900 },      // desafio = la opción con más piezas
  rollo: [
    { id: "uno", nombre: "1 llavero", precio: 11900, rollos: 1,
      detalle: "6 fotos, con argolla y cadena de metal." },
    { id: "duo", nombre: "2 llaveros con corazón", precio: 18900, rollos: 2, destacado: true,
      detalle: "12 fotos y el corazón que se une, una mitad para cada uno." }
  ],
  caja: { precio: 24900 },

  // OPINIONES para mostrar. Cuando te llegue una por mail y te guste, copiá la línea de ejemplo,
  // borrale las dos barras // del principio y completala. producto: "bloque", "rollo" o "caja".
  opiniones: [
    // { nombre: "Sofía", producto: "bloque", estrellas: 5, texto: "Quedó hermoso, a mi novio le encantó." },
  ]
};
