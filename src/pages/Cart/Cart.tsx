import { Button, Col, Form, Input, Radio, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../asset/style/Cart.scss';
import stripe from '../../asset/image/stripe.png';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { cartAction } from '../../store/action/cartAction';
import { AppDispatch, RootState } from '../../store/store';
import { CartType, OrderType } from '../../type/type';
import { paymentApi } from '../../api/PaymentApi';
import { orderApi } from '../../api/OrderApi';
import { cartApi } from '../../api/cartApi';
import { toast } from 'react-toastify';

export const Cart = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const listProduct = useSelector(
        (state: RootState) => state.cartReducer.arrProduct,
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
        handleCalculateSubTotal(listProduct);
    }, [listProduct]);

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
                productId: data.productId,
            };
            await dispatch(cartAction.removeFromCart(params));
        } catch (e) {
            console.log('err: ', e);
        }
    };

    const handleAddToCart = async (data: CartType, type: boolean) => {
        try {
            const newData: CartType = {
                email: email,
                productId: data?.productId,
                productName: data?.productName,
                imgUrl: data?.imgUrl,
                price: data?.price,
                quantity: type ? 1 : -1,
            };
            await dispatch(cartAction.addToCart(newData));
        } catch (e) {
            console.log('error: ', e);
        }
    };

    const handleCalculateSubTotal = (data: any[]) => {
        let total: any = 0;
        data.forEach((item) => {
            total += item?.price * item?.quantity;
        });
        setSubTotal(total);
    };

    const handleCheckoutStripe = async () => {
        const orderInfor: OrderType = {
            email: email,
            totalCost: subTotal,
            listProduct,
            receiveAddress: form.getFieldValue('receiveAddress'),
            paymentMethod: form.getFieldValue('paymentMethod'),
        };
        try {
            const resAddOrder = await orderApi.add(orderInfor);
            if (resAddOrder)
                if (
                    orderInfor.paymentMethod &&
                    resAddOrder?.data?.errCode === 0
                ) {
                    orderInfor.orderId = resAddOrder.data?.data?._id;
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

    return (
        <div className="cart">
            <Row>
                <Col span={18}>
                    <div className="cart-list">
                        {listProduct && listProduct.length > 0 ? (
                            listProduct.map((item) => {
                                return (
                                    <div className="cart-item">
                                        <div className="cart-left">
                                            <img
                                                src={item?.imgUrl}
                                                alt=""
                                                className="productImg"
                                                onClick={() => {
                                                    navigate(
                                                        `/detail-product/${item?.productId}`,
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="cart-mid">
                                            <span>{item?.productName}</span>
                                            <span>{item?.price} $</span>
                                            <div className="quantity">
                                                <div className="quantity-minus">
                                                    <MinusOutlined
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            item?.quantity >
                                                                1 &&
                                                                handleAddToCart(
                                                                    item,
                                                                    false,
                                                                );
                                                        }}
                                                    />
                                                </div>
                                                <div className="quantity-number">
                                                    {item?.quantity}
                                                </div>
                                                <div className="quantity-plus">
                                                    <PlusOutlined
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                item,
                                                                true,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <span>
                                                {item?.price * item?.quantity} $
                                            </span>
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
                                Không có sản phẩm nào trong giỏ hàng
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
                                    label="Địa chỉ nhận hàng"
                                    name="receiveAddress"
                                    labelAlign="left"
                                    rules={[
                                        {
                                            required: true,

                                            message:
                                                'Vui lòng nhập địa chỉ nhận hàng!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

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
                                            <Radio value={false}>
                                                Thanh toán sau khi nhận hàng
                                            </Radio>
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
