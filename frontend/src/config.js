// base url for the backend. in dev we use localhost. when you deploy, set VITE_API_URL in .env to your backend url (vite only reads env vars that start with VITE_).
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
