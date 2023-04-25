import { UserType } from "../../type/type";
import { actionType } from "../action/actionType";

export type CommonReducer = {
	curentTab?: string;
	currentTabKey?: number;
	userInfo?: UserType | null;
};

const initialState: CommonReducer = {
	currentTabKey: 1,
	curentTab: "Quản lý tài khoản",
	userInfo: null,
};

export const commonReducer = (
	state: CommonReducer = initialState,
	action: any,
) => {
	switch (action.type) {
		case actionType.CHANGE_TAB:
			return {
				...state,
				currentTabKey: action.payload.key,
				curentTab: action.payload.name,
			};
		case actionType.CHANGE_USER_INFO:
			return {
				...state,
				userInfo: action.payload,
			};
		default:
			return state;
	}
};
