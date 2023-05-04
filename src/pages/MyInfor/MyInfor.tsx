import { Button, Form, Input } from 'antd';
import '../../asset/style/MyInfor.scss';
import { useEffect, useState } from 'react';
import { UserAddOutlined, EditOutlined } from '@ant-design/icons';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { toast } from 'react-toastify';
import { userApi } from '../../api/userApi';
import { UserType } from '../../type/type';
import { ChangePasswordModal } from './ChangePasswordModal';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { commonAction } from '../../store/action/commonAction';

export const MyInfor = (): React.ReactElement => {
    const dispatch: AppDispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const [form] = Form.useForm();
    const [selectedFile, setSelectedFile] = useState<any>();
    const [preview, setPreview] = useState<string>();
    const [userData, setUserData] = useState<any>();
    const [type, setType] = useState<boolean>(true);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const handleCancel = () => {
        setIsOpenModal(false);
    };

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    useEffect(() => {
        handleGetDetailUser();
    }, []);

    useEffect(() => {
        userData && handleFillForm(userData);
    }, [userData]);

    const handleGetDetailUser = async (): Promise<any> => {
        try {
            const params = {
                email,
            };
            const res = await userApi.getDetailUser(params);
            if (res?.data?.data) {
                setUserData(res?.data?.data);
                setType(true);
            }
        } catch (error) {
            console.log('error:', error);
        }
    };

    const handleFillForm = (data: UserType) => {
        form.setFieldValue('email', data.email);
        form.setFieldValue('fullName', data.fullName);
        form.setFieldValue('address', data.address);
        setPreview(data.avatar);
    };

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setSelectedFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            return preview;
        }
        const imageRef = ref(storage, `image/${selectedFile.name + v4()}`);
        await uploadBytesResumable(imageRef, selectedFile);
        const res = await getDownloadURL(imageRef);
        return res;
    };

    const onFinish = async (values: any) => {
        try {
            const imgUrl = await uploadImage();
            const data = {
                ...values,
                avatar: `${imgUrl}`,
            };
            const res = await userApi.edit(data);
            if (res?.data?.errCode === 0) {
                toast.success(res.data?.errMessage);
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const data = {
                    ...user,
                    fullName: res?.data?.data?.fullName,
                    avatar: res?.data?.data?.avatar,
                };
                dispatch(
                    commonAction.changeUserInfor({
                        fullName: data.fullName,
                        avatar: data.avatar,
                    }),
                );
                localStorage.setItem('user', JSON.stringify(data));
                setType(true);
            }
        } catch (error) {
            console.log('err: ', error);
        }
    };
    return (
        <div className="my-infor">
            <div className="my-infor-left">
                <div className="upload">
                    <input
                        type="file"
                        id="file-upload"
                        onChange={onSelectFile}
                    />
                    {selectedFile ? (
                        <img src={preview} className="preview-img" />
                    ) : (
                        <img src={userData?.avatar} className="preview-img" />
                    )}
                    {!type && (
                        <label
                            htmlFor="file-upload"
                            className="custom-file-upload"
                        >
                            <UserAddOutlined style={{ fontSize: 16 }} />
                        </label>
                    )}
                </div>
            </div>

            <div className="my-infor-center">
                <Form
                    style={{ padding: '15px 0' }}
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    labelAlign="left"
                    layout="vertical"
                    id="form"
                >
                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống',
                            },
                        ]}
                    >
                        <Input disabled={type} />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống !',
                            },
                        ]}
                    >
                        <Input disabled={type} />
                    </Form.Item>
                </Form>
                <Button
                    htmlType="submit"
                    form="form"
                    type="primary"
                    style={{ width: 100, marginTop: 32 }}
                    disabled={type}
                >
                    Lưu
                </Button>
                <Button
                    style={{ marginLeft: 24 }}
                    disabled={type}
                    onClick={() => setType(true)}
                >
                    Hủy chỉnh sửa
                </Button>
            </div>
            <div className="my-infor-right">
                <Button className="change-info" onClick={() => setType(false)}>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            marginRight: 12,
                        }}
                    />
                    Chỉnh sửa thông tin
                </Button>
                <Button
                    className="change-password"
                    onClick={() => setIsOpenModal(true)}
                >
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            marginRight: 12,
                        }}
                    />
                    Đổi mật khẩu
                </Button>
            </div>
            {isOpenModal && (
                <ChangePasswordModal
                    isOpenModal={isOpenModal}
                    handleCancel={handleCancel}
                />
            )}
        </div>
    );
};
