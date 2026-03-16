## ADDED Requirements

### Requirement: ESLint con TypeScript en backend
El backend SHALL tener ESLint configurado con `@typescript-eslint/parser` y `@typescript-eslint/eslint-plugin` para analizar correctamente el código TypeScript. La configuración MUST extender `plugin:@typescript-eslint/recommended` y `plugin:prettier/recommended`.

#### Scenario: lint detecta error TypeScript
- **WHEN** existe un fichero `backend/src/` con una variable declarada pero no usada
- **THEN** `npm run lint` en backend devuelve un error de `@typescript-eslint/no-unused-vars` con código de salida no-cero

#### Scenario: lint:fix corrige errores de Prettier
- **WHEN** un fichero `backend/src/` tiene comillas dobles en lugar de simples
- **THEN** `npm run lint:fix` en backend corrige el fichero a comillas simples y devuelve código de salida 0

### Requirement: Scripts npm de linting en backend
El `backend/package.json` SHALL definir los scripts `lint` y `lint:fix`.

#### Scenario: script lint solo comprueba
- **WHEN** se ejecuta `npm run lint` en backend
- **THEN** ESLint analiza `src/` sin modificar ningún fichero

#### Scenario: script lint:fix aplica correcciones
- **WHEN** se ejecuta `npm run lint:fix` en backend
- **THEN** ESLint analiza y corrige `src/` con el flag `--fix`
