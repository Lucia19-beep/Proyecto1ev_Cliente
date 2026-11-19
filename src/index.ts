import { ProductsService } from "./classes/products.service.js";
import { AuthService } from "./classes/auth.service.js";
import type { Product } from "./interfaces/product.js";

const productsService = new ProductsService();
const authService = new AuthService();

const container = document.getElementById("productsContainer") as HTMLDivElement;
const cardTemplate = document.getElementById("productTemplate") as HTMLTemplateElement;
const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const search = document.getElementById("search") as HTMLInputElement;
const order = document.getElementById("order") as HTMLSelectElement;
const filterInfo = document.getElementById("filterInfo") as HTMLDivElement;
const loadMoreBtn = document.getElementById("loadMore") as HTMLButtonElement;
const logoutLink = document.getElementById("logout") as HTMLAnchorElement;

let currentPage = 1;
let currentSearch = "";
let currentOrder = "distance";

const urlParams = new URLSearchParams(window.location.search);
const statusParam = urlParams.get("status");
const userParam = urlParams.get("user");

function updateFilterInfo(): void {
  const searchPart = currentSearch
    ? `Filtered by "${currentSearch}".`
    : "Showing all products.";
  const statusPart = statusParam ? ` Status: ${statusParam}.` : "";
  filterInfo.textContent = `${searchPart}${statusPart} Sorted by ${currentOrder}.`;
}

function addProduct(product: Product): void {
  const card = (cardTemplate.content.cloneNode(true) as DocumentFragment)
    .firstElementChild as HTMLDivElement;

  const formattedPrice = Intl.NumberFormat("es-ES", {
    currency: "EUR",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price);

  const formattedDistance = Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.distance);

  const formattedDate = Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(product.datePublished));

  const detailUrl = `product-detail.html?id=${product.id}`;
  card.querySelector(".product-img-link")?.setAttribute("href", detailUrl);
  const titleLink = card.querySelector(".card-title") as HTMLAnchorElement;
  titleLink.href = detailUrl;
  titleLink.append(product.title);

  card.querySelector(".card-img-top")?.setAttribute("src", product.mainPhoto);
  card.querySelector(".card-text")?.append(product.description);
  card.querySelector(".badge")?.append(product.category.name);
  card.querySelector(".text-success")?.append(formattedPrice);

  const profileUrl = `profile.html?id=${product.owner.id}`;
  card.querySelector(".avatar-link")?.setAttribute("href", profileUrl);
  card.querySelector(".avatar img")?.setAttribute("src", product.owner.photo);
  const nameLink = card.querySelector(".name") as HTMLAnchorElement;
  nameLink.href = profileUrl;
  nameLink.append(product.owner.name);

  card.querySelector(".card-footer small.text-muted")?.append(formattedDate);
  card.querySelector(".views")?.append(String(product.numVisits));
  card.querySelector(".distance")?.append(`${formattedDistance} km`);

  const deleteBtn = card.querySelector(".delete") as HTMLButtonElement;
  if (product.mine) {
    deleteBtn.classList.remove("d-none");
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this product?")) {
        await productsService.delete(product.id);
        card.remove();
      }
    });
  } else {
    deleteBtn.classList.add("d-none");
  }

  container.append(card);
}

function showProducts(products: Product[], append: boolean): void {
  if (!append) {
    container.replaceChildren();
  }
  products.forEach((p) => addProduct(p));
}

async function loadProducts(append = false): Promise<void> {
  const resp = await productsService.getProducts(
    currentPage,
    currentSearch,
    currentOrder,
    userParam,
    statusParam
  );

  showProducts(resp.products, append);
  updateFilterInfo();

  if (currentPage >= resp.total_pages) {
    loadMoreBtn.classList.add("d-none");
  } else {
    loadMoreBtn.classList.remove("d-none");
  }
}

authService
  .checkToken()
  .then(() => loadProducts(false))
  .catch(() => location.assign("login.html"));

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  currentSearch = search.value.trim();
  currentOrder = order.value;
  loadProducts(false).catch(console.error);
});

loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  loadProducts(true).catch(console.error);
});

logoutLink.addEventListener("click", (e) => {
  e.preventDefault();
  authService.logout();
});