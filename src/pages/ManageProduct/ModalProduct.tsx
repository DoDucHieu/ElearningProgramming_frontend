import {
    Button,
    Form,
    Input,
    Select,
    Modal,
    InputNumber,
    DatePicker,
} from 'antd';
import '../../asset/style/ModalProduct.scss';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { ProductType } from '../../type/type';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/en_US';
import { toast } from 'react-toastify';

type Props = {
    handleClose: () => void;
    getAllProduct: (params: SearchParams) => Promise<any>;
    typeModal: string;
    dataToModal: ProductType;
};

type Option = {
    label: string;
    value: string;
};

export const ModalProduct = ({
    handleClose,
    typeModal,
    getAllProduct,
    dataToModal,
}: Props): React.ReactElement => {
    const [form] = Form.useForm();
    const [selectedFile, setSelectedFile] = useState<any>();
    const [preview, setPreview] = useState<string>();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [option, setOption] = useState<Option[]>();

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
        handleGetAllCategory({ page, size, keyword });
    }, []);

    useEffect(() => {
        if (typeModal === 'edit') handleFillForm(dataToModal);
    }, []);

    const handleFillForm = (data: ProductType) => {
        form.setFieldValue('productName', data.productName);
        form.setFieldValue('categoryName', data.categoryName);
        form.setFieldValue('description', data.description);
        form.setFieldValue('price', data.price);
        form.setFieldValue(
            'datePublish',
            dayjs(data.datePublish, CONSTANT.FORMAT_DATE),
        );
        setPreview(data.imgUrl);
    };

    const handleGetAllCategory = async (params: SearchParams): Promise<any> => {
        try {
            const res = await categoryApi.getAll(params);
            if (res?.data?.listCategory) {
                console.log(res.data.listCategory);

                const arr = formatCategory(res.data.listCategory);
                setOption(arr);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formatCategory = (data: any) => {
        const arr: Option[] = data.map((item: any) => {
            return {
                label: item.categoryName,
                value: item.categoryName,
            };
        });
        return arr;
    };

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setSelectedFile(e.target.files[0]);
        console.log('file:', e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            if (typeModal === 'add') return;
            else return preview;
        }
        const imageRef = ref(storage, `videos/${selectedFile.name + v4()}`);
        await uploadBytesResumable(imageRef, selectedFile);
        const res = await getDownloadURL(imageRef);
        return res;
    };

    const onFinish = async (values: any) => {
        try {
            const imgUrl = await uploadImage();
            const data = {
                ...values,
                datePublish: dayjs(values.datePublish).format(
                    CONSTANT.FORMAT_DATE,
                ),
                imgUrl: `${imgUrl}`,
            };

            if (typeModal === 'add') {
                const res = await productApi.add(data);
                if (res?.data) toast.success(res.data.errMessage);
            } else {
                data._id = dataToModal._id;
                const res = await productApi.update(data);
                if (res?.data) toast.success(res.data.errMessage);
            }
            handleClose();
            const res = await getAllProduct({
                page,
                size,
                keyword,
            });
            if (res?.data) toast.success(res.data.errMessage);
        } catch (error) {
            console.log('err: ', error);
        }
    };

    return (
        <Modal
            className="modal-product"
            title={
                typeModal === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'
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
                    label="Tên sản phẩm"
                    name="productName"
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
                    label="Thể loại"
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: 'Không được để trống',
                        },
                    ]}
                >
                    <Select options={option ?? undefined} />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: 'Không được để trống !',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Giá tiền"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: 'Không được để trống',
                        },
                    ]}
                >
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item
                    label="Ngày ra mắt"
                    name="datePublish"
                    rules={[
                        {
                            required: true,
                            message: 'Không được để trống',
                        },
                    ]}
                >
                    <DatePicker locale={locale} format={CONSTANT.FORMAT_DATE} />
                </Form.Item>
            </Form>
            <div className="upload">
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload
                </label>
                <input type="file" id="file-upload" onChange={onSelectFile} />
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
                        <img src={dataToModal.imgUrl} className="preview-img" />
                        {/* <video width="400" controls>
                            <source src={dataToModal.imgUrl} />
                        </video> */}
                    </>
                )}
            </div>
            <Button
                htmlType="submit"
                form="form"
                type="primary"
                style={{ width: 100, marginTop: 32 }}
            >
                {typeModal === 'edit' ? 'Save' : 'Thêm'}
            </Button>
            <Button
                style={{ width: 100, marginTop: 32, marginLeft: 16 }}
                onClick={() => {
                    handleClose();
                }}
            >
                Hủy
            </Button>
        </Modal>
    );
};
