export function getBaseURL(){
    return import.meta.env.VITE_SERVER_URL;
}

export function saveAuthToken(token){
    localStorage.setItem('token', token);
}

export function getAuthToken(){
    const token = localStorage.getItem('token');
    return token;
}

export function removeAuthToken(){
    localStorage.removeItem('token');
}

export function saveSecurityPin(securityPin){
    sessionStorage.setItem('security-pin', securityPin);
}

export function getSecurityPin(){
    const securityPin = sessionStorage.getItem('security-pin');
    return securityPin;
}

export function removeSecurityPin(){
    sessionStorage.removeItem('security-pin');
}

export function decodeToken(token) {
    try {
        if(!token){
            return null;
        }
        const base64Url = token.split('.')[1]; // Get the payload part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64URL to Base64
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload); // Parse JSON payload
    } 
    catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
