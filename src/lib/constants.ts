import { PUBLIC_BACKEND_URL } from "$env/static/public"

export const siteInfo = {
    siteName: 'Soketi-Fastify Chat App'
}

export const backendUrl = PUBLIC_BACKEND_URL
export const getBackendHeaders = (token: string | null | undefined) => {
    return {
        'x-access-token': token,
        // "Content-Type": "application/json",
    }
} 
