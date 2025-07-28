# Capturas de Pantalla - Sistema de Gestión de Estudiantes

Este directorio contiene todas las capturas de pantalla utilizadas en la documentación del proyecto.

## 🧪 Capturas de Testing

### tests-success.png
**Descripción**: Ejecución exitosa de todas las pruebas unitarias
- **Contexto**: Resultado de `npm test`
- **Contenido**: 
  - Karma test runner en acción
  - 19 pruebas ejecutadas exitosamente
  - Tiempo total: 2.1 segundos
  - Estado final: SUCCESS
- **Resolución**: 1920x1080
- **Formato**: PNG

### login-tests.png
**Descripción**: Pruebas específicas del componente Login
- **Contexto**: Detalle de las pruebas de autenticación
- **Contenido**:
  - Suite "Login - Pruebas Básicas"
  - Test: "debe hacer login correctamente" ✅
  - Test: "debe manejar error de login" ✅
  - Detalles de spies y aserciones
- **Resolución**: 1920x1080
- **Formato**: PNG

### coverage-report.png
**Descripción**: Reporte de cobertura de código
- **Contexto**: Resultado de `npm run test:coverage`
- **Contenido**:
  - Tabla de cobertura por archivo
  - Porcentajes de líneas, funciones y ramas
  - Indicadores visuales de cobertura
  - Métricas totales >80%
- **Resolución**: 1920x1080
- **Formato**: PNG

### test-watch.png
**Descripción**: Modo watch para desarrollo
- **Contexto**: `npm run test:watch` en ejecución
- **Contenido**:
  - Terminal con modo watch activo
  - Mensaje "Watching for file changes..."
  - Navegador Chrome conectado
  - Re-ejecución automática de pruebas
- **Resolución**: 1920x1080
- **Formato**: PNG

## 📱 Capturas de la Aplicación

### dashboard.png
**Descripción**: Panel principal del sistema
- **Contexto**: Vista principal tras login exitoso
- **Contenido**:
  - Estadísticas generales
  - Gráficos de resumen
  - Navegación principal
  - Información del usuario logueado

### estudiantes.png
**Descripción**: Módulo de gestión de estudiantes
- **Contexto**: Página de administración de estudiantes
- **Contenido**:
  - Lista de estudiantes
  - Formularios CRUD
  - Filtros y búsqueda
  - Paginación

### finanzas.png
**Descripción**: Sistema financiero
- **Contexto**: Gestión de aspectos financieros
- **Contenido**:
  - Información de pagos
  - Becas y descuentos
  - Reportes financieros
  - Estados de cuenta

### admin-panel.png
**Descripción**: Panel de administración
- **Contexto**: Vista exclusiva para administradores
- **Contenido**:
  - Gestión de usuarios
  - Configuración del sistema
  - Reportes avanzados
  - Herramientas administrativas

## 🎨 Especificaciones Técnicas

### Formato de Archivos
- **Tipo**: PNG (para mejor calidad)
- **Resolución**: 1920x1080 (Full HD)
- **Compresión**: Optimizada para web
- **Tamaño máximo**: 2MB por imagen

### Herramientas Recomendadas
- **Windows**: Herramienta de recortes, Lightshot
- **Mac**: Cmd + Shift + 4, CleanShot X
- **Linux**: Screenshot/Gnome Screenshot, Flameshot
- **Navegador**: Extensions de captura de pantalla

### Directrices de Captura
1. **Usar tema claro** para mejor legibilidad
2. **Incluir chrome del navegador** cuando sea relevante
3. **Mostrar datos de ejemplo** realistas
4. **Resaltar funcionalidades clave** con anotaciones si es necesario
5. **Mantener consistencia visual** entre capturas

## 📝 Proceso de Actualización

### Para Capturas de Testing
1. Ejecutar `npm test`
2. Capturar resultados en navegador (http://localhost:9876)
3. Capturar terminal con salida de pruebas
4. Generar reporte de cobertura: `npm run test:coverage`
5. Capturar reporte HTML de cobertura

### Para Capturas de Aplicación
1. Ejecutar `npm start`
2. Navegar a http://localhost:4200
3. Hacer login con usuario de prueba
4. Navegar a cada sección principal
5. Capturar pantallas con datos de ejemplo

### Checklist de Calidad
- [ ] Resolución correcta (1920x1080)
- [ ] Sin información sensible visible
- [ ] Interfaz completamente cargada
- [ ] Datos de ejemplo apropiados
- [ ] Consistencia con otras capturas
- [ ] Tamaño de archivo optimizado (<2MB)
- [ ] Nombres de archivo descriptivos
