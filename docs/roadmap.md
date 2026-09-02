# BarberBook Roadmap

## Visión del proyecto

BarberBook busca convertirse en una herramienta de gestión para barberos independientes y barberías, permitiéndoles administrar sus reservas, clientes, agenda y posteriormente sus operaciones diarias desde una sola plataforma.

El objetivo principal es mejorar la relación entre profesional y cliente, reduciendo la carga administrativa del barbero y entregando una experiencia simple para reservar horas.

---

# Estado actual del proyecto

## Fase completada: Frontend funcional (A1)

Actualmente BarberBook cuenta con un prototipo funcional que permite simular el flujo principal de trabajo del profesional:

- Perfil profesional público.
- Configuración de servicios.
- Gestión de horarios.
- Gestión de disponibilidad.
- Solicitudes de reserva.
- Agenda profesional.
- Gestión de clientes.
- Historial de atenciones.
- Reglas configurables de reservas.

La aplicación funciona actualmente con datos locales simulados, preparada para una futura integración con backend.

---

# Fase actual: Pulido del producto

## Objetivo

Mejorar BarberBook utilizando retroalimentación de usuarios reales antes de continuar con nuevas capas de desarrollo.

Esta fase está enfocada exclusivamente en experiencia de usuario, interfaz y preparación del frontend.

No incluye:

- Base de datos.
- API.
- Autenticación.
- Persistencia real.
- Cambios importantes de arquitectura backend.

---

## Prioridades

### 1. Optimización del flujo de reservas

Objetivo:

Reducir la cantidad de pasos necesarios para que un cliente pueda solicitar una hora.

Incluye:

- Avance automático al seleccionar servicio.
- Avance automático al seleccionar fecha.
- Avance automático al seleccionar horario.
- Mantener revisión final antes de enviar solicitud.
- Mejorar experiencia móvil.
- Optimizar distribución visual del resumen final.

---

### 2. Mejoras del panel profesional

Objetivo:

Mejorar la información que recibe el barbero al ingresar a BarberBook.

Incluye:

- Mejor visualización de próximas atenciones.
- Mostrar solicitudes pendientes correctamente usando datos simulados.
- Mejor conexión interna entre tarjetas y secciones.
- Preparar estructura para futura conexión con backend.

---

### 3. Mejoras de gestión de clientes

Objetivo:

Crear una experiencia más rápida y útil para administrar clientes.

Incluye:

- Reducir exceso de información visual.
- Crear tarjetas de cliente más compactas.
- Mostrar información relevante:
  - Nombre.
  - Frecuencia de visitas.
  - Última atención.
  - Categoría del cliente.

Nuevas funcionalidades:

- Ordenamiento configurable:
  - Clientes frecuentes primero.
  - Clientes nuevos primero.
  - Última visita.
  - Nombre A-Z.
  - Nombre Z-A.

- Eliminación segura de clientes mediante confirmación.

---

### 4. Preparación de nuevas funcionalidades

Crear bases visuales para futuras versiones:

- Sistema de abonos.
- Integración WhatsApp.
- Módulo financiero.
- Nuevas preferencias del profesional.

Estas funcionalidades podrán utilizar datos simulados, pero no implementarán lógica definitiva hasta la fase backend.

---

## Resultado esperado

Al finalizar esta fase:

- BarberBook tendrá una experiencia más cercana a un producto real.
- El flujo de reserva será más rápido y sencillo.
- El panel profesional será más útil para el día a día.
- El frontend estará preparado para conectarse posteriormente con servicios reales.

---

# Próxima fase: Backend B1

Objetivo:

Transformar los datos simulados en información persistente mediante una arquitectura real.

Incluye:

- Base de datos PostgreSQL.
- Usuarios profesionales.
- Autenticación.
- Clientes reales.
- Persistencia de reservas.
- Panel administrativo básico.
- Gestión de permisos.

---

# Futuras fases

## WhatsApp API

Integrar comunicación automática con clientes y profesionales.

Posibles funcionalidades:

- Confirmaciones.
- Recordatorios.
- Avisos de solicitudes pendientes.
- Mensajes relacionados a abonos.

---

## Sistema de pagos y abonos

Permitir que el profesional configure si requiere abono para reservar.

El sistema debe adaptarse a las necesidades de cada barbero.

---

## Finanzas profesionales

Crear una herramienta para que el barbero pueda administrar:

- Ingresos.
- Gastos.
- Historial financiero.
- Resumen mensual.

---

## Beta cerrada

Probar BarberBook con un grupo reducido de profesionales reales.

Objetivo:

- Recibir feedback.
- Detectar problemas de experiencia.
- Mejorar antes de un lanzamiento público.