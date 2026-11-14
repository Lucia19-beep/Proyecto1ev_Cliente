import { AuthService } from "./classes/auth.service";
import { MyGeolocation } from "./classes/my-geolocation";

const authService = new AuthService();

const registerForm = document.getElementById("form-register") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const emailRepeatInput = document.getElementById("email2") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const latitudeInput = document.getElementById("lat") as HTMLInputElement;
const longitudeInput = document.getElementById("lng") as HTMLInputElement;
const imageInput = document.getElementById("photo") as HTMLInputElement;
const imagePreview = document.getElementById("photo") as HTMLImageElement;

let photoBase64 = "";

async function loadLocation(): Promise<void> {
    try{
        const coords = await MyGeolocation.getLocation();
        latitudeInput.value = coords.latitude.toString();
        longitudeInput.value = coords.longitude.toString();
    }catch{
        latitudeInput.value = "0";
        longitudeInput.value = "0";
    }
}
loadLocation();

function validateEmails(): void {
    if(emailInput.value !== emailRepeatInput.value){
        emailRepeatInput.setCustomValidity("Emails must be equals");
    }else{
        emailRepeatInput.setCustomValidity("");
    }
}
emailInput.addEventListener("input",validateEmails);
emailRepeatInput.addEventListener("input",validateEmails);

imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    if(!file){
        imagePreview.src = "";
        imagePreview.classList.add("d-none");
        photoBase64 = "";
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
        photoBase64 = reader.result as string;
        imagePreview.src = photoBase64;
        imagePreview.classList.remove("d-none");
    });
});

registerForm.addEventListener("submit",async (event) => {
    event.preventDefault();

    try{
        await authService.register({
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            lat: Number(latitudeInput.value) || 0,
            lng: Number(longitudeInput.value) || 0,
            photo: photoBase64,
        });
        location.assign("login.html");
    }catch (error: any){
        const messages = Array.isArray(error?.message)
            ? error.message.join("\n")
            : error?.message || error?.error || "Error registering user";
        alert(messages);
    }
});
