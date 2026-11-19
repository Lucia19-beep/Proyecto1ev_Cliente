import { SERVER } from "../constants.js";
import type { Product, ProductInsert } from "../interfaces/product.js";
import type {
  ProductsResponse,
  SingleProductResponse,
} from "../interfaces/responses.js";
import { Http } from "./http.class.js";

export class ProductsService {
  #http = new Http();

  async getProducts(
    page = 1,
    search = "",
    sort = "distance",
    user?: string | null,
    status?: string | null
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      search,
      sort,
    });

    if (status) {
      params.append("status", status);
      if (user) {
        params.append("user", user);
      }
    }

    return await this.#http.get<ProductsResponse>(
      `${SERVER}/products?${params.toString()}`
    );
  }

  async post(product: ProductInsert): Promise<Product> {
    const resp = await this.#http.post<SingleProductResponse, ProductInsert>(
      `${SERVER}/products`,
      product
    );
    return resp.product;
  }

  async delete(id: number): Promise<void> {
    await this.#http.delete(`${SERVER}/products/${id}`);
  }
}