// Manual sections data — each section has an id, icon, title, and content (JSX-ready HTML string)
// This file separates data from presentation for the Manual page

export const MANUAL_SECTIONS = [
  {
    id: 'intro',
    num: 1,
    icon: '🏭',
    title: 'Introducción',
    keywords: 'vsm value stream mapping flujo valor lean mejora continua mapeo takt time',
    content: `
      <h3>¿Qué es NexIA VSM?</h3>
      <p>NexIA VSM transforma el Mapeo de Flujo de Valor de un ejercicio estático de dibujo en un <strong>sistema vivo, analítico y accionable</strong> de mejora organizacional. La aplicación cubre todo el ciclo de vida del VSM: Configurar Demanda → Mapear Flujo Actual → Analizar Brechas → Ejecutar Mejoras → Medir Resultados → Estandarizar y Sostener.</p>

      <h3>¿Para quién es esta aplicación?</h3>
      <table class="manual-table"><thead><tr><th>Rol</th><th>Uso principal</th></tr></thead><tbody>
        <tr><td><strong>Ingeniero de Mejora Continua</strong></td><td>Mapear procesos, simular escenarios, gestionar Kaizen</td></tr>
        <tr><td><strong>Gerente de Planta</strong></td><td>Dashboards 360°, seguimiento de KPIs, auditorías</td></tr>
        <tr><td><strong>Líder de Equipo</strong></td><td>Ejecución de tareas Kaizen, matriz de habilidades</td></tr>
        <tr><td><strong>Consultor Lean</strong></td><td>Diagnóstico ADKAR, análisis de resistencia al cambio</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'quickstart',
    num: 2,
    icon: '🚀',
    title: 'Inicio Rápido',
    keywords: 'inicio rápido tutorial primeros pasos instalación requisitos demo proyecto ejemplo',
    content: `
      <h3>Requisitos del Sistema</h3>
      <table class="manual-table"><thead><tr><th>Requisito</th><th>Especificación</th></tr></thead><tbody>
        <tr><td><strong>Runtime</strong></td><td>Node.js versión 18 o superior</td></tr>
        <tr><td><strong>Navegador</strong></td><td>Chrome, Firefox, Edge o Safari (versiones recientes)</td></tr>
        <tr><td><strong>Sistema operativo</strong></td><td>Windows, macOS o Linux</td></tr>
        <tr><td><strong>Resolución recomendada</strong></td><td>1280 × 720 px o superior</td></tr>
      </tbody></table>

      <h3>Instalación y Ejecución</h3>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Comando</th><th>Descripción</th></tr></thead><tbody>
        <tr><td>1</td><td><code>npm install</code></td><td>Descarga e instala todas las dependencias</td></tr>
        <tr><td>2</td><td><code>npm run dev</code></td><td>Inicia el servidor de desarrollo</td></tr>
      </tbody></table>
      <p>Una vez iniciado, la aplicación estará disponible en <strong>http://localhost:5173/</strong></p>

      <h3>Primeros Pasos (5 minutos)</h3>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Acción</th><th>Resultado Esperado</th></tr></thead><tbody>
        <tr><td>1</td><td>Explorar el <strong>proyecto demo</strong></td><td>Proyecto precargado "Línea de Ensamble — Motor Eléctrico" con 6 estaciones</td></tr>
        <tr><td>2</td><td>Revisar <strong>Configuración</strong> (⚙️)</td><td>Ver cómo se calcula el Takt Time</td></tr>
        <tr><td>3</td><td>Explorar el <strong>Lienzo</strong> (🗺️)</td><td>Ver los bloques de proceso con sus Data Boxes</td></tr>
        <tr><td>4</td><td>Clic en <strong>"+ Nuevo Proyecto"</strong></td><td>Crear tu propio proyecto desde Inicio</td></tr>
      </tbody></table>
      <div class="manual-note"><span class="manual-note-icon">📝</span><span>La aplicación incluye un proyecto demo precargado con datos realistas de 6 estaciones de ensamble.</span></div>
    `
  },
  {
    id: 'navigation',
    num: 3,
    icon: '🧭',
    title: 'Navegación General',
    keywords: 'navegación sidebar barra lateral módulos interfaz persistencia datos localstorage',
    content: `
      <h3>3.1 Barra Lateral</h3>
      <p>La barra lateral izquierda contiene los 8 módulos de la aplicación:</p>
      <table class="manual-table"><thead><tr><th>Icono</th><th>Módulo</th><th>Descripción</th></tr></thead><tbody>
        <tr><td>🏠</td><td><strong>Inicio</strong></td><td>Dashboard principal y gestión de proyectos</td></tr>
        <tr><td>⚙️</td><td><strong>Configuración</strong></td><td>Demanda del cliente y Takt Time</td></tr>
        <tr><td>🗺️</td><td><strong>Lienzo VSM</strong></td><td>Mapeo visual del flujo de valor</td></tr>
        <tr><td>🔬</td><td><strong>Análisis</strong></td><td>Diagnóstico ADKAR y Sombra Digital</td></tr>
        <tr><td>🚀</td><td><strong>Ejecución</strong></td><td>Tablero Kaizen y matriz de habilidades</td></tr>
        <tr><td>🔗</td><td><strong>Integraciones</strong></td><td>Conexión con sistemas externos</td></tr>
        <tr><td>📊</td><td><strong>Dashboards</strong></td><td>Métricas operativas, ambientales y sociales</td></tr>
        <tr><td>📋</td><td><strong>Estándares</strong></td><td>SOPs, condiciones objetivo y auditorías</td></tr>
      </tbody></table>
      <div class="manual-tip"><span class="manual-tip-icon">💡</span><span>El indicador verde junto al nombre del módulo muestra la página activa. Los datos se guardan automáticamente en el navegador.</span></div>

      <h3>3.2 Persistencia de Datos</h3>
      <table class="manual-table"><thead><tr><th>Aspecto</th><th>Comportamiento</th></tr></thead><tbody>
        <tr><td><strong>Guardado</strong></td><td>Automático en cada cambio (localStorage)</td></tr>
        <tr><td><strong>Recarga</strong></td><td>Los datos persisten al recargar</td></tr>
        <tr><td><strong>Otro navegador</strong></td><td>Los datos NO se comparten entre navegadores</td></tr>
        <tr><td><strong>Limpieza de caché</strong></td><td>Se pierden los datos al limpiar caché</td></tr>
      </tbody></table>
      <div class="manual-important"><span class="manual-tip-icon">⚠️</span><span>Si limpias los datos del navegador, los proyectos se perderán permanentemente.</span></div>
    `
  },
  {
    id: 'home',
    num: 4,
    icon: '🏠',
    title: 'Módulo 0: Inicio — Gestión de Proyectos',
    keywords: 'inicio home proyecto crear activar tarjeta KPI takt lead time PCE gestión',
    content: `
      <h3>4.1 Pantalla Principal</h3>
      <p>La página de Inicio muestra:</p>
      <table class="manual-table"><thead><tr><th>Elemento</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>KPIs rápidos</strong></td><td>Takt Time, Lead Time, número de pasos y PCE del proyecto activo</td></tr>
        <tr><td><strong>Tarjetas de proyecto</strong></td><td>Con indicador del proyecto activo (punto verde)</td></tr>
        <tr><td><strong>Grid de módulos</strong></td><td>Acceso rápido a cada sección con descripción</td></tr>
      </tbody></table>

      <h3>4.2 Crear un Nuevo Proyecto</h3>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>
        <tr><td>1</td><td>Clic en <strong>"+ Nuevo Proyecto"</strong></td><td>Se despliega un formulario</td></tr>
        <tr><td>2</td><td>Ingresa el <strong>nombre</strong></td><td>Ej: "Línea de Soldadura A"</td></tr>
        <tr><td>3</td><td>Clic en <strong>"Crear Proyecto"</strong></td><td>Se crea con valores predeterminados</td></tr>
      </tbody></table>
      <p>El nuevo proyecto se creará con: Demanda 100 unid/día, 1 turno de 8 horas, sin pasos de proceso.</p>

      <h3>4.3 Cambiar de Proyecto Activo</h3>
      <p>Haz clic en cualquier tarjeta de proyecto para activarla. El punto verde indica el proyecto activo. <strong>Todos los módulos trabajan sobre el proyecto activo.</strong></p>
    `
  },
  {
    id: 'config',
    num: 5,
    icon: '⚙️',
    title: 'Módulo 1: Configuración de Demanda',
    keywords: 'configuración demanda takt time turnos horas descansos disponibilidad tiempo ciclo',
    content: `
      <h3>Propósito</h3>
      <p>Define los parámetros fundamentales que determinan el <strong>ritmo de producción requerido</strong> (Takt Time).</p>

      <h3>5.1 Demanda del Cliente</h3>
      <table class="manual-table"><thead><tr><th>Campo</th><th>Descripción</th><th>Ejemplo</th></tr></thead><tbody>
        <tr><td><strong>Cantidad Demandada</strong></td><td>Unidades que el cliente requiere</td><td>120</td></tr>
        <tr><td><strong>Período</strong></td><td>Frecuencia de la demanda (Día/Semana/Mes)</td><td>Por Día</td></tr>
      </tbody></table>
      <p>La <strong>demanda efectiva</strong> se muestra automáticamente debajo del formulario.</p>

      <h3>5.2 Tiempo de Trabajo Disponible</h3>
      <table class="manual-table"><thead><tr><th>Campo</th><th>Descripción</th><th>Ejemplo</th></tr></thead><tbody>
        <tr><td><strong>Turnos por Día</strong></td><td>Número de turnos de trabajo</td><td>2</td></tr>
        <tr><td><strong>Horas por Turno</strong></td><td>Duración de cada turno</td><td>8</td></tr>
        <tr><td><strong>Descansos (min)</strong></td><td>Tiempo total de descanso por día</td><td>60</td></tr>
        <tr><td><strong>Reuniones (min)</strong></td><td>Tiempo dedicado a reuniones diarias</td><td>15</td></tr>
      </tbody></table>
      <p>El cálculo muestra: <strong>Total Bruto</strong> − <strong>Deducciones</strong> = <strong>Disponible</strong></p>

      <h3>5.3 Takt Time</h3>
      <p>La tarjeta principal muestra el Takt Time calculado automáticamente:</p>
      <table class="manual-table"><thead><tr><th>Fórmula</th><th>Ejemplo</th></tr></thead><tbody>
        <tr><td><strong>Takt = Tiempo Disponible / Demanda</strong></td><td>Con 885 min y 120 unid → <strong>7.4 min/unidad</strong></td></tr>
      </tbody></table>
      <div class="manual-important"><span class="manual-tip-icon">⚠️</span><span>El Takt Time es la referencia central de toda la app. Se usa en el lienzo para identificar cuellos de botella y en la simulación para evaluar escenarios.</span></div>
    `
  },
  {
    id: 'canvas',
    num: 6,
    icon: '🗺️',
    title: 'Módulo 2: Lienzo de Mapeo VSM',
    keywords: 'lienzo canvas mapa flujo proceso bloque inventario timeline ciclo takt cuello botella data box estado actual futuro',
    content: `
      <h3>Propósito</h3>
      <p>El corazón de la aplicación. Construye visualmente el mapa del flujo de valor con bloques de proceso, triángulos de inventario y línea de tiempo.</p>

      <h3>6.1 Vista del Flujo</h3>
      <p>El flujo se muestra de izquierda a derecha: 🏭 Proveedor → [Inventario] → Paso 1 → [Inventario] → Paso 2 → ... → 👤 Cliente</p>
      <table class="manual-table"><thead><tr><th>Elemento</th><th>Representación</th><th>Significado</th></tr></thead><tbody>
        <tr><td><strong>Bloque de Proceso</strong></td><td>Rectángulo con Data Box</td><td>Estación de trabajo</td></tr>
        <tr><td><strong>Triángulo de Inventario</strong></td><td>▲ amarillo</td><td>WIP entre estaciones</td></tr>
        <tr><td><strong>Indicador Rojo 🔴</strong></td><td>En el bloque</td><td>Cuello de botella (C/T > Takt)</td></tr>
        <tr><td><strong>Flechas →</strong></td><td>Entre bloques</td><td>Dirección del flujo</td></tr>
      </tbody></table>

      <h3>6.2 Toggle Estado Actual / Futuro</h3>
      <p>Usa los botones <strong>"Estado Actual"</strong> y <strong>"Estado Futuro"</strong> para alternar entre vistas.</p>

      <h3>6.3 Agregar un Paso de Proceso</h3>
      <table class="manual-table"><thead><tr><th>Campo</th><th>Abreviación</th><th>Unidad</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>Nombre de la Estación</strong></td><td>—</td><td>Texto</td><td>Nombre descriptivo</td></tr>
        <tr><td><strong>Tiempo de Ciclo</strong></td><td>C/T</td><td>Segundos</td><td>Tiempo para procesar 1 unidad</td></tr>
        <tr><td><strong>Tiempo de Cambio</strong></td><td>C/O</td><td>Segundos</td><td>Changeover / setup</td></tr>
        <tr><td><strong>Calidad</strong></td><td>%C&A</td><td>0–1</td><td>First Pass Yield (ej: 0.95 = 95%)</td></tr>
        <tr><td><strong>Uptime</strong></td><td>—</td><td>0–1</td><td>Disponibilidad del equipo</td></tr>
        <tr><td><strong>Nº Operadores</strong></td><td>Ops</td><td>Entero</td><td>Personas asignadas</td></tr>
        <tr><td><strong>Inventario</strong></td><td>—</td><td>Unidades</td><td>WIP antes de este paso</td></tr>
        <tr><td><strong>Tiempo de Espera</strong></td><td>—</td><td>Segundos</td><td>Espera antes de procesar</td></tr>
        <tr><td><strong>Notas</strong></td><td>—</td><td>Texto</td><td>Observaciones libres</td></tr>
      </tbody></table>

      <h3>6.4 Editar o Eliminar un Paso</h3>
      <table class="manual-table"><thead><tr><th>Acción</th><th>Cómo</th></tr></thead><tbody>
        <tr><td><strong>Editar</strong></td><td>Clic sobre cualquier bloque de proceso en el mapa</td></tr>
        <tr><td><strong>Eliminar</strong></td><td>Dentro del modal de edición, clic en "Eliminar" (botón rojo)</td></tr>
      </tbody></table>

      <h3>6.5 Línea de Tiempo</h3>
      <table class="manual-table"><thead><tr><th>Segmento</th><th>Color</th><th>Significado</th></tr></thead><tbody>
        <tr><td><strong>Valor Agregado (VA)</strong></td><td>🟢 Verde</td><td>Tiempos de ciclo</td></tr>
        <tr><td><strong>Espera</strong></td><td>🟡 Amarillo</td><td>Tiempos entre estaciones</td></tr>
      </tbody></table>
      <p>Totales: Lead Time Total, Tiempo de Proceso, Tiempo de Espera, PCE</p>

      <h3>6.6 Gráfica Ciclo vs Takt</h3>
      <table class="manual-table"><thead><tr><th>Color</th><th>Significado</th></tr></thead><tbody>
        <tr><td>🟢 <strong>Verde</strong></td><td>Dentro del Takt</td></tr>
        <tr><td>🟡 <strong>Amarillo</strong></td><td>Cerca del límite (>85% del Takt)</td></tr>
        <tr><td>🔴 <strong>Rojo</strong></td><td>Excede el Takt (cuello de botella)</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'analysis',
    num: 7,
    icon: '🔬',
    title: 'Módulo 3: Análisis Avanzado',
    keywords: 'análisis ADKAR resistencia cambio sombra digital simulación escenarios radar conciencia deseo conocimiento habilidad refuerzo',
    content: `
      <h3>7.1 Pestaña: ADKAR — Diagnóstico de Resistencia al Cambio</h3>
      <p>El modelo ADKAR evalúa la preparación organizacional para el cambio:</p>
      <table class="manual-table"><thead><tr><th>Dimensión</th><th>Pregunta clave</th></tr></thead><tbody>
        <tr><td><strong>Conciencia</strong> (Awareness)</td><td>¿El equipo entiende POR QUÉ se necesita el cambio?</td></tr>
        <tr><td><strong>Deseo</strong> (Desire)</td><td>¿El equipo QUIERE participar en el cambio?</td></tr>
        <tr><td><strong>Conocimiento</strong> (Knowledge)</td><td>¿El equipo SABE cómo cambiar?</td></tr>
        <tr><td><strong>Habilidad</strong> (Ability)</td><td>¿El equipo PUEDE implementar el cambio?</td></tr>
        <tr><td><strong>Refuerzo</strong> (Reinforcement)</td><td>¿Hay mecanismos para SOSTENER el cambio?</td></tr>
      </tbody></table>

      <h4>Cómo usarlo</h4>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Acción</th><th>Resultado</th></tr></thead><tbody>
        <tr><td>1</td><td>Ajusta los <strong>sliders</strong> (1–5) por dimensión</td><td>El gráfico radar se actualiza</td></tr>
        <tr><td>2</td><td>Revisa la tarjeta de <strong>Resistencia</strong></td><td>Clasifica el tipo de resistencia</td></tr>
        <tr><td>3</td><td>Lee la <strong>Recomendación</strong></td><td>Acciones sugeridas para la dimensión más débil</td></tr>
      </tbody></table>

      <h4>Tipos de Resistencia</h4>
      <table class="manual-table"><thead><tr><th>Tipo</th><th>Promedio</th><th>Descripción</th></tr></thead><tbody>
        <tr><td>🟢 <strong>Neutral</strong></td><td>≥ 3</td><td>Equipo receptivo</td></tr>
        <tr><td>🟠 <strong>Encubierta</strong></td><td>≥ 3 pero una dimensión < 2</td><td>Resistencia oculta</td></tr>
        <tr><td>🟡 <strong>Pasiva</strong></td><td>2–3</td><td>Falta de entusiasmo</td></tr>
        <tr><td>🔴 <strong>Activa</strong></td><td>< 2</td><td>Oposición abierta</td></tr>
      </tbody></table>

      <h3>7.2 Pestaña: Sombra Digital — Simulación de Escenarios</h3>
      <p>Permite explorar <strong>"¿qué pasaría si...?"</strong> sin modificar los datos reales.</p>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Acción</th><th>Resultado</th></tr></thead><tbody>
        <tr><td>1</td><td>La tabla muestra todos los pasos con valores actuales</td><td>Referencia del estado actual</td></tr>
        <tr><td>2</td><td>Modifica <strong>C/T Simulado</strong>, <strong>C/O Simulado</strong> y <strong>Espera</strong></td><td>Crea un escenario hipotético</td></tr>
        <tr><td>3</td><td>Las <strong>4 tarjetas comparativas</strong> muestran impacto</td><td>Lead Time, Proceso, PCE, Cuello de Botella</td></tr>
        <tr><td>4</td><td>Valores en <strong>verde</strong> = mejora</td><td>Valores en <strong>amarillo</strong> = neutral o peor</td></tr>
        <tr><td>5</td><td>Clic en <strong>"Resetear"</strong></td><td>Borra los cambios simulados</td></tr>
      </tbody></table>
      <div class="manual-tip"><span class="manual-tip-icon">💡</span><span>Usa la simulación para justificar inversiones: "Si reducimos el C/O de Bobinado de 40 a 20 min, el Lead Time baja de 27.5 a 22 hrs."</span></div>
    `
  },
  {
    id: 'execution',
    num: 8,
    icon: '🚀',
    title: 'Módulo 4: Ejecución y Gestión Lean',
    keywords: 'ejecución kaizen kanban roadmap habilidades matriz capacitación operador tarea prioridad evento mejora',
    content: `
      <h3>8.1 Pestaña: Kaizen — Tablero de Eventos</h3>
      <p>Un <strong>tablero Kanban</strong> de tres columnas para gestionar iniciativas de mejora:</p>
      <table class="manual-table"><thead><tr><th>Columna</th><th>Estados</th></tr></thead><tbody>
        <tr><td><strong>Por Hacer</strong></td><td>Eventos identificados pero no iniciados</td></tr>
        <tr><td><strong>En Progreso</strong></td><td>Eventos actualmente en ejecución</td></tr>
        <tr><td><strong>Completado</strong></td><td>Eventos terminados</td></tr>
      </tbody></table>

      <h4>Crear un Evento Kaizen</h4>
      <table class="manual-table"><thead><tr><th>Campo</th><th>Tipo</th><th>Ejemplo</th></tr></thead><tbody>
        <tr><td><strong>Título</strong></td><td>Texto</td><td>Descripción breve de la mejora</td></tr>
        <tr><td><strong>Prioridad</strong></td><td>Alta / Media / Baja</td><td>Bordes de color: 🔴 Alta, 🟡 Media, 🟢 Baja</td></tr>
        <tr><td><strong>Responsable</strong></td><td>Texto</td><td>Persona asignada</td></tr>
        <tr><td><strong>Fecha Límite</strong></td><td>Fecha</td><td>Deadline del evento</td></tr>
      </tbody></table>

      <h4>Gestión de Tarjetas</h4>
      <table class="manual-table"><thead><tr><th>Acción</th><th>Cómo</th></tr></thead><tbody>
        <tr><td><strong>Mover</strong></td><td>Botones ← y → en cada tarjeta</td></tr>
        <tr><td><strong>Eliminar</strong></td><td>Botón ✕ en rojo</td></tr>
      </tbody></table>

      <h3>8.2 Pestaña: Roadmap — Plan de Implementación</h3>
      <table class="manual-table"><thead><tr><th>Fase</th><th>Enfoque</th><th>Duración</th><th>Kaizen Asociados</th></tr></thead><tbody>
        <tr><td><strong>Fase 1: Estabilización</strong></td><td>Reducir variabilidad en cuellos de botella</td><td>4–6 sem.</td><td>Prioridad Alta</td></tr>
        <tr><td><strong>Fase 2: Flujo Continuo</strong></td><td>Pull, FIFO, reducción WIP</td><td>6–8 sem.</td><td>Prioridad Media</td></tr>
        <tr><td><strong>Fase 3: Optimización</strong></td><td>Ajustar al Takt, capacitación cruzada</td><td>8–12 sem.</td><td>Prioridad Baja</td></tr>
      </tbody></table>

      <h3>8.3 Pestaña: Habilidades — Matriz de Capacitación</h3>
      <p>Una <strong>matriz Operador × Tarea</strong> con niveles de competencia de 0 a 4.</p>
      <table class="manual-table"><thead><tr><th>Nivel</th><th>Etiqueta</th><th>Color</th></tr></thead><tbody>
        <tr><td>0</td><td>Sin entrenar</td><td>Gris</td></tr>
        <tr><td>1</td><td>Aprendiz</td><td>Rojo</td></tr>
        <tr><td>2</td><td>Capaz</td><td>Amarillo</td></tr>
        <tr><td>3</td><td>Competente</td><td>Verde</td></tr>
        <tr><td>4</td><td>Experto</td><td>Teal</td></tr>
      </tbody></table>
      <table class="manual-table"><thead><tr><th>Acción</th><th>Cómo</th></tr></thead><tbody>
        <tr><td><strong>Agregar operador</strong></td><td>Clic en "+ Operador" → ingresa nombre</td></tr>
        <tr><td><strong>Agregar tarea</strong></td><td>Clic en "+ Tarea" → ingresa nombre</td></tr>
        <tr><td><strong>Cambiar nivel</strong></td><td>Clic sobre la celda (cicla 0→1→2→3→4→0)</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'integrations',
    num: 9,
    icon: '🔗',
    title: 'Módulo 5: Hub de Integraciones',
    keywords: 'integraciones SCADA ERP IoT Jira GitLab ServiceNow API conexión simulada manufactura software',
    content: `
      <h3>Propósito</h3>
      <p>Configura conexiones con sistemas externos. En esta versión, las <strong>conexiones son simuladas</strong> pero la interfaz captura toda la configuración para una integración real.</p>

      <h3>9.1 Categoría: Manufactura</h3>
      <table class="manual-table"><thead><tr><th>Sistema</th><th>Uso</th><th>Campo</th></tr></thead><tbody>
        <tr><td><strong>SCADA / PLC</strong></td><td>Métricas en tiempo real</td><td>URL endpoint WebSocket</td></tr>
        <tr><td><strong>ERP / MRP</strong></td><td>Sincronizar demanda e inventarios</td><td>URL endpoint REST</td></tr>
        <tr><td><strong>Sensores IoT</strong></td><td>Temperatura, vibración, consumo</td><td>Broker MQTT</td></tr>
      </tbody></table>

      <h3>9.2 Categoría: Software & TI</h3>
      <table class="manual-table"><thead><tr><th>Sistema</th><th>Uso</th><th>Campos</th></tr></thead><tbody>
        <tr><td><strong>Jira</strong></td><td>Ciclo de desarrollo</td><td>API Key + Proyecto</td></tr>
        <tr><td><strong>GitLab</strong></td><td>Lead time de MRs, MTTR</td><td>Token + Proyecto ID</td></tr>
        <tr><td><strong>ServiceNow</strong></td><td>Gestión de incidentes</td><td>API Key + Instancia</td></tr>
      </tbody></table>

      <h3>9.3 Cómo Configurar</h3>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Acción</th><th>Resultado</th></tr></thead><tbody>
        <tr><td>1</td><td>Clic en <strong>"Inactivo"</strong></td><td>Activa la integración</td></tr>
        <tr><td>2</td><td>Completa los campos de configuración</td><td>Ingresa credenciales / URLs</td></tr>
        <tr><td>3</td><td>Clic en <strong>"🔌 Probar Conexión"</strong></td><td>Simula la conexión</td></tr>
        <tr><td>4</td><td>Revisa indicador de estado</td><td>🟢 Conectado | 🔴 Error | ⚫ Desconectado</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'dashboards',
    num: 10,
    icon: '📊',
    title: 'Módulo 6: Dashboards 360°',
    keywords: 'dashboard métricas KPI operativas green VSM social lead time PCE energía CO2 agua residuos bienestar seguridad sostenibilidad',
    content: `
      <h3>10.1 Pestaña: Operativas</h3>
      <table class="manual-table"><thead><tr><th>Métrica</th><th>Fórmula</th><th>Significado</th></tr></thead><tbody>
        <tr><td><strong>Lead Time</strong></td><td>Σ(C/T + Espera)</td><td>Tiempo total puerta a puerta</td></tr>
        <tr><td><strong>Tiempo Proceso</strong></td><td>Σ(C/T)</td><td>Solo valor agregado</td></tr>
        <tr><td><strong>PCE</strong></td><td>Proc / Lead × 100</td><td>Eficiencia del flujo</td></tr>
        <tr><td><strong>Takt Time</strong></td><td>Disponible / Demanda</td><td>Ritmo requerido</td></tr>
      </tbody></table>
      <p>Gráficas incluidas: Ciclo vs Cambio, Calidad %, Inventario WIP por estación.</p>

      <h3>10.2 Pestaña: Green VSM</h3>
      <p>Ingresa manualmente los datos de impacto ambiental:</p>
      <table class="manual-table"><thead><tr><th>Métrica</th><th>Unidad</th><th>Icono</th></tr></thead><tbody>
        <tr><td><strong>Energía</strong></td><td>kWh</td><td>⚡</td></tr>
        <tr><td><strong>CO₂</strong></td><td>kg</td><td>🌫️</td></tr>
        <tr><td><strong>Agua</strong></td><td>Litros</td><td>💧</td></tr>
        <tr><td><strong>Residuos</strong></td><td>kg</td><td>🗑️</td></tr>
      </tbody></table>
      <p>El <strong>Índice de Sostenibilidad</strong> (0–100): 🟢 ≥70 | 🟡 40–70 | 🔴 <40</p>

      <h3>10.3 Pestaña: Social</h3>
      <table class="manual-table"><thead><tr><th>Métrica</th><th>Tipo</th><th>Referencia</th></tr></thead><tbody>
        <tr><td>🛡️ <strong>Incidentes Seguridad</strong></td><td>Número</td><td>0 = excelente</td></tr>
        <tr><td>🦴 <strong>Riesgo Ergonómico</strong></td><td>Bajo/Medio/Alto</td><td>Cualitativo</td></tr>
        <tr><td>🔄 <strong>Tasa de Rotación</strong></td><td>0–1</td><td><0.10 = saludable</td></tr>
        <tr><td>😊 <strong>Bienestar Equipo</strong></td><td>1–5</td><td>≥4 = positivo</td></tr>
      </tbody></table>
      <div class="manual-important"><span class="manual-tip-icon">⚠️</span><span>Si el bienestar cae por debajo de 3/5, se activa una <strong>Alerta de Burnout</strong> automática.</span></div>
    `
  },
  {
    id: 'standards',
    num: 11,
    icon: '📋',
    title: 'Módulo 7: Estandarización y Mejora Continua',
    keywords: 'estándares SOP procedimiento condiciones objetivo Toyota Kata auditoría checklist cumplimiento ciclo mejora',
    content: `
      <h3>11.1 Pestaña: SOPs</h3>
      <p>Documenta procedimientos operativos estándar. Cada SOP incluye:</p>
      <table class="manual-table"><thead><tr><th>Campo</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>Título</strong></td><td>Nombre del procedimiento</td></tr>
        <tr><td><strong>Proceso/Estación</strong></td><td>Área donde aplica</td></tr>
        <tr><td><strong>Secuencia de Trabajo</strong></td><td>Pasos detallados del procedimiento</td></tr>
        <tr><td><strong>Tiempos</strong></td><td>Tiempo estándar por paso</td></tr>
        <tr><td><strong>Puntos Clave</strong></td><td>Aspectos críticos del procedimiento</td></tr>
        <tr><td><strong>Notas de Seguridad</strong></td><td>Precauciones y EPP requerido</td></tr>
      </tbody></table>

      <h3>11.2 Pestaña: Condiciones Objetivo</h3>
      <p>Define metas medibles estilo <strong>Toyota Kata</strong>:</p>
      <table class="manual-table"><thead><tr><th>Campo</th><th>Descripción</th><th>Ejemplo</th></tr></thead><tbody>
        <tr><td><strong>Métrica</strong></td><td>Indicador a mejorar</td><td>Lead Time</td></tr>
        <tr><td><strong>Valor Actual</strong></td><td>Punto de partida</td><td>27.5 hrs</td></tr>
        <tr><td><strong>Valor Objetivo</strong></td><td>Meta a alcanzar</td><td>20 hrs</td></tr>
        <tr><td><strong>Fecha Límite</strong></td><td>Deadline</td><td>2026-04-15</td></tr>
        <tr><td><strong>Responsable</strong></td><td>Dueño de la meta</td><td>Ing. Carlos Ruiz</td></tr>
        <tr><td><strong>Estado</strong></td><td>En Progreso / Alcanzado</td><td>En Progreso</td></tr>
      </tbody></table>
      <div class="manual-tip"><span class="manual-tip-icon">💡</span><span>Al alcanzar una meta (estado "Alcanzado"), el botón <strong>"🔄 Nuevo Ciclo"</strong> crea automáticamente la siguiente con el valor alcanzado como nuevo punto de partida.</span></div>

      <h3>11.3 Pestaña: Auditoría</h3>
      <p>Checklist de 6 ítems de cumplimiento diario con indicador de porcentaje y recomendación automática:</p>
      <table class="manual-table"><thead><tr><th>Rango</th><th>Clasificación</th><th>Acción</th></tr></thead><tbody>
        <tr><td>🟢 ≥80%</td><td>Excelente cumplimiento</td><td>Mantener el estándar</td></tr>
        <tr><td>🟡 50–79%</td><td>Requiere mejora</td><td>Acciones correctivas</td></tr>
        <tr><td>🔴 <50%</td><td>Crítico</td><td>Reunión urgente del equipo de mejora</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'glossary',
    num: 12,
    icon: '📖',
    title: 'Glosario Lean',
    keywords: 'glosario términos definiciones takt time lead time ciclo PCE OEE WIP ADKAR kaizen 5S kata FIFO pull sombra digital green VSM',
    content: `
      <table class="manual-table"><thead><tr><th>Término</th><th>Definición</th></tr></thead><tbody>
        <tr><td><strong>Takt Time</strong></td><td>Ritmo al que debe producirse para satisfacer la demanda del cliente</td></tr>
        <tr><td><strong>Lead Time</strong></td><td>Tiempo total desde entrada de material hasta salida del producto</td></tr>
        <tr><td><strong>Cycle Time (C/T)</strong></td><td>Tiempo para completar una unidad en una estación</td></tr>
        <tr><td><strong>Changeover (C/O)</strong></td><td>Tiempo de preparación / cambio de modelo</td></tr>
        <tr><td><strong>PCE</strong></td><td>Process Cycle Efficiency — % del Lead Time que agrega valor</td></tr>
        <tr><td><strong>OEE</strong></td><td>Overall Equipment Effectiveness</td></tr>
        <tr><td><strong>WIP</strong></td><td>Work in Process — Inventario entre estaciones</td></tr>
        <tr><td><strong>%C&A</strong></td><td>Complete & Accurate — First Pass Yield</td></tr>
        <tr><td><strong>ADKAR</strong></td><td>Modelo de gestión del cambio (Prosci): Awareness, Desire, Knowledge, Ability, Reinforcement</td></tr>
        <tr><td><strong>Kaizen</strong></td><td>Mejora continua incremental (japonés: "cambio para mejor")</td></tr>
        <tr><td><strong>5S</strong></td><td>Metodología de orden y limpieza</td></tr>
        <tr><td><strong>Kata</strong></td><td>Patrón de mejora científica de Toyota</td></tr>
        <tr><td><strong>FIFO</strong></td><td>First In, First Out</td></tr>
        <tr><td><strong>Pull</strong></td><td>Sistema donde el proceso posterior "jala" del anterior</td></tr>
        <tr><td><strong>Sombra Digital</strong></td><td>Réplica virtual simplificada para simulación</td></tr>
        <tr><td><strong>Green VSM</strong></td><td>Extensión del VSM con métricas ambientales</td></tr>
        <tr><td><strong>localStorage</strong></td><td>Almacenamiento del navegador que guarda datos entre sesiones</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'faq',
    num: 13,
    icon: '❓',
    title: 'Preguntas Frecuentes',
    keywords: 'preguntas frecuentes faq dudas ayuda resetear exportar editar múltiples proyectos',
    content: `
      <table class="manual-table"><thead><tr><th>Nº</th><th>Pregunta</th><th>Respuesta</th></tr></thead><tbody>
        <tr><td>1</td><td><strong>¿Cómo cambio de proyecto?</strong></td><td>Navega a Inicio y haz clic en la tarjeta del proyecto deseado.</td></tr>
        <tr><td>2</td><td><strong>¿Puedo tener múltiples proyectos?</strong></td><td>Sí. Cada proyecto tiene sus propios datos, pero solo uno está activo a la vez.</td></tr>
        <tr><td>3</td><td><strong>¿Dónde se guardan los datos?</strong></td><td>En el localStorage del navegador. Son locales a ese navegador.</td></tr>
        <tr><td>4</td><td><strong>¿Cómo reseteo los datos?</strong></td><td>Consola del navegador: <code>localStorage.removeItem('nexia-vsm-data')</code> y recarga.</td></tr>
        <tr><td>5</td><td><strong>¿La simulación modifica datos reales?</strong></td><td>No. La Sombra Digital es independiente de los datos del proyecto.</td></tr>
        <tr><td>6</td><td><strong>¿Qué es el PCE?</strong></td><td>Process Cycle Efficiency = (Tiempo de Proceso / Lead Time) × 100. Cuanto mayor, mejor.</td></tr>
        <tr><td>7</td><td><strong>¿Cómo identifico un cuello de botella?</strong></td><td>En el Lienzo, los pasos con C/T > Takt se marcan en rojo 🔴.</td></tr>
        <tr><td>8</td><td><strong>¿Las integraciones son funcionales?</strong></td><td>En v1.0 son simuladas. La configuración se guarda para uso futuro.</td></tr>
        <tr><td>9</td><td><strong>¿Puedo exportar los datos?</strong></td><td>Actualmente no hay exportación nativa. Puedes copiar del localStorage por consola.</td></tr>
        <tr><td>10</td><td><strong>¿Qué hacer si el bienestar baja de 3?</strong></td><td>Se activa una alerta de burnout. Revisa las condiciones del equipo.</td></tr>
      </tbody></table>
      <div class="manual-tip"><span class="manual-tip-icon">💡</span><span><strong>NexIA VSM v1.0.0</strong> — Plataforma integral de Mapeo de Flujo de Valor. Parte de la suite <strong>Nexia</strong> de aplicaciones Lean.</span></div>
    `
  }
];
