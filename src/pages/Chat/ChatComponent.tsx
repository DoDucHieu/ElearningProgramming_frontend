import '../../asset/style/ChatComponent.scss';
import { DetailConversation } from './DetailConversation';
import { ListConversation } from './ListConversation';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const ChatComponent = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    // const socket: any = useRef();
    const [socket, setSocket] = useState<any>();
    const socket_url = process.env.REACT_APP_SOCKET_URL;

    useEffect(() => {
        // socket.current = io(socket_url);
        socket_url && setSocket(io(socket_url));
    }, [socket_url]);

    // useEffect(() => {
    //     user_id && socket.current && socket.current.emit('addUser', user_id);
    // }, [user_id, socket.current]);

    useEffect(() => {
        user_id && socket && socket.emit('addUser', user_id);
    }, [user_id, socket]);

    return (
        <div className="chat-component">
            <div className="chat-left">
                {user_id && socket && (
                    <ListConversation user_id={user_id} socket={socket} />
                )}
            </div>
            <div className="chat-right">
                {socket && <DetailConversation socket={socket} />}
            </div>
        </div>
    );
};
