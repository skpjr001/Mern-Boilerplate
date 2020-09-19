export const IS_DEVELOPMENT = window.location.hostname === 'localhost'
export const IS_PRODUCTION = !IS_DEVELOPMENT

const API_URL = IS_PRODUCTION ? '' : 'http://localhost:1337'

// Api Call Utility
export async function apiCall(Path, Payload) {

    
    const res = await fetch(`${API_URL}${Path}`, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(Payload)
    }).then((t) => t.json())

    return res;
}

// Json web token authentication Utility
export async function authenticate() {

    const res = await fetch()
}