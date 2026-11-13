import { AuthService } from "./classes/auth.service";

const authService = new AuthService();
const loginForm = document.getElementById("form-login") as HTMLFormElement;
const errorInfo = document.getElementById("errorInfo") as HTMLParagraphElement;

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorInfo.textContent = "";

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
        await authService.login(email, password);
        location.assign("index.html");
    } catch (error: any) {
        const message = error?.error || error?.message || "Email or password incorrect";
        errorInfo.textContent = message;
        alert(message);
    }
});