# BarberBook Development Workflow

## Reglas generales

- No realizar cambios destructivos sin confirmación.
- Antes de modificar archivos importantes, analizar la arquitectura existente.
- Mantener la estructura actual del proyecto.
- Evitar crear soluciones duplicadas si ya existe un servicio o componente reutilizable.

---

# Git

## Nunca ejecutar automáticamente:

- git commit
- git push
- git merge
- git rebase
- git reset
- git checkout de ramas
- git branch -D
- git stash

El usuario debe ejecutar manualmente cualquier operación Git.

---

# Antes de modificar código

Siempre:

1. Revisar archivos relacionados.
2. Explicar qué archivos serán modificados.
3. Explicar el impacto esperado.
4. Esperar confirmación cuando una decisión afecte arquitectura o producto.

---

# Validación obligatoria

Después de cambios:

Ejecutar cuando corresponda:

- npm run lint
- npm run build
- pruebas automatizadas

Verificar:

- consola sin errores.
- responsive mobile.
- navegación existente.
- compatibilidad con temas.

---

# Producto

No agregar funcionalidades no solicitadas.

Si existe una oportunidad de mejora:

- explicarla primero.
- esperar decisión del propietario del producto.

---

# Diseño

Priorizar:

- mobile first.
- claridad.
- simplicidad.
- experiencia del barbero.

Evitar:

- dashboards saturados.
- exceso de información.
- decisiones empresariales complejas sin necesidad.

---

# Backend futuro

Mantener separación:

Frontend:
- componentes visuales.
- interacción.

Servicios:
- lógica de negocio.

Backend:
- persistencia.
- autenticación.
- datos reales.

No acoplar componentes directamente a bases de datos.