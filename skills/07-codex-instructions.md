# Codex Instructions

## Antes de implementar

Siempre revisar:

1. skills/
2. docs/decisions.md
3. docs/roadmap.md

Antes de modificar código importante.

---

## Git

No ejecutar:

- git commit
- git push
- git merge
- git rebase
- git reset
- git restore
- git checkout
- git switch

sin autorización explícita del usuario.

No modificar ramas, historial o estado del repositorio sin confirmación.

---

## Cambios de arquitectura

Antes de:

- cambiar estructura de carpetas importante.
- agregar dependencias grandes.
- cambiar modelo de datos.
- modificar decisiones existentes.

Explicar:

- motivo del cambio.
- impacto esperado.
- archivos afectados.
- posibles riesgos.

Solicitar confirmación antes de continuar.

---

## Desarrollo

Priorizar:

- soluciones simples.
- mantener estructura existente.
- reutilizar servicios existentes.
- evitar duplicación de lógica.
- mantener nombres claros.

Antes de crear nuevos componentes, servicios o modelos:

1. Revisar si ya existe una solución similar.
2. Reutilizar código existente cuando sea posible.
3. Justificar la nueva estructura si es necesaria.

---

## Experiencia de usuario

Toda mejora debe considerar:

- Mobile first.
- Claridad antes que cantidad de información.
- Reducir pasos innecesarios.
- Mantener consistencia visual.

Antes de agregar funcionalidades nuevas preguntar:

¿Esta función mejora realmente la experiencia del barbero o cliente?

Evitar agregar complejidad innecesaria.

---

## Documentación

Actualizar documentación solamente cuando:

- cambie una decisión del producto.
- cambie arquitectura.
- se complete una fase importante.

No actualizar por:

- cambios pequeños de UI.
- correcciones menores.
- ajustes de estilos.

Cuando una implementación contradiga una decisión existente:

1. Informar la contradicción.
2. Explicar el impacto.
3. Esperar confirmación.
4. Actualizar documentación si corresponde.

---

## Testing

Antes de finalizar una implementación:

- ejecutar pruebas existentes.
- revisar errores de compilación.
- validar funcionamiento principal.

Informar:

- pruebas realizadas.
- resultados obtenidos.
- limitaciones encontradas.

No asumir que una funcionalidad funciona solamente porque compila.

---

## Comunicación

Antes de implementar cambios importantes:

Explicar:

- qué se modificará.
- por qué se necesita.
- qué archivos podrían cambiar.

Si existen varias soluciones:

- presentar alternativas.
- recomendar una opción.
- esperar decisión cuando afecte producto.
