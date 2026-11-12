import { SERVER } from "../constants.js";
import type {
    ProductsResponse,
    SingleProductResponse,
    Product,
    ProductPost
} from "../interfaces/product.js";
import { Http } from "./http.class.js";

export class ProductsService {
  #http = new Http();

  async getAll(): Promise<Product[]> {
    const resp = await this.#http.get<ProductsResponse>(`${SERVER}/products`);
    return resp.products;
  }

  async post(product: ProductPost): Promise<Product> {
    const resp = await this.#http.post<SingleProductResponse, ProductPost>(
      `${SERVER}/products`,
      product
    );
    return resp.product;
  }

  async delete(id: number): Promise<void> {
    await this.#http.delete(`${SERVER}/products/${id}`);
  }
}
