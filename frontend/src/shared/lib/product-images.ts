// Mapeo de productos de la BD a imágenes locales
// Las keys deben ser SUBCADENAS del nombre del producto (case-insensitive)
// Van de más específicas a menos específicas
const imageMap: Record<string, string> = {
  // ─── Aguas ───
  'sin gas': '/images/Agua Mineral sin gas.png',
  'con gas': '/images/Agua con gas.png',
  agua: '/images/Agua Mineral sin gas.png', // fallback general

  // ─── Gaseosas ───
  'coca cola': '/images/Coca Cola.png',
  coca: '/images/Coca Cola.png',
  sprite: '/images/Sprite.png',

  // ─── Jugos ───
  'naranja natural': '/images/Jugo de naranja natural.png',
  naranja: '/images/Jugo de naranja natural.png',
  'limón': '/images/Jugo natural de limon.png',
  'limon': '/images/Jugo natural de limon.png',

  // ─── Carnes ───
  milanesa: '/images/milanesa-napolitana.jpg',
  'bife de chorizo': '/images/Bife de chorizo.png',
  bife: '/images/Bife de chorizo.png',
  'pollo a la parrilla': '/images/Pollo a la parilla.png',
  'pollo a la parilla': '/images/Pollo a la parilla.png',
  pollo: '/images/Pollo a la parilla.png',

  // ─── Pastas ───
  'tallarines a la bolognesa': '/images/Tallarines a la bolognesa.png',
  'tallarines con bolognesa': '/images/Tallarines a la bolognesa.png',
  'tallarin': '/images/Tallarines a la bolognesa.png',
  bolognesa: '/images/Tallarines a la bolognesa.png',
  'ravioles de ricota': '/images/Ravioles de ricota.png',
  raviol: '/images/Ravioles de ricota.png',
  'lasaña clásica': '/images/Lasaña clasica.png',
  'lasaña clasica': '/images/Lasaña clasica.png',
  lasaña: '/images/Lasaña clasica.png',
  lasana: '/images/Lasaña clasica.png',

  // ─── Ensaladas ───
  'ensalada césar': '/images/Ensalada Cesar.png',
  'ensalada cesar': '/images/Ensalada Cesar.png',
  'ensalada mixta': '/images/Ensalada mixta.png',
  ensalada: '/images/Ensalada mixta.png',

  // ─── Bowls ───
  bowl: '/images/Bowl de palta.png',

  // ─── Snacks ───
  'papas fritas': '/images/snacks.jpg',
  papa: '/images/snacks.jpg',
  'maní salado': '/images/Mani salado.png',
  'mani salado': '/images/Mani salado.png',
  maní: '/images/Mani salado.png',
  mani: '/images/Mani salado.png',

  // ─── Postres ───
  'flan casero': '/images/Flan casero.png',
  flan: '/images/Flan casero.png',
  'brownie de chocolate': '/images/Brownie de chocolate.png',
  brownie: '/images/Brownie de chocolate.png',
  'helado de frutilla': '/images/Helado de frutilla.png',
  helado: '/images/Helado de frutilla.png',
};

/**
 * Retorna la imagen local del producto.
 * Si el producto tiene imagen_url en la BD, usa esa.
 * Si no, busca por nombre en el mapeo local.
 */
export function getProductImage(nombre: string, imagenUrl?: string | null): string | null {
  if (imagenUrl) return imagenUrl;
  const key = Object.keys(imageMap).find((k) => nombre.toLowerCase().includes(k));
  return key ? imageMap[key] : null;
}
