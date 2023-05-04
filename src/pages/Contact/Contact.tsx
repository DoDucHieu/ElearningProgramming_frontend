import { Button, Form, Input } from 'antd';
import '../../asset/style/Contact.scss';
import {
    MailOutlined,
    InstagramOutlined,
    FacebookOutlined,
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
export const Contact = (): React.ReactElement => {
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };
    return (
        <div className="contact">
            <div className="contact-bg">
                <div className="contact-left">
                    <h1>Cùng trò chuyện.</h1>
                    <h1>Hãy cho chúng tôi biết những điều</h1>
                    <h1>bạn muốn.</h1>
                    <div className="something-together">
                        Hãy làm mọi thứ cùng nhau bạn nhé!
                    </div>
                    <div className="associate-network">
                        <div className="app-email">
                            <MailOutlined />
                            <p>hieuncncnc@gmail.com</p>
                        </div>
                        <div className="app-email">
                            <InstagramOutlined />
                            <p>https://www.instagram.com/doduchieu_7</p>
                        </div>
                        <div className="app-email">
                            <FacebookOutlined />
                            <p>https://www.facebook.com/hieuncncnc</p>
                        </div>
                    </div>
                </div>
                <div className="contact-right">
                    <div className="form-contact">
                        <Form
                            form={form}
                            id="form-contact"
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập email của bạn!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập họ tên của bạn!',
                                    },
                                ]}
                            >
                                <Input placeholder="Họ tên" />
                            </Form.Item>

                            <Form.Item
                                name="reason"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập điều bạn muốn',
                                    },
                                ]}
                            >
                                <TextArea placeholder="Hãy cho chúng tôi biết điều bạn muốn" />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                form="form-contact"
                            >
                                Liên hệ
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
