import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { userApi } from '../../api/userApi';
import '../../asset/style/Conversation.scss';
import { conversationAction } from '../../store/action/conversationAction';
import { AppDispatch } from '../../store/store';
import { UserType } from '../../type/type';

export type Props = {
    conversation_id: string;
    receiver_id: string;
};

export const Conversation = ({
    conversation_id,
    receiver_id,
}: Props): React.ReactElement => {
    const dispatch: AppDispatch = useDispatch();
    const [receive, setReceive] = useState<UserType>();

    useEffect(() => {
        receiver_id && handleGetDetailReceiver(receiver_id);
    }, [receiver_id]);

    const handleGetDetailReceiver = async (
        receiver_id: string,
    ): Promise<any> => {
        try {
            const params = {
                user_id: receiver_id,
            };
            const res = await userApi.getDetailUserById(params);
            if (res?.data?.data) {
                setReceive(res.data.data);
                dispatch(
                    conversationAction.changeReceiverAvatar(
                        res.data.data?.avatar,
                    ),
                );
                dispatch(
                    conversationAction.changeReceiverName(
                        res.data.data?.fullName,
                    ),
                );
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleClickChangeConversation = (
        conversation_id: string,
        receiverName?: string,
        receiverAvatar?: string,
        receiver_id?: string,
    ) => {
        dispatch(conversationAction.changeConversationId(conversation_id));
        dispatch(conversationAction.changeReceiverName(receiverName));
        dispatch(conversationAction.changeReceiverAvatar(receiverAvatar));
        dispatch(conversationAction.changeReceiverId(receiver_id));
    };

    return (
        <div
            className="conversation"
            onClick={() =>
                handleClickChangeConversation(
                    conversation_id,
                    receive?.fullName,
                    receive?.avatar,
                    receive?._id,
                )
            }
        >
            <img className="conversation-avatar" src={receive?.avatar} />
            <div className="conversation-infor">
                <div className="conversation-name">{receive?.fullName}</div>
                <div className="conversation-latest-inbox"></div>
            </div>
        </div>
    );
};
