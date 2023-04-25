import { CartType } from "../type/type";
import axiosConfig from "./axiosConfig";

export const cartApi = {
	getAll: (params: any) => axiosConfig.get("/get-all-cart", { params }),
	addToCart: (data: CartType) => axiosConfig.post("/add-to-cart", data),
	removeFromCart: (params: any) =>
		axiosConfig.delete("/remove-from-cart", { params }),
	deleteAllCart: (params: any) =>
		axiosConfig.delete("/delete-all-cart", { params }),
};
