## ADDED Requirements

### Requirement: Sección Hero con buscador interactivo
El sistema SHALL proveer una sección Hero principal en la HomePage con la pregunta "¿Qué querés comer hoy?" y un campo de búsqueda interactivo.

#### Scenario: Búsqueda rápida redirige a catálogo con query
- **WHEN** el usuario ingresa un término de búsqueda (ej. "pizza") y presiona el botón "Buscar" o "Enter" en el Hero de la HomePage
- **THEN** el sistema SHALL redirigir la navegación a la ruta `/catalogo` manteniendo la query en la URL (ej. `/catalogo?search=pizza`) para filtrar los productos automáticamente

#### Scenario: Clic en CTA principal redirige a catálogo
- **WHEN** el usuario hace clic en el botón de acción principal (CTA) "Explorar Menú" del Hero
- **THEN** el sistema SHALL navegar a la ruta `/catalogo` sin filtros de búsqueda activos

### Requirement: Navegación rápida por tarjetas de categoría
El sistema SHALL renderizar tarjetas visuales de categorías destacadas en la HomePage (Pizzas, Pastas, Burgers, Postres, Bebidas, Ensaladas) que actúen como accesos directos al catálogo.

#### Scenario: Selección de categoría desde la Home
- **WHEN** el usuario hace clic en la tarjeta de la categoría "Burgers" en la HomePage
- **THEN** el sistema SHALL redirigir a la ruta `/catalogo` con el filtro de categoría correspondiente pre-cargado y activo

### Requirement: Sección de Platos del Día con ProductCards
El sistema SHALL mostrar una sección de "Platos del Día" o recomendados, integrando los componentes de tarjetas de productos existentes en una cuadrícula responsiva.

#### Scenario: Visualización responsiva de platos del día
- **WHEN** un usuario accede a la HomePage
- **THEN** se SHALL visualizar una cuadrícula con un conjunto de platos del día recomendados, donde cada elemento utiliza el componente `ProductCard` estándar con su información y acción de agregar/ver

### Requirement: Sección de Promociones Diarias y Badges
El sistema SHALL destacar ofertas especiales y promociones activas mediante componentes visuales de cupones o banners que utilicen el color terciario del sistema de diseño.

#### Scenario: Banners de promoción activa
- **WHEN** el usuario visualiza la sección de promociones en la HomePage
- **THEN** se SHALL mostrar tarjetas promocionales con badges de descuento llamativos en color terciario (#006a42), indicando la oferta (ej. "2x1", "15% OFF") y su descripción
