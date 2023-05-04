import { useEffect, useState } from 'react';
import '../../asset/style/Conversation.scss';
import { conversationApi } from '../../api/conversationApi';
import { Conversation } from './Conversation';

export type Props = {
    user_id: string;
    socket?: any;
};

export const ListConversation = ({
    user_id,
    socket,
}: Props): React.ReactElement => {
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
