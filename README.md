# Sistema de Gestión de Estudiantes - Frontend

Un sistema completo de gestión académica desarrollado con Angular 18 que permite administrar estudiantes, materias, información financiera y empresas educativas.

## 🚀 Características

- **Gestión de Estudiantes**: CRUD completo con información académica y personal
- **Administración de Materias**: Control de asignaturas y estados académicos
- **Sistema Financiero**: Gestión de pensiones, becas y pagos
- **Gestión de Empresas**: Información institucional y configuración
- **Panel de Administración**: Dashboard completo para administradores
- **Autenticación y Autorización**: Sistema de login con roles
- **Diseño Responsivo**: Interfaz adaptable a dispositivos móviles
- **Tema Oscuro**: Alternancia entre modo claro y oscuro

## 🛠 Tecnologías

- **Angular 18** - Framework principal
- **PrimeNG 18** - Componentes UI
- **TypeScript** - Lenguaje de programación
- **Tailwind CSS** - Framework de estilos
- **RxJS** - Programación reactiva
- **Angular Router** - Navegación y rutas

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/ErickQuizhpe/estudiante_api.git
cd estudiante_api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `src/app/environment.ts`:
```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api', // URL del backend
  production: false
};
```

### 4. Ejecutar la aplicación
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🌐 Enlaces de Despliegue

### Frontend
- **Producción**: [https://estudiantes-app.vercel.app](https://estudiantes-app.vercel.app)
- **Desarrollo**: [https://dev-estudiantes.vercel.app](https://dev-estudiantes.vercel.app)

### Backend API
- **Producción**: [https://api-estudiantes.herokuapp.com](https://api-estudiantes.herokuapp.com)
- **Documentación API**: [https://api-estudiantes.herokuapp.com/swagger-ui](https://api-estudiantes.herokuapp.com/swagger-ui)

### Monitoreo y Analytics
- **Dashboard de Monitoreo**: [https://dashboard.vercel.app/estudiantes](https://dashboard.vercel.app/estudiantes)
- **Analytics**: [https://analytics.google.com/web/#/realtime](https://analytics.google.com/web/#/realtime)
- **Logs de Sistema**: [https://logs.heroku.com/apps/api-estudiantes](https://logs.heroku.com/apps/api-estudiantes)

## 📸 Capturas de Pantalla

### Dashboard Principal
![Dashboard](./docs/screenshots/dashboard.png)

### Gestión de Estudiantes
![Estudiantes](./docs/screenshots/estudiantes.png)

### Sistema Financiero
![Finanzas](./docs/screenshots/finanzas.png)

### Panel de Administración
![Admin Panel](./docs/screenshots/admin-panel.png)

## 🔨 Scripts Disponibles

```bash
# Desarrollo
npm start                 # Ejecutar en modo desarrollo
npm run build            # Construir para producción
npm run test             # Ejecutar pruebas unitarias
npm run e2e              # Ejecutar pruebas end-to-end
npm run lint             # Verificar código con ESLint

# Despliegue
npm run build:prod       # Construir optimizado para producción
npm run deploy           # Desplegar a Vercel
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── navbar/
│   │   ├── footer/
│   │   └── dark-mode-switch/
│   ├── pages/              # Páginas principales
│   │   ├── home/
│   │   ├── students/
│   │   ├── materias/
│   │   ├── financial/
│   │   └── admin/
│   ├── services/           # Servicios HTTP
│   │   ├── student-service.ts
│   │   ├── financial-service.ts
│   │   └── auth-service.ts
│   ├── models/             # Interfaces TypeScript
│   ├── guards/             # Guards de autenticación
│   └── interceptors/       # Interceptores HTTP
├── assets/                 # Recursos estáticos
└── environments/           # Configuración de entornos
```

## 🔒 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

1. **Login**: `POST /api/auth/login`
2. **Registro**: `POST /api/auth/register`
3. **Refresh Token**: `POST /api/auth/refresh`

### Roles de Usuario
- **Admin**: Acceso completo al sistema
- **Profesor**: Gestión de materias y calificaciones
- **Estudiante**: Acceso de solo lectura a su información

## 🌍 Variables de Entorno

```typescript
// src/app/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authTokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token'
};
```

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Netlify
```bash
# Construir
npm run build

# Desplegar carpeta dist/
```

## 🧪 Testing

### Pruebas Unitarias
```bash
npm run test
npm run test:coverage    # Con cobertura
```

### Pruebas E2E
```bash
npm run e2e
```

## 📊 Monitoreo y Performance

### Métricas Clave
- **Tiempo de Carga**: < 3 segundos
- **Performance Score**: > 90
- **Accesibilidad**: > 95
- **SEO**: > 90

### Herramientas de Monitoreo
- Google Analytics
- Vercel Analytics
- Lighthouse CI
- Error Tracking con Sentry

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Estándares de Código
- Seguir guías de estilo de Angular
- Usar TypeScript estricto
- Mantener cobertura de pruebas > 80%
- Documentar funciones públicas

## 📝 Changelog

### v1.0.0 (2025-01-27)
- ✅ Sistema completo de gestión de estudiantes
- ✅ Módulo financiero con gestión de pagos
- ✅ Panel de administración
- ✅ Autenticación JWT
- ✅ Diseño responsivo con PrimeNG

## 👥 Equipo de Desarrollo

- **Erick Quizhpe** - Desarrollador Principal
- **Email**: erick.quizhpe@email.com
- **GitHub**: [@ErickQuizhpe](https://github.com/ErickQuizhpe)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

¿Necesitas ayuda? Contacta a través de:

- **Issues**: [GitHub Issues](https://github.com/ErickQuizhpe/estudiante_api/issues)
- **Email**: soporte@estudiantes-app.com
- **Discord**: [Servidor de Soporte](https://discord.gg/estudiantes)

## ⭐ Roadmap

### v1.1.0 (Próximamente)
- [ ] Sistema de notificaciones en tiempo real
- [ ] Exportación de reportes PDF
- [ ] Integración con sistemas de pago
- [ ] API GraphQL

### v1.2.0 (Futuro)
- [ ] Aplicación móvil React Native
- [ ] Dashboard avanzado con gráficos
- [ ] Sistema de backup automático
- [ ] Integración con Google Classroom
