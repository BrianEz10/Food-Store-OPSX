## ADDED Requirements

### Requirement: uiStore — Aplicación del theme al DOM

El sistema SHALL aplicar el tema seleccionado (light/dark) al DOM añadiendo o removiendo la clase `dark` del elemento `<html>`.

#### Scenario: Aplicar tema dark

- **WHEN** `uiStore.theme` se setea a `'dark'`
- **THEN** la clase `dark` se agrega al `<html>` y el documento cambia a modo oscuro

#### Scenario: Aplicar tema light

- **WHEN** `uiStore.theme` se setea a `'light'`
- **THEN** la clase `dark` se remueve del `<html>` y el documento cambia a modo claro

#### Scenario: Tema system

- **WHEN** `uiStore.theme` se setea a `'system'`
- **THEN** se respeta `prefers-color-scheme` del sistema operativo

#### Scenario: Persistencia del theme

- **WHEN** el usuario selecciona un tema y recarga la página
- **THEN** el tema persistido en localStorage se restaura y se aplica al DOM antes del primer render (evita flash de estilo incorrecto)

### Requirement: uiStore — Estado de navegación

El sistema SHALL extender el uiStore para gestionar el estado de la navegación (sidebar colapsada en desktop).

#### Scenario: Sidebar colapsada por defecto

- **WHEN** la app se carga en desktop
- **THEN** `sidebarCollapsed` es `false` (sidebar expandida)

#### Scenario: Toggle sidebar collapse

- **WHEN** se invoca `toggleSidebarCollapse()`
- **THEN** `sidebarCollapsed` se alterna entre `true` y `false`

#### Scenario: Sin persistencia del colapso

- **WHEN** se recarga la página
- **THEN** `sidebarCollapsed` vuelve a `false` (no se persiste)
