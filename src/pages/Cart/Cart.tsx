import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Form, Radio, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi } from '../../api/OrderApi';
import { paymentApi } from '../../api/PaymentApi';
import { cartApi } from '../../api/cartApi';
import stripe from '../../asset/image/stripe.png';
import '../../asset/style/Cart.scss';
import { cartAction } from '../../store/action/cartAction';
import { AppDispatch, RootState } from '../../store/store';
import { CartType, OrderType } from '../../type/type';

export const Cart = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const listCourse = useSelector(
        (state: RootState) => state.cartReducer.arrCourse,
    );
    const [subTotal, setSubTotal] = useState<number>();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [form] = Form.useForm();
    useEffect(() => {
        // Update network status
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        // Listen to the online status
        window.addEventListener('online', handleStatusChange);

        // Listen to the offline status
        window.addEventListener('offline', handleStatusChange);

        // Specify how to clean up after this effect for performance improvment
        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, [isOnline]);

    useEffect(() => {
        handleGetAllCart(email);
    }, []);

    useEffect(() => {
        handleCalculateSubTotal(listCourse);
    }, [listCourse]);

    const handleGetAllCart = async (email: any) => {
        try {
            await dispatch(cartAction.getAllCart(email));
        } catch (e) {
            console.log('err: ', e);
        }
    };

    const handleRemoveFromCart = async (data: any) => {
        try {
            const params = {
                email: email,
                course_id: data.course_id,
            };
            await dispatch(cartAction.removeFromCart(params));
        } catch (e) {
            console.log('err: ', e);
        }
    };

    const handleCalculateSubTotal = (data: any[]) => {
        let total: any = 0;
        data.forEach((item) => {
            total += item?.price;
        });
        setSubTotal(total);
    };

    const handleCheckoutStripe = async () => {
        const orderInfor: OrderType = {
            email: email,
            total_cost: subTotal,
            list_course: listCourse,
            payment_method: form.getFieldValue('paymentMethod'),
        };
        try {
            const resAddOrder = await orderApi.add(orderInfor);
            if (resAddOrder)
                if (
                    orderInfor.payment_method &&
                    resAddOrder?.data?.errCode === 0
                ) {
                    orderInfor.order_id = resAddOrder.data?.data?._id;
                    const res = await paymentApi.checkout(orderInfor);
                    if (res?.data?.data?.url) {
                        window.location.replace(res.data.data.url);
                    }
                } else {
                    await handleDeleteAllCart();
                    await handleGetAllCart(email);
                    toast.success(resAddOrder?.data?.errMessage);
                }
        } catch (error) {
            console.log('err:', error);
        }
    };

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

    console.log('list course: ', listCourse);

    return (
        <div className="cart">
            <Row>
                <Col span={18}>
                    <div className="cart-list">
                        {listCourse && listCourse.length > 0 ? (
                            listCourse.map((item: CartType) => {
                                return (
                                    <div className="cart-item">
                                        <div className="cart-left">
                                            <img
                                                src={item?.img_url}
                                                alt=""
                                                className="productImg"
                                                onClick={() => {
                                                    navigate(
                                                        `/detail-course/${item?.course_id}`,
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="cart-mid">
                                            <span>{item?.name}</span>
                                            <span>{item?.price} $</span>
                                        </div>
                                        <div className="cart-right">
                                            <CloseOutlined
                                                style={{
                                                    fontSize: 20,
                                                    color: 'red',
                                                }}
                                                onClick={() => {
                                                    handleRemoveFromCart(item);
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <h1 style={{ color: 'red' }}>
                                Không có khóa học nào trong giỏ hàng
                            </h1>
                        )}
                    </div>
                </Col>
                <Col span={6}>
                    <div className="cart-summary">
                        <div className="summary-header">Order summary</div>
                        <div className="summary-detail ">
                            <div className="summary-detail-item summary-sub-total">
                                <label>Tổng thanh toán:</label>
                                <span>{`${subTotal} $`}</span>
                            </div>
                        </div>
                        <div className="form-payment">
                            <Form
                                layout="vertical"
                                form={form}
                                id="form-payment"
                                onFinish={handleCheckoutStripe}
                            >
                                <Form.Item
                                    label="Phương thức thanh toán"
                                    name="paymentMethod"
                                    labelAlign="left"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng chọn phương thức thanh toán!',
                                        },
                                    ]}
                                >
                                    <Radio.Group>
                                        <Space direction="vertical">
                                            <Radio value={true}>
                                                <img
                                                    src={stripe}
                                                    style={{
                                                        width: 100,
                                                        objectFit: 'cover',
                                                    }}
                                                ></img>
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                {isOnline && subTotal !== 0 && (
                                    <Button
                                        className="summary-payment"
                                        form="form-payment"
                                        htmlType="submit"
                                    >
                                        Thanh toán
                                    </Button>
                                )}
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
