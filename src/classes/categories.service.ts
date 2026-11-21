import { SERVER } from "../constants";
import type { Category } from "../interfaces/category";
import type { CategoriesResponse } from "../interfaces/responses";
import { Http } from "./http.class";


export class CategoriesService {
    #http = new Http();

    async getAll(): Promise<Category[]> {
        const resp = await this.#http.get<CategoriesResponse>(`${SERVER}/categories`);
        return resp.categories;
    }
}
