import axiosConfig from "./axiosConfig";

export const paymentApi = {
	checkout: (body: any) =>
		axiosConfig.post("/stripe/create-checkout-session", body),
};
