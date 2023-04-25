import { UserType } from "../../type/type";
import { AppDispatch } from "../store";
import { actionType } from "./actionType";

const changeTab = (data: { key?: number; name?: string }) => {
	return (dispatch: AppDispatch) => {
		dispatch({
			type: actionType.CHANGE_TAB,
			payload: data,
		});
	};
};

const changeUserInfor = (data: UserType) => {
	return (dispatch: AppDispatch) => {
		dispatch({
			type: actionType.CHANGE_USER_INFO,
			payload: data,
		});
	};
};

export const commonAction = {
	changeTab,
	changeUserInfor,
};
