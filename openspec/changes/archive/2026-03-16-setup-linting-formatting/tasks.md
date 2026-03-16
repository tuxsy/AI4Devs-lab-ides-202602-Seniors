## 1. Backend — ESLint con TypeScript

- [x] 1.1 Instalar `@typescript-eslint/parser` y `@typescript-eslint/eslint-plugin` en `backend/`
- [x] 1.2 Actualizar `backend/.eslintrc.js` con parser, plugins y extends de TypeScript manteniendo integración Prettier
- [x] 1.3 Añadir script `lint` en `backend/package.json` (`eslint src/ --ext .ts,.js`)
- [x] 1.4 Añadir script `lint:fix` en `backend/package.json` (`eslint src/ --ext .ts,.js --fix`)
- [x] 1.5 Verificar que `npm run lint` detecta errores TypeScript y que `npm run lint:fix` los corrige

## 2. Backend — Prettier scripts

- [x] 2.1 Confirmar que `prettier` ya está instalado en backend (ya existe en devDependencies)
- [x] 2.2 Añadir script `format` en `backend/package.json` (`prettier --write src/`)
- [x] 2.3 Añadir script `format:check` en `backend/package.json` (`prettier --check src/`)
- [x] 2.4 Verificar que `npm run format:check` falla con fichero no formateado y `npm run format` lo corrige

## 3. Frontend — ESLint con TypeScript y Prettier

- [x] 3.1 Instalar `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-prettier` y `eslint-config-prettier` en `frontend/`
- [x] 3.2 Crear `frontend/.eslintrc.js` extendiendo `react-app`, `react-app/jest`, `plugin:@typescript-eslint/recommended` y `plugin:prettier/recommended`
- [x] 3.3 Eliminar el campo `eslintConfig` de `frontend/package.json`
- [x] 3.4 Añadir script `lint` en `frontend/package.json` (`eslint src/ --ext .ts,.tsx,.js,.jsx`)
- [x] 3.5 Añadir script `lint:fix` en `frontend/package.json` (`eslint src/ --ext .ts,.tsx,.js,.jsx --fix`)
- [x] 3.6 Verificar que `npm run lint` detecta errores en frontend

## 4. Frontend — Prettier

- [x] 4.1 Instalar `prettier` en `frontend/` como devDependency
- [x] 4.2 Crear `frontend/.prettierrc` con `{ "singleQuote": true, "trailingComma": "all" }`
- [x] 4.3 Añadir script `format` en `frontend/package.json` (`prettier --write src/`)
- [x] 4.4 Añadir script `format:check` en `frontend/package.json` (`prettier --check src/`)
- [x] 4.5 Verificar que `npm run format` en frontend formatea correctamente

## 5. Pre-commit Hook — Husky + lint-staged

- [x] 5.1 Crear `package.json` en la raíz del repositorio con `name`, `private: true` y script `prepare`
- [x] 5.2 Instalar `husky` y `lint-staged` en la raíz del repositorio
- [x] 5.3 Configurar `lint-staged` en el `package.json` raíz con globs para `backend/src/**/*.{ts,js}` y `frontend/src/**/*.{ts,tsx,js,jsx}`
- [x] 5.4 Ejecutar `npm run prepare` (o `npx husky init`) para instalar el hook
- [x] 5.5 Crear `.husky/pre-commit` que ejecute `npx lint-staged`
- [x] 5.6 Verificar que un `git commit` con ficheros mal formateados activa el hook, corrige los ficheros y completa el commit
- [x] 5.7 Verificar que ficheros no staged no son modificados por el hook
