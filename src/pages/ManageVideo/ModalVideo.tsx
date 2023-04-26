import { Button, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { newsApi } from '../../api/newsApi';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { VideoType } from '../../type/type';
import 'react-markdown-editor-lite/lib/index.css';
import { v4 } from 'uuid';
import { storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { videoApi } from '../../api/videoApi';

type Props = {
    handleClose: () => void;
    getAllVideo?: (params: SearchParams) => Promise<any>;
    typeModal: string;
    dataToModal?: VideoType;
};

export const ModalVideo = ({
    handleClose,
    getAllVideo,
    typeModal,
    dataToModal,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const [selectedVideo, setSelectedVideo] = useState<any>();
    const [previewVideo, setPreviewVideo] = useState<any>();
    const [selectedImage, setSelectedImage] = useState<any>();
    const [previewImage, setPreviewImage] = useState<any>();

    useEffect(() => {
        if (!selectedVideo) {
            setPreviewVideo(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedVideo);
        setPreviewVideo(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedVideo]);

    useEffect(() => {
        if (!selectedImage) {
            setPreviewImage(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedImage);
        setPreviewImage(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);

    useEffect(() => {
        if (typeModal === 'edit' && dataToModal) handleFillForm(dataToModal);
    }, []);

    const handleFillForm = (data: VideoType) => {
        form.setFieldValue('name', data.name);
        form.setFieldValue('description', data.description);
        setPreviewVideo(data.video_url);
        setPreviewImage(data.img_url);
    };

    const onSelectVideo = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setSelectedVideo(e.target.files[0]);
        console.log('file:', e.target.files[0]);
    };

    const onSelectImage = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setSelectedImage(e.target.files[0]);
        console.log('file:', e.target.files[0]);
    };

    const uploadVideo = async () => {
        if (!selectedVideo) {
            console.log('jkjk', previewVideo);

            if (typeModal === 'add') return;
            else return previewVideo;
        }
        const imageRef = ref(storage, `video/${selectedVideo.name + v4()}`);
        await uploadBytesResumable(imageRef, selectedVideo);
        const res = await getDownloadURL(imageRef);
        return res;
    };

    const uploadImage = async () => {
        if (!selectedImage) {
            if (typeModal === 'add') return;
            else return previewImage;
        }
        const imageRef = ref(storage, `image/${selectedImage.name + v4()}`);
        await uploadBytesResumable(imageRef, selectedImage);
        const res = await getDownloadURL(imageRef);
        return res;
    };

    const onFinish = async () => {
        const videoUrl = await uploadVideo();
        const imgUrl = await uploadImage();
        const data: VideoType = {
            name: form.getFieldValue('name'),
            description: form.getFieldValue('description'),
            img_url: imgUrl,
            video_url: videoUrl,
            author: email,
        };
        if (typeModal === 'add') handleAddVideo(data);
        if (typeModal === 'edit' && dataToModal) {
            data._id = dataToModal._id;
            handleEditVideo(data);
        }
    };

    const handleAddVideo = async (news: VideoType): Promise<any> => {
        try {
            const res = await videoApi.add(news);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllVideo) await getAllVideo({ page, size });
                }
                if (res.data.errCode === 1) toast.error(res.data.errMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    const handleEditVideo = async (news: VideoType): Promise<any> => {
        try {
            const res = await videoApi.edit(news);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllVideo) await getAllVideo({ page, size });
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
                title={typeModal === 'edit' ? 'Chỉnh sửa video' : 'Thêm video'}
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
                        label="Tên video"
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
                    <label
                        htmlFor="file-upload-image"
                        className="custom-file-upload"
                    >
                        Upload
                    </label>
                    <input
                        type="file"
                        id="file-upload-image"
                        onChange={onSelectImage}
                    />
                    {typeModal === 'add' ? (
                        selectedImage ? (
                            <img src={previewImage} className="preview-img" />
                        ) : (
                            <></>
                        )
                    ) : selectedImage ? (
                        <img src={previewImage} className="preview-img" />
                    ) : (
                        <>
                            <img
                                src={dataToModal && dataToModal?.img_url}
                                className="preview-img"
                            />
                        </>
                    )}
                </div>
                <div className="upload">
                    <label
                        htmlFor="file-upload-video"
                        className="custom-file-upload"
                    >
                        Upload
                    </label>
                    <input
                        type="file"
                        id="file-upload-video"
                        onChange={onSelectVideo}
                    />
                    {typeModal === 'add' ? (
                        selectedVideo ? (
                            <video
                                autoPlay
                                loop
                                controls
                                style={{
                                    width: '400px',
                                    height: '400px',
                                    objectFit: 'cover',
                                    marginLeft: 40,
                                }}
                                src={previewVideo}
                            ></video>
                        ) : (
                            <></>
                        )
                    ) : selectedVideo ? (
                        <video
                            autoPlay
                            loop
                            controls
                            style={{
                                width: '400px',
                                height: '400px',
                                objectFit: 'cover',
                                marginLeft: 40,
                            }}
                            src={previewVideo}
                        ></video>
                    ) : (
                        <>
                            <video
                                autoPlay
                                loop
                                controls
                                style={{
                                    width: '400px',
                                    height: '400px',
                                    objectFit: 'cover',
                                    marginLeft: 40,
                                }}
                                src={dataToModal && dataToModal?.video_url}
                            ></video>
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
