import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api"

/** Public API client — the shop only calls unauthenticated `/shop/*` routes, so unlike the
 *  portal there's no auth header and no 401 → /login redirect. */
export const apiClient = axios.create({ baseURL: API_BASE_URL })
