// =====================================================================
//  EDITÁ ACÁ. Es lo único que tenés que tocar de la página.
//  Cambiá solo lo que está entre comillas o los números, sin borrar las comas.
// =====================================================================
window.TIENDA = {
  nombre: "PRINT3D STUDIO",
  whatsapp: "5493813004867",      // tu número con 549 adelante y sin espacios
  email: "agustin.gutierrez.2894@gmail.com",       // se muestra al cliente al terminar la compra
  pedidos_a: "agustin.gutierrez.2894@gmail.com",   // a este mail llegan los pedidos con los archivos
  alias: "agustingutierrez.94",   // alias de Mercado Pago para la seña
  titular: "",                    // el nombre que aparece en la cuenta (si lo dejás vacío, no se muestra)
  ciudad: "San Miguel de Tucumán",
  demora: "5 a 7 días hábiles",
  material: "papel",              // cómo imprimís las tiras del rollo: "papel" o "acetato"

  entregas: [
    "Retiro en San Miguel de Tucumán, sin cargo",
    "Envío por Uber Moto en San Miguel de Tucumán (el viaje lo pagás vos al recibir)"
  ],

  // Bloque de Recuerdos: un solo precio, sea de 8, 12 o 25 piezas
  bloque: { nombre: "Bloque de Recuerdos", lista: 26900, transferencia: 22900 },

  // Rollo de fotos. "link_sena_mp" es un link de pago de Mercado Pago por la MITAD del precio de lista.
  // Si lo dejás vacío, la página ofrece solo transferencia al alias.
  productos: [
    { id: "pack", nombre: "Pack LOVE completo", lista: 29900, transferencia: 25000, rollos: 2, foto: "rollo-1.jpg",
      detalle: "2 rollos con 6 fotos cada uno y argolla con cadena, el corazón de bloques que encastra (una mitad para cada uno) y la caja LOVE impresa en 3D.",
      link_sena_mp: "" },
    { id: "duo", nombre: "2 rollos con corazón", lista: 22900, transferencia: 19000, rollos: 2, foto: "rollo-2.jpg",
      detalle: "2 rollos con 6 fotos cada uno y argolla con cadena, y el corazón de bloques que encastra. Sin caja.",
      link_sena_mp: "" },
    { id: "uno", nombre: "1 rollo", lista: 12900, transferencia: 10900, rollos: 1, foto: "rollo-4.jpg",
      detalle: "1 rollo con 6 fotos y argolla con cadena.",
      link_sena_mp: "" }
  ]
};
