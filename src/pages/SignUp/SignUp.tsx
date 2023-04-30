import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import img from '../../asset/image/sign_in_bg.jpg';
import loginIcon from '../../asset/image/login.png';
import { userApi } from '../../api/userApi';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const SignUp = (): React.ReactElement => {
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    useEffect(() => {
        role && role === 'user' && navigate('/');
        role && role === 'admin' && navigate('/manage-accoount');
    }, []);

    const onFinish = async (values: any) => {
        try {
            const res = await userApi.signUp({
                email: values.email,
                password: values.password,
            });
            if (res?.data?.errCode === 0) {
                const data = {
                    user_id: res.data.userInfor._id,
                    email: res.data.userInfor.email,
                    role: res.data.userInfor.role,
                    fullName: res.data.userInfor.fullName,
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                };
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'user') navigate('/');
                if (data.role === 'admin') navigate('/manage-account');
            }
        } catch (e: any) {
            console.log(e);
            toast.error(e?.response?.data?.errMessage);
        }
    };

    return (
        <Row style={{ height: '100vh' }}>
            <Col span={12} style={{ background: 'gray' }}>
                <img
                    src={img}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </Col>
            <Col span={12}>
                <div
                    className="formLogin"
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <img
                        src={loginIcon}
                        style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            marginBottom: 24,
                        }}
                    />
                    <h2 style={{ margin: 24, fontSize: 32 }}>Sign up</h2>
                    <Form
                        onFinish={onFinish}
                        layout="vertical"
                        style={{ width: '60%' }}
                        form={loginForm}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này không được để trống!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Không được để trống',
                                },
                                {
                                    pattern: new RegExp(
                                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                                    ),
                                    message:
                                        'Mật khẩu gồm chữ hoa chữ thường và số, tối thiểu 8 ký tự',
                                },
                            ]}
                        >
                            <Input.Password size="large" />
                        </Form.Item>
                        <Form.Item
                            label="Confirm password"
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Không được để trống',
                                },
                                {
                                    pattern: new RegExp(
                                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                                    ),
                                    message:
                                        'Mật khẩu gồm chữ hoa chữ thường và số, tối thiểu 8 ký tự',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue('password') === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'Xác nhận mật khẩu không chính xác!',
                                            ),
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%', marginTop: 32 }}
                                size="large"
                            >
                                Sign up
                            </Button>
                        </Form.Item>
                        <span
                            style={{
                                color: 'green',
                                fontSize: 14,
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                navigate('/sign-in');
                            }}
                        >
                            Sign in here!
                        </span>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};
