import { useEffect, useState } from 'react';
import '../../asset/style/Conversation.scss';
import { userApi } from '../../api/userApi';
import { UserType } from '../../type/type';
import { useSearchParams } from 'react-router-dom';

export type Props = {
    conversation_id: string;
    receiver_id: string;
};

export const Conversation = ({
    conversation_id,
    receiver_id,
}: Props): React.ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams();
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
                console.log(res.data.data);
                setReceive(res.data.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleClickChangeConversation = (conversation_id: string) => {
        searchParams.set('conversation_id', conversation_id);
        setSearchParams(searchParams);
    };

    return (
        <div
            className="conversation"
            onClick={() => handleClickChangeConversation(conversation_id)}
        >
            <img className="conversation-avatar" src={receive?.avatar} />
            <div className="conversation-infor">
                <div className="conversation-name">{receive?.fullName}</div>
                <div className="conversation-latest-inbox">hello</div>
            </div>
        </div>
    );
};
