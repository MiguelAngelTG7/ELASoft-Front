# ELASoft Frontend (React)

Este repositorio contiene el frontend de ELASoft, un sistema académico para la gestión de estudios bíblicos de adultos en la iglesia local. El frontend está construido con React y Vite, y está preparado para conectarse a un backend y base de datos desplegados en Render.

---

## Requisitos previos
- Node.js (v18+ recomendado)
- npm (v9+ recomendado)

---

## Instalación y uso local

1. Clona este repositorio:
   ```bash
   git clone <URL-del-repo-frontend>
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de `frontend/` con la siguiente variable (ajusta la URL a la de tu backend en Render):
   ```env
   VITE_API_URL=https://<tu-backend-en-render>.onrender.com/api/
   ```
4. Inicia la app en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## Configuración para producción (Vercel)
- El frontend está listo para ser desplegado en Vercel.
- Configura la variable de entorno `VITE_API_URL` en Vercel con la URL pública de tu backend en Render.
- El archivo `vite.config.js` puede usar esta variable para enrutar las peticiones API.

---

## Conexión con el backend
- Todas las llamadas a la API usan la variable `VITE_API_URL` como base.
- Edita `src/services/api.jsx` para asegurar que use:
  ```js
  baseURL: import.meta.env.VITE_API_URL
  ```
- Ejemplo de configuración:
  ```js
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
  ```

---

## Buenas prácticas
- No subas archivos `.env` ni `node_modules` al repositorio (ver `.gitignore`).
- Usa variables de entorno para URLs y credenciales.
- Revisa y actualiza dependencias regularmente.

---

## Despliegue rápido en Vercel
1. Sube este repositorio a GitHub.
2. Conecta el repo a Vercel y configura la variable `VITE_API_URL`.
3. Vercel detectará automáticamente el framework y construirá la app.

---

## Créditos
Desarrollado por el equipo de Aletheia Systems, 2025.
