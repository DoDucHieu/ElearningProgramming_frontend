import { ProductType } from "../type/type";
import axiosConfig from "./axiosConfig";

export const productApi = {
	getAll: (params: any) => axiosConfig.get("/get-all-product", { params }),
	add: (data: ProductType) => axiosConfig.post("/add-product", data),
	update: (data: ProductType) => axiosConfig.put(`/update-product`, data),
	delete: (params: any) => axiosConfig.delete("/delete-product", { params }),
	getDetail: (params: any) =>
		axiosConfig.get("/get-detail-product", { params }),
};
