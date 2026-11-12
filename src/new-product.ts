import { CategoriesService } from "./classes/categories.service.js";
import { ProductsService } from "./classes/products.service.js";
import type { ProductPost } from "./interfaces/product.js";

const newProductForm = document.getElementById("newProduct") as HTMLFormElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
const imageInput = newProductForm.image as HTMLInputElement; 

const categoriesService = new CategoriesService();
const productsService = new ProductsService();

function loadImage(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  imgPreview.src = "";
  imgPreview.classList.add("d-none");

  if (file) {
    
    if (!file.type.startsWith("image")) {
      imageInput.setCustomValidity(
        "File must be an image"
      );
    } else if (file.size > 200000) {
      imageInput.setCustomValidity(
        "You can't add an image larger than 200KB"
      );
    } else {
      imageInput.setCustomValidity("");

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        imgPreview.src = reader.result as string;
        imgPreview.classList.remove("d-none");
      });
    }
    imageInput.reportValidity();
  }
}

async function sendForm(event: Event): Promise<void> {
  event.preventDefault();

  if (!newProductForm.reportValidity()) return;
  const formData = new FormData(newProductForm);

  const product: ProductPost = {
    title: formData.get("title")?.toString().trim() ?? "",
    description: formData.get("description")?.toString().trim() ?? "",
    mainPhoto: imgPreview.src,
    price: +(formData.get("price") ?? 0),
    category: +(formData.get("category") ?? 0),
  };

  await productsService.post(product);
  location.assign("index.html");
}

imageInput.addEventListener("change", loadImage);
newProductForm.addEventListener("submit", sendForm);

categoriesService.getAll().then((categories) =>
  categories.forEach((c) => {
    const option = document.createElement("option");
    option.value = "" + c.id;
    option.append(c.name);
    (newProductForm.category as HTMLSelectElement).append(option);
  })
);
