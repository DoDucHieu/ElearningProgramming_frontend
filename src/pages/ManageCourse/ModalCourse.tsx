import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseApi } from '../../api/courseApi';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { CourseType } from '../../type/type';
import { v4 } from 'uuid';
import { storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

type Props = {
    handleClose: () => void;
    getAllCourse?: (params: SearchParams) => Promise<any>;
    typeModal: string;
    dataToModal?: CourseType;
};

export const ModalCourse = ({
    handleClose,
    getAllCourse,
    typeModal,
    dataToModal,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const [selectedFile, setSelectedFile] = useState<any>();
    const [preview, setPreview] = useState<string>();

    useEffect(() => {
        if (typeModal === 'edit' && dataToModal) handleFillForm(dataToModal);
    }, []);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFillForm = (data: CourseType) => {
        form.setFieldValue('name', data.name);
        form.setFieldValue('description', data.description);
        form.setFieldValue('price', data.price);
        setPreview(data.img_url);
    };

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setSelectedFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            if (typeModal === 'add') return;
            else return preview;
        }
        const imageRef = ref(storage, `image/${selectedFile.name + v4()}`);
        await uploadBytesResumable(imageRef, selectedFile);
        const res = await getDownloadURL(imageRef);
        return res;
    };

    const onFinish = async () => {
        const imgUrl = await uploadImage();
        const data: CourseType = {
            name: form.getFieldValue('name'),
            description: form.getFieldValue('description'),
            img_url: imgUrl,
            price: form.getFieldValue('price'),
        };
        if (typeModal === 'add') handleAddCourse(data);
        if (typeModal === 'edit' && dataToModal) {
            data._id = dataToModal._id;
            handleEditCourse(data);
        }
    };

    const handleAddCourse = async (course: CourseType): Promise<any> => {
        try {
            const res = await courseApi.add(course);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllCourse) await getAllCourse({ page, size });
                }
                if (res.data.errCode === 1) toast.error(res.data.errMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    const handleEditCourse = async (course: CourseType): Promise<any> => {
        try {
            const res = await courseApi.edit(course);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllCourse) await getAllCourse({ page, size });
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
        <div className="modal-new">
            <Modal
                title={
                    typeModal === 'edit'
                        ? 'Chỉnh sửa khóa học'
                        : 'Thêm khóa học'
                }
                open={true}
                onOk={handleClose}
                onCancel={handleClose}
                footer={null}
                width={1200}
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
                        label="Tên khóa học"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            { required: true, message: 'Không được để trống' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Đơn giá"
                        name="price"
                        rules={[
                            { required: true, message: 'Không được để trống' },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Form>
                <div className="upload">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Upload
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        onChange={onSelectFile}
                    />
                    {typeModal === 'add' ? (
                        selectedFile ? (
                            <img src={preview} className="preview-img" />
                        ) : (
                            <></>
                        )
                    ) : selectedFile ? (
                        <img src={preview} className="preview-img" />
                    ) : (
                        <>
                            <img
                                src={dataToModal && dataToModal?.img_url}
                                className="preview-img"
                            />
                        </>
                    )}
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    form="form"
                    style={{ marginTop: 16 }}
                >
                    Save
                </Button>
            </Modal>
        </div>
    );
};
