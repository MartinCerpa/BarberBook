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
