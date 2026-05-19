## MODIFIED Requirements

### Requirement: Tailwind CSS configurado con tema base
El sistema SHALL incluir Tailwind CSS v3 con PostCSS, un tema personalizado basado en "Vivid Modernity", y tipografía moderna cargada desde Google Fonts.

#### Scenario: Utilidades Tailwind disponibles
- **WHEN** un componente usa clases como `bg-primary` o `text-lg`
- **THEN** los estilos se aplican correctamente en el navegador respetando la paleta Vivid Modernity

#### Scenario: Tema personalizado
- **WHEN** se inspecciona `tailwind.config.js`
- **THEN** el tema sobrescribe (overwrite) colores para forzar el uso estricto de la paleta Vivid Modernity (primary: #b3193d, secondary: #6d4e9f, tertiary: #006a42, surface: #fff8f7, error: #ba1a1a) y tipografías (Outfit e Inter)

#### Scenario: Google Fonts cargadas
- **WHEN** la app se renderiza en el navegador
- **THEN** las fuentes Inter y Outfit están disponibles (importadas via CDN o link tag en `index.html`)
