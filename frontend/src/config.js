/**
 * API base URL for backend requests.
 * In production, set VITE_API_URL in .env (e.g. https://your-api.onrender.com).
 * Vite only exposes env vars prefixed with VITE_.
 */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
