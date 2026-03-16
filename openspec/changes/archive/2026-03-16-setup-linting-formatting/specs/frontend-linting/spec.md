## ADDED Requirements

### Requirement: ESLint con TypeScript y Prettier en frontend
El frontend SHALL tener un fichero `.eslintrc.js` dedicado que extienda `react-app`, `react-app/jest`, `plugin:@typescript-eslint/recommended` y `plugin:prettier/recommended`. El campo `eslintConfig` en `package.json` SHALL ser eliminado.

#### Scenario: lint detecta infracción de Prettier en frontend
- **WHEN** existe un fichero `frontend/src/` con comillas dobles en lugar de simples
- **THEN** `npm run lint` en frontend devuelve un error de Prettier con código de salida no-cero

#### Scenario: lint:fix corrige errores en frontend
- **WHEN** un fichero `frontend/src/` tiene formateo incorrecto
- **THEN** `npm run lint:fix` en frontend corrige el fichero y devuelve código de salida 0

### Requirement: Scripts npm de linting en frontend
El `frontend/package.json` SHALL definir los scripts `lint` y `lint:fix`.

#### Scenario: script lint solo comprueba en frontend
- **WHEN** se ejecuta `npm run lint` en frontend
- **THEN** ESLint analiza `src/` sin modificar ningún fichero

#### Scenario: script lint:fix aplica correcciones en frontend
- **WHEN** se ejecuta `npm run lint:fix` en frontend
- **THEN** ESLint analiza y corrige `src/` con el flag `--fix`
