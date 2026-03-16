## Context

El proyecto es un monorepo sin gestor de workspace a nivel raíz. El backend (Express + TypeScript) ya tiene ESLint y Prettier parcialmente configurados, pero le faltan el parser TypeScript y los scripts npm. El frontend (React CRA + TypeScript) usa la configuración ESLint por defecto de CRA incrustada en `package.json` y no tiene Prettier instalado. Husky y lint-staged están completamente ausentes en todo el repositorio.

La aplicación del formateo y linting debe ocurrir automáticamente en pre-commit para que sea transparente al desarrollador y no dependa de recordar ejecutar scripts manualmente.

## Goals / Non-Goals

**Goals:**
- ESLint con soporte TypeScript completo (`@typescript-eslint`) en backend y frontend
- Prettier configurado en ambos paquetes con los mismos criterios de estilo
- Scripts npm estandarizados: `lint`, `lint:fix`, `format`, `format:check` en ambos paquetes
- Pre-commit hook via Husky que ejecuta lint-staged sobre ficheros staged únicamente
- El hook opera desde la raíz del repositorio y delega en cada paquete

**Non-Goals:**
- CI pipeline (queda fuera del scope de task-00)
- Reglas de ESLint adicionales más allá de la integración básica TypeScript + Prettier
- Configuración de path aliases o import ordering automático
- Formateo de ficheros no TypeScript/JavaScript (CSS, JSON) por ahora

## Decisions

### D1: Husky instalado en la raíz del repo

**Decisión**: Husky se instala y configura desde un `package.json` en la raíz del repositorio, no dentro de `backend/` ni `frontend/`.

**Rationale**: Husky gestiona hooks Git, que existen a nivel de repositorio (`.git/`). Instalarlo en la raíz es la posición natural. Esto también simplifica `lint-staged` que puede apuntar a globs que cubran ambos paquetes.

**Alternativa descartada**: Instalar Husky en `backend/` y referenciar el frontend desde allí — crea acoplamiento artificial entre paquetes independientes.

---

### D2: lint-staged en la raíz con globs por paquete

**Decisión**: `lint-staged` se configura en el `package.json` raíz con globs separados para backend y frontend, ejecutando los scripts npm de cada paquete.

```json
{
  "lint-staged": {
    "backend/src/**/*.{ts,js}": ["npx prettier --write", "npx eslint --fix"],
    "frontend/src/**/*.{ts,tsx,js,jsx}": ["npx prettier --write", "npx eslint --fix"]
  }
}
```

**Rationale**: Centralizar lint-staged en raíz evita duplicación y da visibilidad de todo lo que ocurre en el hook desde un solo fichero.

---

### D3: Backend — añadir `@typescript-eslint` sobre config existente

**Decisión**: Extender el `.eslintrc.js` existente añadiendo parser y plugin de TypeScript, manteniendo la integración Prettier ya configurada.

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
```

**Rationale**: Preserva la inversión ya hecha (eslint + prettier configurados) y añade lo que falta.

---

### D4: Frontend — nuevo `.eslintrc.js` con Prettier integrado

**Decisión**: Crear un `.eslintrc.js` dedicado en `frontend/` extendiendo `react-app`, `react-app/jest`, `@typescript-eslint/recommended` y `prettier`. Eliminar el campo `eslintConfig` de `package.json`.

**Rationale**: CRA respeta un `.eslintrc.js` externo y lo fusiona con sus reglas internas. Tener el fichero dedicado es más explícito, versionable y permite añadir reglas futuras sin buscarlas en `package.json`.

**Riesgo**: CRA en versiones antiguas puede ignorar ciertos campos del `.eslintrc.js` externo. Se mitiga usando `EXTEND_ESLINT=true` en el `.env` del frontend si fuera necesario.

---

### D5: Misma configuración Prettier en ambos paquetes

**Decisión**: Ambos paquetes usan `{ "singleQuote": true, "trailingComma": "all" }`. El backend ya lo tiene; el frontend copiará el mismo `.prettierrc`.

**Rationale**: Consistencia de estilo cross-package. No hay razón técnica para diferencias.

## Risks / Trade-offs

- **[Riesgo] CRA sobreescribe reglas ESLint** → El bundle de ESLint de `react-scripts` puede ignorar reglas externas en `react-scripts build`. Mitigación: añadir `EXTEND_ESLINT=true` en `frontend/.env` o aceptar que el linting manual (scripts npm) y el hook pre-commit son la fuente de verdad; CRA build no bloquea el pipeline.

- **[Riesgo] Versiones incompatibles** → ESLint v9 en backend usa flat config, pero `.eslintrc.js` es la API legacy. El proyecto ya usa `.eslintrc.js`, se mantiene esa API para consistencia. Mitigación: documentar que la migración a flat config es trabajo futuro.

- **[Trade-off] Raíz package.json nuevo** → Crear un `package.json` en la raíz implica que `npm install` en raíz instalará solo las deps de Husky/lint-staged. Debe documentarse claramente para no confundir con los paquetes reales.

## Migration Plan

1. Instalar deps en raíz (`husky`, `lint-staged`) y en frontend (`prettier`, `eslint-plugin-prettier`, `eslint-config-prettier`, `@typescript-eslint/*`)
2. Añadir deps de TypeScript ESLint al backend
3. Actualizar configs de ESLint en ambos paquetes
4. Crear `.prettierrc` en frontend
5. Añadir scripts npm en ambos `package.json`
6. Crear `package.json` raíz con `prepare` y `lint-staged`
7. Ejecutar `npm run prepare` para instalar el hook Husky
8. Verificar que un `git commit` con ficheros sucios activa el hook y los corrige

**Rollback**: Revertir los ficheros de configuración y desinstalar las dependencias. No hay cambios de base de datos ni migración de datos.
