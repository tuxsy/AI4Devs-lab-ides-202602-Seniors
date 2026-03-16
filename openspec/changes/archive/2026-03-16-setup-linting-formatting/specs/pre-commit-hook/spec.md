## ADDED Requirements

### Requirement: Pre-commit hook con Husky
El repositorio SHALL tener un pre-commit hook instalado via Husky que se ejecute automáticamente antes de cada `git commit`. El hook MUST ejecutar `lint-staged`.

#### Scenario: hook instalado tras npm install en raíz
- **WHEN** se ejecuta `npm install` en la raíz del repositorio
- **THEN** el script `prepare` instala Husky y el fichero `.husky/pre-commit` queda activo

#### Scenario: commit con ficheros correctos procede
- **WHEN** se hace `git commit` con ficheros ya formateados y sin errores de lint
- **THEN** el hook termina con éxito y el commit se crea

#### Scenario: commit con ficheros incorrectos aplica correcciones
- **WHEN** se hace `git commit` con ficheros staged que tienen formateo incorrecto
- **THEN** lint-staged formatea y corrige los ficheros antes de completar el commit

### Requirement: lint-staged opera solo sobre ficheros staged
lint-staged SHALL aplicar linting y formateo únicamente sobre los ficheros incluidos en el stage de Git, no sobre todo el proyecto.

#### Scenario: ficheros no staged no se modifican
- **WHEN** se hace `git commit` con solo un subconjunto de ficheros staged
- **THEN** lint-staged solo procesa los ficheros staged; los ficheros no staged no cambian

#### Scenario: lint-staged cubre backend y frontend
- **WHEN** un commit incluye ficheros de `backend/src/` y `frontend/src/`
- **THEN** lint-staged aplica las reglas correspondientes a cada paquete según los globs configurados
