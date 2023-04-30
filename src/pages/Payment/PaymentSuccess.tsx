import { Button } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cartApi } from '../../api/cartApi';
import { orderApi } from '../../api/OrderApi';
import { courseApi } from '../../api/courseApi';

export const PaymentSuccess = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        handleDeleteAllCart();
        handleGetDetailOrder();
    }, []);

    const handleDeleteAllCart = async (): Promise<any> => {
        try {
            const params = {
                email,
            };
            const res = await cartApi.deleteAllCart(params);
            if (res) console.log('delete all cart: ', res?.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetDetailOrder = async (): Promise<any> => {
        try {
            const param = {
                email,
                order_id: params?.orderId,
            };
            const res = await orderApi.getDetail(param);
            if (res?.data?.data) {
                console.log('Check detail order: ', res.data.data);
                const data = {
                    list_course: res.data.data?.list_course,
                };
                await handleIncreaseRegistryCourse(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleIncreaseRegistryCourse = async (data: any): Promise<any> => {
        try {
            console.log('data to increase course: ', data);

            const res = await courseApi.increaseRegistryCourse(data);
            if (res?.data) {
                console.log('Check increase registry course: ', res.data);
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
                color: 'green',
                fontSize: '32px',
            }}
        >
            <h1>Thanh toán thành công</h1>
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
