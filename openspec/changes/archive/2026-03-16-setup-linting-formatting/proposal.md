## Why

El proyecto tiene configuraciones parciales de ESLint y Prettier en el backend, pero carece de integración completa en el frontend, scripts npm estandarizados, y un pre-commit hook que garantice la calidad del código antes de cada commit. Sin estos elementos, la consistencia de estilo no puede aplicarse de forma automática en todo el equipo.

## What Changes

- **Backend**: Añadir `@typescript-eslint/parser` y `@typescript-eslint/eslint-plugin` al `.eslintrc.js` para soporte TypeScript real; añadir scripts `lint`, `lint:fix`, `format`, y `format:check` al `package.json`.
- **Frontend**: Instalar `prettier` y `eslint-plugin-prettier`/`eslint-config-prettier`; migrar `eslintConfig` de `package.json` a un fichero `.eslintrc.js` con integración Prettier y TypeScript; añadir `.prettierrc`; añadir scripts `lint`, `lint:fix`, `format`, y `format:check`.
- **Raíz del repositorio**: Instalar y configurar `husky` con un pre-commit hook; configurar `lint-staged` para ejecutar `eslint --fix` y `prettier --write` solo sobre los ficheros staged en cada paquete.

## Capabilities

### New Capabilities

- `backend-linting`: ESLint con TypeScript completo y scripts npm en backend
- `frontend-linting`: ESLint con TypeScript y Prettier integrados en frontend
- `code-formatting`: Prettier configurado y con scripts npm en ambos paquetes
- `pre-commit-hook`: Husky + lint-staged ejecutando lint y format automáticamente en cada commit

### Modified Capabilities

_(ninguna — no cambian requisitos funcionales existentes)_

## Impact

- `backend/package.json`: nuevas devDependencies y scripts
- `backend/.eslintrc.js`: añadir parser y plugin de TypeScript
- `frontend/package.json`: nuevas devDependencies y scripts; eliminar `eslintConfig` inline
- `frontend/.eslintrc.js`: nuevo fichero con config completa
- `frontend/.prettierrc`: nuevo fichero
- `package.json` (raíz, a crear): `prepare` script, configuración de `lint-staged`, devDependencies de `husky`
- `.husky/pre-commit`: nuevo hook
