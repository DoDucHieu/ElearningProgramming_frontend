import { useEffect, useState } from 'react';
import '../../asset/style/Conversation.scss';
import { conversationApi } from '../../api/conversationApi';
import { Conversation } from './Conversation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { userApi } from '../../api/userApi';
import { conversationAction } from '../../store/action/conversationAction';

export type Props = {
    user_id: string;
    socket?: any;
};

export const ListConversation = ({
    user_id,
    socket,
}: Props): React.ReactElement => {
    const dispatch: AppDispatch = useDispatch();
    const [ListConversation, setListConversation] = useState<any>();

    useEffect(() => {
        user_id && handleGetAllConversation(user_id);
    }, [user_id]);

    const handleGetAllConversation = async (user_id: string): Promise<any> => {
        try {
            const params = {
                user_id,
            };
            const res = await conversationApi.getAll(params);
            if (res?.data?.data) {
                setListConversation(res.data.data);
                if (res.data.data[0]?._id && res.data.data[0]?.members) {
                    const result = await handleGetDetailReceiver(
                        res.data.data[0].members[0] === user_id
                            ? res.data.data[0].members[1]
                            : res.data.data[0].members[0],
                    );
                    if (result) {
                        dispatch(
                            conversationAction.changeConversationId(
                                res.data.data[0]._id,
                            ),
                        );
                        dispatch(
                            conversationAction.changeReceiverName(
                                result?.fullName,
                            ),
                        );
                        dispatch(
                            conversationAction.changeReceiverAvatar(
                                result?.avatar,
                            ),
                        );
                        dispatch(
                            conversationAction.changeReceiverId(result?._id),
                        );
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleGetDetailReceiver = async (
        receiver_id: string,
    ): Promise<any> => {
        try {
            const params = {
                user_id: receiver_id,
            };
            const res = await userApi.getDetailUserById(params);
            if (res?.data?.data) {
                return res.data.data;
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="list-conversation">
            {ListConversation?.map((item: any) => {
                return (
                    <Conversation
                        conversation_id={item?._id}
                        receiver_id={
                            user_id === item?.members[0]
                                ? item?.members[1]
                                : item?.members[0]
                        }
                    />
                );
            })}
        </div>
    );
};
