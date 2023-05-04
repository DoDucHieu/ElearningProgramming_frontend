import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApi } from '../../api/OrderApi';
import { useEffect } from 'react';
import { myCourseApi } from '../../api/myCourseApi';

export const PaymentCancel = (): React.ReactElement => {
    const navigate = useNavigate();
    const params = useParams();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;

    useEffect(() => {
        handleGetDetailOrder();
    }, []);

    const handleGetDetailOrder = async (): Promise<any> => {
        try {
            const param = {
                email,
                order_id: params?.orderId,
            };
            const res = await orderApi.getDetail(param);
            if (res?.data?.data) {
                const data = {
                    email,
                    list_course: res.data.data?.list_course,
                };
                await handleDeleteManyMyCourse(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteOrder = async (): Promise<any> => {
        try {
            const param = {
                email,
                order_id: params?.orderId,
            };
            const res = await orderApi.delete(param);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteManyMyCourse = async (params: any): Promise<any> => {
        try {
            const res = await myCourseApi.deleteMany(params);
            if (res?.data) {
                await handleDeleteOrder();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 40,
                color: 'red',
                fontSize: '32px',
            }}
        >
            <h1>Thanh toán đã bị hủy</h1>
            <Button
                style={{ marginTop: 40, width: 200, height: 40 }}
                type="primary"
                onClick={() => navigate('/')}
            >
                Quay lại trang chủ
            </Button>
        </div>
    );
};
