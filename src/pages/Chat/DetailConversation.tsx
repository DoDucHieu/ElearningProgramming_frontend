import '../../asset/style/DetailConversation.scss';
import { useEffect } from 'react';
import { ListMessage } from './ListMessage';
import { ChatForm } from './ChatForm';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ModalVideoCall } from '../../component/ModalVideoCall/ModalVideoCall';
import { ModalConfirmVideoCall } from '../../component/ModalVideoCall/ModalConfirmVideoCall';

export type Props = {
    socket?: any;
};

export const DetailConversation = ({ socket }: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;

    const receiver_id = useSelector(
        (state: RootState) => state.conversationReducer.receiver_id,
    );
    const receiver_avatar = useSelector(
        (state: RootState) => state.conversationReducer.receiver_avatar,
    );
    const receiver_name = useSelector(
        (state: RootState) => state.conversationReducer.receiver_name,
    );
    const [isOpenModalVideoCall, setIsOpenModalVideoCall] =
        useState<boolean>(false);
    const [isOpenModalConfirmVideoCall, setIsOpenModalConfirmVideoCall] =
        useState<boolean>(false);
    const [acceptVideoCall, setAcceptVideoCall] = useState<boolean>(false);

    const [senderId, setSenderId] = useState<string>();

    const handleCloseModalVideoCall = (type: string) => {
        type === 'caller'
            ? setIsOpenModalVideoCall(false)
            : setAcceptVideoCall(false);
    };

    const handleCloseModalConfirmVideoCall = () => {
        setIsOpenModalConfirmVideoCall(false);
    };

    const handleAcceptVideoCall = () => {
        setAcceptVideoCall(true);
    };

    useEffect(() => {
        user_id &&
            socket.current &&
            socket.current.on(`getVideoCall${user_id}`, (sender_id: string) => {
                console.log('Người đang gọi đến: ', sender_id);
                if (sender_id) {
                    setSenderId(sender_id);
                    setIsOpenModalConfirmVideoCall(true);
                }
            });
    }, [socket?.current, user_id]);

    return (
        <div className="detail-conversation">
            <div className="detail-conversation-header">
                <div className="receiver_infor">
                    <img
                        src={receiver_avatar && receiver_avatar}
                        className="receiver-avatar"
                    />
                    <div className="receiver-name">
                        {receiver_name && receiver_name}
                    </div>
                </div>
                <div className="receiver-feature">
                    <span className="call">
                        <PhoneOutlined />
                    </span>
                    <span
                        className="video-call"
                        onClick={() => {
                            setIsOpenModalVideoCall(true);
                        }}
                    >
                        <VideoCameraOutlined />
                    </span>
                    {isOpenModalVideoCall && (
                        <ModalVideoCall
                            handleClose={handleCloseModalVideoCall}
                            socket={socket}
                            receiver_id={receiver_id}
                            type="caller"
                        />
                    )}
                </div>
            </div>
            <div className="detail-conversation-body">
                <ListMessage socket={socket} />
            </div>
            <div className="detail-conversation-footer">
                <ChatForm socket={socket} />
            </div>
            {senderId && isOpenModalConfirmVideoCall && (
                <ModalConfirmVideoCall
                    socket={socket}
                    sender_id={senderId}
                    handleClose={handleCloseModalConfirmVideoCall}
                    handleAcceptVideoCall={handleAcceptVideoCall}
                />
            )}
            {senderId && acceptVideoCall && (
                <ModalVideoCall
                    handleClose={handleCloseModalVideoCall}
                    socket={socket}
                    type="answer"
                />
            )}
        </div>
    );
};
