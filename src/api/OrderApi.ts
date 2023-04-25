import axiosConfig from "./axiosConfig";

export const orderApi = {
	getAll: (params: any) => axiosConfig.get("/get-all-order", { params }),
	add: (body: any) => axiosConfig.post("/add-order", body),
	edit: (body: any) => axiosConfig.post("/edit-order", body),
	delete: (params: any) => axiosConfig.delete("/delete-order", { params }),
	checkout: (body: any) => axiosConfig.post("/order-checkout", body),
};
