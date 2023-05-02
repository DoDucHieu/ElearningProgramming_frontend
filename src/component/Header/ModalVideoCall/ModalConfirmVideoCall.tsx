import '../../../asset/style/ModalUserContact.scss';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import {
    PhoneOutlined,
    VideoCameraOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../api/userApi';
import { UserType } from '../../../type/type';
import { ModalVideoCall } from './ModalVideoCall';

export type Props = {
    sender_id?: string;
    handleClose?: any;
    handleAcceptVideoCall?: any;
    socket?: any;
};
export const ModalConfirmVideoCall = ({
    sender_id,
    handleClose,
    handleAcceptVideoCall,
    socket,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const navigate = useNavigate();
    const [dataView, setDataView] = useState<UserType>();

    useEffect(() => {
        sender_id && handleGetDetailUser(sender_id);
    }, [sender_id]);

    const handleGetDetailUser = async (sender_id: string): Promise<any> => {
        try {
            const params = {
                user_id: sender_id,
            };
            const res = await userApi.getDetailUserById(params);
            if (res?.data?.data) {
                setDataView(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title={'Người dùng đang gọi đến'}
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
                    <span className="message">
                        <MessageOutlined />
                    </span>
                    <div className="seperate"></div>
                    <span className="call" onClick={handleAcceptVideoCall}>
                        <PhoneOutlined />
                    </span>
                </div>
            </div>
        </Modal>
    );
};
