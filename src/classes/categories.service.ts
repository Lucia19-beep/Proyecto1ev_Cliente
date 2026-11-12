import { SERVER } from "../constants.js";
import type { CategoriesResponse, Category } from "../interfaces/category.js";
import { Http } from "./http.class.js";

export class CategoriesService {
    #http = new Http();

    async getAll(): Promise<Category[]> {
        const resp = await this.#http.get<CategoriesResponse>(`${SERVER}/categories`);
        return resp.categories;
    }
}
