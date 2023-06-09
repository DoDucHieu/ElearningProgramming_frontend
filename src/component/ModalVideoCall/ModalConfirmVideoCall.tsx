import { PhoneOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import '../../asset/style/ModalConfirmVideoCall.scss';
import { UserType } from '../../type/type';

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

    const handleDeclineVideoCall = () => {
        if (user_id && socket) {
            socket.emit('makeDeclineVideoCall', user_id);
            handleClose();
        }
    };

    return (
        <Modal
            title={'Người dùng đang gọi đến'}
            open={true}
            onCancel={handleClose}
            footer={null}
            width={800}
        >
            <div className="receiver">
                <img className="avatar" src={dataView?.avatar} />
                <div className="name">{dataView?.fullName}</div>
                <div className="feature">
                    <div className="seperate"></div>
                    <span
                        className="call call-accept"
                        onClick={handleAcceptVideoCall}
                    >
                        <PhoneOutlined />
                    </span>
                    <span
                        className="call call-decline"
                        onClick={handleDeclineVideoCall}
                    >
                        <PhoneOutlined />
                    </span>
                </div>
            </div>
        </Modal>
    );
};
