import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { messageApi } from '../../api/messageApi';
import '../../asset/style/ListMessage.scss';
import { RootState } from '../../store/store';
import { Message } from './Message';
import { CONSTANT } from '../../constant/constant';
import { useSearchParams } from 'react-router-dom';

export type Props = {
    socket?: any;
};

export const ListMessage = ({ socket }: Props): React.ReactElement => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const conversation_id = useSelector(
        (state: RootState) => state.conversationReducer.conversation_id,
    );
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const [ListMessage, setListMessage] = useState<any>();
    const [newMessage, setNewMessage] = useState<any>(null);
    const scrollRef: any = useRef();

    useEffect(() => {
        conversation_id && user_id && handleGetAllMessage(conversation_id);
    }, [conversation_id, user_id]);

    useEffect(() => {
        conversation_id &&
            user_id &&
            socket &&
            socket.on(
                `getMessage${conversation_id}`,
                ({ senderId, conversationId, text }: any) => {
                    const data = {
                        conversation_id: conversationId,
                        sender: senderId,
                        text,
                    };
                    setNewMessage(data);
                },
            );
    }, [socket, conversation_id, user_id]);

    useEffect(() => {
        newMessage && setListMessage([...ListMessage, newMessage]);
    }, [newMessage]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [ListMessage]);

    const handleGetAllMessage = async (
        conversation_id: string,
        page?: string,
        size?: string,
        keyword?: string,
    ): Promise<any> => {
        try {
            const params = {
                conversation_id,
                page,
                size,
                keyword,
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
        <div className="list-message" ref={scrollRef}>
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
