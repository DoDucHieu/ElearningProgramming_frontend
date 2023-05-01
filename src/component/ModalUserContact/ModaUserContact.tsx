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
            if (res?.data) {
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
