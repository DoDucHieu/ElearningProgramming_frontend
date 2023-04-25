import { toast } from "react-toastify";
import { cartApi } from "../../api/cartApi";
import { CartType } from "../../type/type";
import { RootState, AppDispatch } from "../store";
import { actionType } from "./actionType";

const getAllCart = (email: string) => {
	return async (dispatch: AppDispatch) => {
		const params = {
			email,
		};
		const res = await cartApi.getAll(params);
		if (res?.data?.data) {
			const arrData = res.data.data;
			const arrProduct: CartType[] = arrData.map((product: any) => {
				return {
					productId: product?.productId?._id,
					quantity: product?.quantity,
					price: product?.productId?.price,
					imgUrl: product.productId?.imgUrl,
					productName: product.productId?.productName,
				};
			});
			await dispatch({
				type: actionType.GET_ALL_CART,
				payload: arrProduct,
			});
			await dispatch({
				type: actionType.GET_CART_ID,
				payload: arrData[0]?._id,
			});
		}
	};
};

const addToCart = (data: CartType) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const res = await cartApi.addToCart(data);
		if (res?.data?.errCode === 0) {
			let arr: CartType[] = [...getState().cartReducer.arrProduct];
			let checkExist = false;
			arr.forEach((product: CartType) => {
				if (
					product.productId === data.productId &&
					product.quantity &&
					data.quantity
				) {
					checkExist = true;
					product.quantity += data.quantity;
				}
			});
			if (!checkExist) {
				arr = [...arr, data];
			}
			dispatch({
				type: actionType.ADD_TO_CART,
				payload: arr,
			});
			toast.success(res.data.errMessage);
		}
	};
};

const removeFromCart = (data: CartType) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const params = {
			email: data.email,
			productId: data.productId,
		};
		const res = await cartApi.removeFromCart(params);
		if (res && res?.data?.errCode === 0) {
			const arr: CartType[] = getState().cartReducer.arrProduct;
			const newArr = arr.filter((item) => {
				return item.productId !== data.productId;
			});
			dispatch({
				type: actionType.REMOVE_FROM_CART,
				payload: newArr,
			});
			toast.success(res.data.errMessage);
		}
	};
};

export const cartAction = {
	getAllCart,
	addToCart,
	removeFromCart,
};
