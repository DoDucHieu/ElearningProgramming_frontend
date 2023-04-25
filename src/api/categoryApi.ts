import { CategoryType } from "../type/type";
import axiosConfig from "./axiosConfig";

export const categoryApi = {
	getAll: (params: any) => axiosConfig.get("/get-all-category", { params }),
	add: (body: CategoryType) => axiosConfig.post("/add-category", body),
	update: (body: CategoryType) => axiosConfig.put("/update-category", body),
	delete: (params: any) => axiosConfig.delete("/delete-category", { params }),
};
