import { Button, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { newsApi } from '../../api/newsApi';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { NewsType } from '../../type/type';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import '../../asset/style/ModalNews.scss';
import { v4 } from 'uuid';
import { storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const mdParser = new MarkdownIt();

type Props = {
    handleClose: () => void;
    getAllNews?: (params: SearchParams) => Promise<any>;
    typeModal: string;
    dataToModal?: NewsType;
};

export const ModalNews = ({
    handleClose,
    getAllNews,
    typeModal,
    dataToModal,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const [contentMarkdown, setContentMarkdown] = useState<any>('');
    const [contentHTML, setContentHTML] = useState<any>('');
    const [selectedFile, setSelectedFile] = useState<any>();
    const [preview, setPreview] = useState<string>();

    const handleEditorChange = ({ html, text }: any) => {
        setContentHTML(html);
        setContentMarkdown(text);
    };

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

    const handleFillForm = (data: NewsType) => {
        form.setFieldValue('name', data.name);
        form.setFieldValue('description', data.description);
        setContentHTML(data.contentHTML);
        setContentMarkdown(data.contentMarkdown);
        setPreview(data.img_url);
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
        const imageRef = ref(storage, `image/${selectedFile.name + v4()}`);
        await uploadBytesResumable(imageRef, selectedFile);
        const res = await getDownloadURL(imageRef);
        return res;
    };

    const onFinish = async () => {
        const imgUrl = await uploadImage();
        const data: NewsType = {
            name: form.getFieldValue('name'),
            description: form.getFieldValue('description'),
            contentHTML,
            contentMarkdown,
            img_url: imgUrl,
            author: user_id,
        };
        if (typeModal === 'add') handleAddNews(data);
        if (typeModal === 'edit' && dataToModal) {
            data._id = dataToModal._id;
            handleEditNews(data);
        }
    };

    const handleAddNews = async (news: NewsType): Promise<any> => {
        try {
            const res = await newsApi.add(news);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllNews) await getAllNews({ page, size });
                }
                if (res.data.errCode === 1) toast.error(res.data.errMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    const handleEditNews = async (news: NewsType): Promise<any> => {
        try {
            const res = await newsApi.edit(news);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllNews) await getAllNews({ page, size });
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
                        ? 'Chỉnh sửa bài đăng'
                        : 'Thêm bài đăng'
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
                        label="Tên bài đăng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống',
                            },
                        ]}
                    >
                        <Input disabled={typeModal === 'edit' ? true : false} />
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
                <div className="editor-component">
                    <MdEditor
                        className="markdown"
                        style={{ height: '650px' }}
                        renderHTML={(text: any) => mdParser.render(text)}
                        onChange={handleEditorChange}
                        value={contentMarkdown}
                    />
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
