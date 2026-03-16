# Project setup

Teniendo en cuenta la estructura y tecnologias del proyecto

- Instala y configura eslint como linter (frontend + backend)
    - `npm run lint` sólo debe comprobar
    - `npm run lint:fix` debe corregir
- Instala y configura prettier como formateador de código (frontend + backend)
    - `npm run format` debe formatear el código
    - `npm run format:check` sólo debe comprobar el formato
- Instala un *pre-commit hook* con `husky` para que se se aplique el formateo de ficheros ante cualquier cambio