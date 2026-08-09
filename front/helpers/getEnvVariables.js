export const getEnvVariables = () => {
    return {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_SOCKET: import.meta.env.VITE_SOCKET,
    }
}

export default getEnvVariables