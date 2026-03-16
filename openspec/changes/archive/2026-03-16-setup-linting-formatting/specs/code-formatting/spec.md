## ADDED Requirements

### Requirement: Prettier configurado en ambos paquetes
Ambos paquetes (backend y frontend) SHALL tener un fichero `.prettierrc` con la misma configuración: `{ "singleQuote": true, "trailingComma": "all" }`.

#### Scenario: formato consistente entre paquetes
- **WHEN** se formatea el mismo fragmento de código en backend y frontend
- **THEN** el resultado es idéntico en ambos paquetes

### Requirement: Scripts npm de formateo en backend
El `backend/package.json` SHALL definir los scripts `format` y `format:check`.

#### Scenario: format formatea ficheros en backend
- **WHEN** se ejecuta `npm run format` en backend
- **THEN** Prettier formatea todos los ficheros `src/` y devuelve código de salida 0

#### Scenario: format:check solo comprueba en backend
- **WHEN** se ejecuta `npm run format:check` en backend con un fichero no formateado
- **THEN** Prettier devuelve código de salida no-cero sin modificar ningún fichero

### Requirement: Scripts npm de formateo en frontend
El `frontend/package.json` SHALL definir los scripts `format` y `format:check`.

#### Scenario: format formatea ficheros en frontend
- **WHEN** se ejecuta `npm run format` en frontend
- **THEN** Prettier formatea todos los ficheros `src/` y devuelve código de salida 0

#### Scenario: format:check solo comprueba en frontend
- **WHEN** se ejecuta `npm run format:check` en frontend con un fichero no formateado
- **THEN** Prettier devuelve código de salida no-cero sin modificar ningún fichero
