import { Button, Form, Input, Modal, Radio, Space } from 'antd';
import stripe from '../../asset/image/stripe.png';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { OrderType } from '../../type/type';
import { orderApi } from '../../api/OrderApi';

type Props = {
    handleClose: () => void;
    getAllOrder: (params: SearchParams) => Promise<any>;
    typeModal: string;
    dataToModal: OrderType;
    setLoading: any;
};

export const ModalOrder = ({
    handleClose,
    getAllOrder,
    typeModal,
    dataToModal,
    setLoading,
}: Props): React.ReactElement => {
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;

    useEffect(() => {
        if (typeModal === 'edit') handleFillForm(dataToModal);
    }, []);

    const handleFillForm = (data: OrderType) => {
        form.setFieldValue('email', data.email);
        form.setFieldValue('paymentMethod', data.payment_method);
    };

    const onFinish = () => {
        try {
            setLoading(true);
            const data: OrderType = {
                email: form.getFieldValue('email'),
                payment_method: form.getFieldValue('paymentMethod'),
            };
            if (typeModal === 'add') handleAddOrder(data);
            else {
                data.order_id = dataToModal.order_id;
                handleEditOrder(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrder = async (order: OrderType): Promise<any> => {
        try {
            const res = await orderApi.add(order);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    await getAllOrder({ page, size });
                }
                if (res.data.errCode === 1) toast.error(res.data.errMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    const handleEditOrder = async (order: OrderType): Promise<any> => {
        try {
            const res = await orderApi.edit(order);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    await getAllOrder({ page, size });
                }
                if (res.data.errCode === 1) toast.error(res.data.errMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    return (
        <>
            <Modal
                title={
                    typeModal === 'edit' ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng'
                }
                open={true}
                onOk={handleClose}
                onCancel={handleClose}
                footer={null}
                width={600}
            >
                <Form
                    style={{ padding: '15px 0' }}
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    labelAlign="left"
                    id="form"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống',
                            },
                            {
                                type: 'email',
                                message: 'Email không hợp lệ',
                            },
                        ]}
                    >
                        <Input disabled={typeModal === 'edit' ? true : false} />
                    </Form.Item>
                    <Form.Item
                        label="Phương thức thanh toán"
                        name="paymentMethod"
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống !',
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
                </Form>
                <Button type="primary" htmlType="submit" form="form">
                    Save
                </Button>
            </Modal>
        </>
    );
};
