import decode from 'jwt-decode';

const USER_TOKEN = 'user_token';

class AuthService {
    static getToken() {
        return localStorage.getItem(USER_TOKEN);
    }

    static getProfile() {
        return decode(AuthService.getToken());
    }

    static isTokenExpired(token) {
        const decodedToken = decode(token);

        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem(USER_TOKEN);
            return true;
        }

        return false;
    }

    static isLoggedIn() {
        const token = AuthService.getToken();

        if (token && !AuthService.isTokenExpired(token)) {
            return true;
        }

        return false;
    }

    static login(token) {
        localStorage.setItem(USER_TOKEN, token);
        // Redirect back to the page they were trying to access or home if referrer is empty
        window.location.assign(document.referrer || '/');
    }

    static logout() {
        localStorage.removeItem(USER_TOKEN);
        window.location.reload();
    }
}

export default AuthService;