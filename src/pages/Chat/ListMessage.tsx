import { useEffect, useState } from 'react';
import '../../asset/style/ListMessage.scss';
import { Message } from './Message';
import { messageApi } from '../../api/messageApi';
import { useSearchParams } from 'react-router-dom';

export const ListMessage = (): React.ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams();
    const conversation_id = searchParams.get('conversation_id');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const [ListMessage, setListMessage] = useState<any>();

    useEffect(() => {
        conversation_id && handleGetAllMessage(conversation_id);
    }, [conversation_id]);

    const handleGetAllMessage = async (
        conversation_id: string,
    ): Promise<any> => {
        try {
            const params = {
                conversation_id,
            };
            const res = await messageApi.getAll(params);
            if (res?.data?.data) {
                console.log(res.data.data);
                setListMessage(res.data.data);
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div className="list-message">
            {ListMessage?.map((item: any) => {
                return (
                    <Message
                        text={item?.text}
                        type={item?.sender === user_id}
                    />
                );
            })}
        </div>
    );
};
