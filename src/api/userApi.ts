import { TokenType, UserType } from "../type/type";
import axiosConfig from "./axiosConfig";

export const userApi = {
	signUp: (body: UserType) => axiosConfig.post("/sign-up", body),
	signIn: (body: UserType) => axiosConfig.post("/sign-in", body),
	refreshToken: (body: TokenType) => axiosConfig.post("/refresh-token", body),
	signOut: (body: UserType) => axiosConfig.post("/sign-out", body),
	add: (body: UserType) => axiosConfig.post("/add-user", body),
	edit: (body: UserType) => axiosConfig.put("/edit-user", body),
	delete: (params: any) => axiosConfig.delete("/delete-user", { params }),
	getAllUser: (params: any) => axiosConfig.get("/get-all-user", { params }),
	getDetailUser: (params: any) =>
		axiosConfig.get("/get-detail-user", { params }),
	blockUser: (body: any) => axiosConfig.post("/block-user", body),
	changePassword: (body: any) => axiosConfig.post("/change-password", body),
};
