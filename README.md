# Frontend - Escuela de Liderazgo Alianza (ELA)

Este proyecto es el frontend de la Escuela de Liderazgo Alianza, desarrollado en React y desplegado en Vercel.

## Requisitos
- Node.js >= 18
- npm o yarn

## Instalación local
1. Clona el repositorio y entra a la carpeta `frontend`.
2. Instala dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```
3. Crea un archivo `.env` en la raíz de `frontend` con:
   ```env
   VITE_API_URL=https://elasoft-back.onrender.com/api/
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

## Despliegue en Vercel
- El frontend está desplegado en: https://ela-soft-front.vercel.app/
- Configura la variable de entorno `VITE_API_URL` en Vercel con la URL de tu backend.

## Estructura principal
- `src/pages/` — Páginas principales (Login, Dashboard, etc.)
- `src/services/api.jsx` — Configuración de Axios para llamadas a la API

## Notas
- El frontend consume la API del backend desplegado en Render.
- Si el backend está dormido, la primera petición puede demorar unos segundos.

---

# English
This is the React frontend for the ELA project. See instructions above for local development and deployment.
