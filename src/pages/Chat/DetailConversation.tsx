import '../../asset/style/DetailConversation.scss';
import { ListMessage } from './ListMessage';
import { ChatForm } from './ChatForm';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ModalVideoCall } from '../../component/Header/ModalVideoCall/ModalVideoCall';

export type Props = {
    socket?: any;
};

export const DetailConversation = ({ socket }: Props): React.ReactElement => {
    const receiver_avatar = useSelector(
        (state: RootState) => state.conversationReducer.receiver_avatar,
    );
    const receiver_name = useSelector(
        (state: RootState) => state.conversationReducer.receiver_name,
    );
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const handleClose = () => {
        setIsOpenModal(false);
    };

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
                            setIsOpenModal(true);
                        }}
                    >
                        <VideoCameraOutlined />
                    </span>
                    {isOpenModal && (
                        <ModalVideoCall
                            handleClose={handleClose}
                            socket={socket}
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
        </div>
    );
};
