import '../../asset/style/ModalUserContact.scss';
import { useEffect, useState } from 'react';
import { UserType } from '../../type/type';
import { Modal } from 'antd';
import { userApi } from '../../api/userApi';
import {
    PhoneOutlined,
    VideoCameraOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { conversationApi } from '../../api/conversationApi';
import { useNavigate } from 'react-router-dom';
import { conversationAction } from '../../store/action/conversationAction';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';

export type Props = {
    receiver_id?: string;
    handleClose?: any;
};
export const ModalUserContact = ({
    receiver_id,
    handleClose,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [dataView, setDataView] = useState<UserType>();

    useEffect(() => {
        receiver_id && handleGetDetailUser(receiver_id);
    }, [receiver_id]);

    const handleGetDetailUser = async (receiver_id: string): Promise<any> => {
        try {
            const params = {
                user_id: receiver_id,
            };
            const res = await userApi.getDetailUserById(params);
            if (res?.data?.data) {
                setDataView(res.data.data);
                console.log('data view: ', res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddConversation = async () => {
        try {
            const data = {
                sender_id: user_id,
                receiver_id: receiver_id,
            };
            const res = await conversationApi.add(data);
            let conversation_id;
            if (res?.data?.errCode === 1) {
                conversation_id = res.data?.result[0]?._id;
                console.log('da ton tai:', conversation_id);
            }
            if (res?.data?.errCode === 0) {
                conversation_id = res.data?.result?._id;
                console.log('chua ton tai:', conversation_id);
            }
            if (conversation_id && dataView) {
                console.log('here');

                dispatch(
                    conversationAction.changeConversationId(conversation_id),
                );
                dispatch(
                    conversationAction.changeReceiverName(dataView?.fullName),
                );
                dispatch(
                    conversationAction.changeReceiverAvatar(dataView?.avatar),
                );
                dispatch(conversationAction.changeReceiverId(dataView?._id));
                navigate('/chat');
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Modal
            title={'Trang cá nhân'}
            open={true}
            onOk={handleClose}
            onCancel={handleClose}
            footer={null}
            width={800}
        >
            <div className="user-contact">
                <img className="avatar" src={dataView?.avatar} />
                <div className="name">{dataView?.fullName}</div>
                <div className="feature">
                    <span
                        className="message"
                        onClick={() => {
                            handleAddConversation();
                        }}
                    >
                        <MessageOutlined />
                    </span>
                    <div className="seperate"></div>
                    <span className="call">
                        <PhoneOutlined />
                    </span>
                </div>
            </div>
        </Modal>
    );
};
