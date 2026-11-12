import { ProductsService } from "./classes/products.service.js";
import type { Product } from "./interfaces/product.js";

const productsService = new ProductsService();
const container = document.getElementById(
  "products-container"
) as HTMLDivElement;
const search = document.getElementById("search") as HTMLInputElement;
const cardTemplate = document.getElementById(
  "product-template"
) as HTMLTemplateElement;

let products: Product[] = [];

function addProduct(product: Product): void {
  const card = (cardTemplate.content.cloneNode(true) as DocumentFragment)
    .firstElementChild as HTMLDivElement;

  const formattedPrice = Intl.NumberFormat("en-US", {
    currency: "EUR",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price);

  card.querySelector(".card-img-top")?.setAttribute("src", product.mainPhoto);
  card.querySelector(".card-title")?.append(product.title);
  card.querySelector(".card-text")?.append(product.description);
  card.querySelector(".category")?.append(product.category.name);
  card.querySelector(".price")?.append(formattedPrice);

  card.querySelector(".btn-delete")?.addEventListener("click", async () => {
    await productsService.delete(product.id);
    card.remove();
  });

  container.append(card);
}

function replaceProducts(products: Product[]): void {
  container.replaceChildren(); // Vaciamos el contenido
  products.forEach((p) => addProduct(p));
}

productsService.getAll().then((respProducts) => {
  products = respProducts;
  replaceProducts(products);
});

search.addEventListener("input", () => {
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLocaleUpperCase().includes(search.value.toLocaleUpperCase()) ||
      p.description
        .toLocaleUpperCase()
        .includes(search.value.toLocaleUpperCase())
  );
  replaceProducts(filteredProducts);
});
