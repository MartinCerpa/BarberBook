# BarberBook Decisions

Este documento registra decisiones importantes del proyecto para evitar perder contexto durante el desarrollo.

---

# Producto

## BarberBook será una plataforma multiprofesional

Decisión:
La aplicación será diseñada para soportar múltiples barberos.

Motivo:
El objetivo es ofrecer BarberBook como servicio y no solamente como herramienta personal.

---

# Clientes

## Los clientes pertenecen al profesional

Decisión:
Cada barbero tendrá su propia base de clientes.

Motivo:
La relación entre cliente y profesional es personal y debe ser administrada por cada barbero.

---

## Registro del cliente

Decisión:
El cliente podrá solicitar una hora sin necesidad de crear una cuenta.

Motivo:
Reducir la fricción inicial.

El registro de cliente será opcional y podría entregar beneficios futuros.

---

## Clientes con mismo número telefónico

Decisión:
No se forzará unicidad absoluta por teléfono.

Motivo:
Un mismo número podría representar personas diferentes según el contexto del profesional.

Ejemplo:
Familiares que comparten teléfono.

---

# Reservas

## El profesional controla las reglas

Decisión:
El barbero define:

- Confirmación automática o manual.
- Cancelaciones.
- Anticipación.
- Reglas especiales.

Motivo:
Cada profesional trabaja de manera diferente.

---

## Abonos

Decisión:
Los pagos y abonos no serán obligatorios inicialmente.

Motivo:
La primera versión busca validar el producto.

Futuro:
Integrar sistemas configurables de abono.

---

# Desarrollo

## Main como versión estable

Decisión:
La rama main representa la versión oficial del proyecto.

Motivo:
Evitar trabajar directamente sobre producción.

---

## Desarrollo mediante ramas

Decisión:
Cada funcionalidad importante se desarrollará en ramas independientes.

Ejemplo:

feature/backend-b1

feature/pulir-barberbook

Motivo:
Reducir riesgos y permitir pruebas antes de integrar.

---

# Backend

## Separación frontend/backend

Decisión:
El frontend debe consumir servicios preparados para una futura API.

Motivo:
Facilitar la migración desde datos locales hacia una arquitectura real.

---

# WhatsApp

## WhatsApp API será posterior

Decisión:
No integrar WhatsApp hasta validar el flujo principal.

Motivo:
Tiene costos asociados y depende de una versión más madura del producto.

---

# Validación con usuarios

Decisión:
Las mejoras importantes deben considerar feedback de profesionales reales.

Motivo:
BarberBook busca resolver problemas reales del trabajo diario del barbero, no solamente construir funcionalidades.

---

# Guardado de configuraciones

Decisión:
Las configuraciones operativas utilizan guardado automático inmediato.

Aplica a:

- Servicios.
- Horarios de atención.
- Reservas.
- Preferencias frecuentes.

Las configuraciones relacionadas con identidad profesional mantienen guardado manual.

Aplica a:

- Perfil profesional.
- Información pública.

Motivo:
Reducir errores causados por olvidar guardar cambios y mantener una experiencia más rápida para tareas frecuentes.

Los cambios automáticos deben pasar validaciones antes de persistir.

---

## Agenda como centro operativo del profesional

Fecha:
Septiembre 2026

Decisión:

La Agenda profesional será diseñada como la herramienta principal de trabajo diario del barbero.

Su objetivo no será únicamente mostrar reservas, sino acompañar el ciclo completo de atención del cliente.

Flujo esperado:

Reserva confirmada
→ Cliente atendido
→ Registro de servicio realizado
→ Registro financiero
→ Actualización de historial del cliente

Principios:

- Priorizar la próxima atención.
- Reducir acciones necesarias durante la jornada.
- Mostrar información relevante del cliente.
- Preparar la integración futura con finanzas.
- Mantener separación entre configuración de horarios y operación diaria.

La Agenda debe evitar convertirse en una pantalla administrativa de configuración.

---

## Separación entre solicitudes y atenciones en Agenda

Fecha:
Septiembre 2026

Decisión:

BarberBook separará los conceptos de solicitudes pendientes y atenciones pendientes.

Las solicitudes representan intentos de reserva que requieren una decisión del profesional.

Las atenciones representan reservas confirmadas que todavía no han sido realizadas.

La Agenda debe priorizar la gestión de atenciones confirmadas.

Las Solicitudes deben manejar exclusivamente reservas pendientes de aprobación.

Motivo:

Evitar confusión en métricas, navegación y acciones disponibles para el profesional.

Estados futuros:

Solicitud:
pending → confirmed / rejected / expired

Atención:
confirmed → in_progress → completed
              ↘ cancelled
              ↘ no_show