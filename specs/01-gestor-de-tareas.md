
# Spec: Gestor de Tareas CRUD (MVP)

## 1. El Problema y Alcance

### Descripción del Problema
Un usuario individual necesita registrar, consultar, actualizar y cerrar sus tareas diarias desde un único lugar persistente, evitando perder pendientes en notas sueltas o listas volátiles que se borran al cerrar la sesión.

### Historias de Usuario y Criterios de Aceptación

#### HU-01: Crear una tarea
**Como** usuario, **quiero** crear una tarea con un título obligatorio y una descripción opcional, **para** registrar mis pendientes apenas surgen.
- **CA-1.1:** **Dado** que ingreso un título válido (1 a 120 caracteres), **cuando** confirmo la creación, **entonces** la tarea se guarda con estado `"pending"`, se le asigna un `id` único y aparece en el listado.
- **CA-1.2:** **Dado** que el título está vacío o contiene solo espacios, **cuando** intento guardar, **entonces** el sistema bloquea la creación y muestra un mensaje de validación sin crear registros.

#### HU-02: Listar y filtrar tareas
**Como** usuario, **quiero** visualizar todas mis tareas y filtrarlas por estado, **para** saber rápidamente qué tengo pendiente y qué ya completé.
- **CA-2.1:** **Dado** que existen tareas registradas, **cuando** abro la aplicación, **entonces** se muestran ordenadas de más reciente a más antigua con su título y estado visible.
- **CA-2.2:** **Dado** que selecciono un filtro (`todas`, `pendientes`, `completadas`), **cuando** se aplica, **entonces** solo se muestran las tareas que coinciden con ese estado.
- **CA-2.3:** **Dado** que no hay tareas (o ninguna coincide con el filtro), **cuando** consulto la lista, **entonces** se muestra un mensaje claro de estado vacío sin errores.

#### HU-03: Editar el contenido de una tarea
**Como** usuario, **quiero** modificar el título o la descripción de una tarea existente, **para** corregir errores o agregar detalles nuevos.
- **CA-3.1:** **Dado** una tarea existente, **cuando** edito su título o descripción con datos válidos y guardo, **entonces** los cambios persisten y se actualiza `updatedAt`.
- **CA-3.2:** **Dado** que intento guardar un título vacío durante la edición, **cuando** confirmo, **entonces** se rechaza el cambio y se conserva el valor anterior.

#### HU-04: Cambiar el estado de una tarea
**Como** usuario, **quiero** marcar una tarea como completada o reabrirla como pendiente, **para** llevar el control real de mi avance.
- **CA-4.1:** **Dado** una tarea en estado `"pending"`, **cuando** la marco como completada, **entonces** su estado cambia a `"completed"` y persiste tras recargar la aplicación.
- **CA-4.2:** **Dado** una tarea en estado `"completed"`, **cuando** la desmarco, **entonces** vuelve a estado `"pending"`.

#### HU-05: Eliminar una tarea
**Como** usuario, **quiero** eliminar una tarea que ya no necesito, **para** mantener mi lista limpia y relevante.
- **CA-5.1:** **Dado** una tarea existente, **cuando** ejecuto la acción de eliminar, **entonces** desaparece inmediatamente de la vista y de la capa de persistencia.
- **CA-5.2:** **Dado** que recargo la aplicación después de eliminar una tarea, **cuando** carga la lista, **entonces** la tarea eliminada no vuelve a aparecer.

### Fuera de Alcance (Out of Scope)
- Autenticación, roles o soporte multiusuario.
- Subtareas, etiquetas, prioridades, fechas de vencimiento o recordatorios.
- Sincronización en tiempo real entre múltiples dispositivos.

---

## 2. Modelo de Datos
- **`Tarea`**:
  - `id`: `string` (UUID o identificador único autogenerado)
  - `title`: `string` (requerido, `trim()`, longitud `1..120`)
  - `description`: `string | null` (opcional, longitud máxima `500`)
  - `status`: `"pending" | "completed"` (valor inicial: `"pending"`)
  - `createdAt`: `string` (ISO-8601)
  - `updatedAt`: `string` (ISO-8601)

## 3. Persistencia y Comportamiento Técnico
- **Almacenamiento:** [Definir: SQLite / archivo JSON / localStorage / API REST].
- **Integridad:** Toda operación de escritura (crear, editar, cambiar estado, eliminar) debe reflejarse en la persistencia antes de confirmar éxito en la UI/respuesta.

## 4. Definción de hecha (Criterios de Terminado)
- [ ] Todos los criterios de aceptación (`CA-1.1` a `CA-5.2`) cumplen el resultado esperado.
- [ ] Los datos persisten íntegros tras recargar la página o reiniciar el servidor/proceso.
- [ ] Existen pruebas automatizadas que validan el flujo completo CRUD y los casos de rechazo por validación.
- [ ] Sin errores en consola ni advertencias de compilación/tipos.