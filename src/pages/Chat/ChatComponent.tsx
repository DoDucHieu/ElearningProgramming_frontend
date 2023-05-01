import '../../asset/style/ChatComponent.scss';
import { DetailConversation } from './DetailConversation';
import { ListConversation } from './ListConversation';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const ChatComponent = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const socket: any = useRef();
    const socket_url = process.env.REACT_APP_SOCKET_URL;

    useEffect(() => {
        if (socket_url) socket.current = io(socket_url);
    }, [socket_url]);

    useEffect(() => {
        user_id && socket.current.emit('addUser', user_id);
    }, [user_id]);

    return (
        <div className="chat-component">
            <div className="chat-left">
                <ListConversation user_id={user_id} socket={socket} />
            </div>
            <div className="chat-right">
                <DetailConversation socket={socket} />
            </div>
        </div>
    );
};
