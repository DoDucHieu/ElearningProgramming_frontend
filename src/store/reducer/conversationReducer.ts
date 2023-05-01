import { actionType } from '../action/actionType';

export type ConversationReducer = {
    conversation_id?: string | null;
    receiver_avatar?: string | null;
    receiver_name?: string | null;
};

const initialState: ConversationReducer = {
    conversation_id: null,
    receiver_avatar: null,
    receiver_name: null,
};

export const conversationReducer = (
    state: ConversationReducer = initialState,
    action: any,
) => {
    switch (action.type) {
        case actionType.CHANGE_CONVERSATION_ID:
            return {
                ...state,
                conversation_id: action.payload,
            };
        case actionType.CHANGE_RECEIVER_AVATAR:
            return {
                ...state,
                receiver_avatar: action.payload,
            };
        case actionType.CHANGE_RECEIVER_NAME:
            return {
                ...state,
                receiver_name: action.payload,
            };
        default:
            return state;
    }
};
