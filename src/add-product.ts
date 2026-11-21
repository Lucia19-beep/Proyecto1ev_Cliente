import { AuthService } from "./classes/auth.service";
import {CategoriesService} from "./classes/categories.service";
import { ProductsService } from "./classes/products.service";
import { ProductInsert } from "./interfaces/product";

const authService = new AuthService();
const categoriesService = new CategoriesService();
const productsService = new ProductsService();

const form = document.getElementById("newProduct") as HTMLFormElement;
const categorySelect = document.getElementById("category") as HTMLSelectElement;
const imageInput = document.getElementById("image") as HTMLInputElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
const logoutLink = document.getElementById("logout") as HTMLAnchorElement;

let mainPhoto = "";

async function loadCategories(): Promise<void> {
    const categories = await categoriesService.getAll();
    categories.forEach((c) => {
        const option = document.createElement("option");
        option.value = String(c.id);
        option.textContent = c.name;
        categorySelect.append(option);
    });
}

authService.checkToken()
    .then(() => loadCategories())
    .catch(() => location.assign("login.html"));

imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    if(!file){
        mainPhoto="";
        imgPreview.src="";
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
        mainPhoto = reader.result as string;
        imgPreview.src = mainPhoto;
    });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titleInput=form.elements.namedItem("title") as HTMLInputElement;
    const descriptionInput=form.elements.namedItem("description") as HTMLTextAreaElement;
    const priceInput=form.elements.namedItem("price") as HTMLInputElement;

    const newProduct: ProductInsert = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        category: Number(categorySelect.value),
        price: Number(priceInput.value),
        mainPhoto,
    };

    try{
        await productsService.post(newProduct);
        location.assign("index.html");
    }catch(error){
        alert("Error creating product: " +(error as Error).message);
    }
});

logoutLink.addEventListener("click",(event) => {
    event.preventDefault();
    authService.logout();
});
