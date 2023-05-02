import { AppDispatch } from '../store';
import { actionType } from './actionType';

const changeConversationId = (conversation_id: string) => {
    return (dispatch: AppDispatch) => {
        dispatch({
            type: actionType.CHANGE_CONVERSATION_ID,
            payload: conversation_id,
        });
    };
};

const changeReceiverAvatar = (receiver_avatar?: string) => {
    return (dispatch: AppDispatch) => {
        dispatch({
            type: actionType.CHANGE_RECEIVER_AVATAR,
            payload: receiver_avatar,
        });
    };
};

const changeReceiverName = (receiver_name?: string) => {
    return (dispatch: AppDispatch) => {
        dispatch({
            type: actionType.CHANGE_RECEIVER_NAME,
            payload: receiver_name,
        });
    };
};

const changeReceiverId = (receiver_id?: string) => {
    return (dispatch: AppDispatch) => {
        dispatch({
            type: actionType.CHANGE_RECEIVER_ID,
            payload: receiver_id,
        });
    };
};

export const conversationAction = {
    changeConversationId,
    changeReceiverAvatar,
    changeReceiverName,
    changeReceiverId,
};
