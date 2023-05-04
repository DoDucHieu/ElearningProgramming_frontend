import { Button, Form, Input, Modal, Radio, RadioChangeEvent } from 'antd';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import 'react-markdown-editor-lite/lib/index.css';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { lessonApi } from '../../api/lessonApi';
import { CONSTANT } from '../../constant/constant';
import { storage } from '../../firebaseConfig';
import { SearchParams } from '../../type/common';
import { LessonType } from '../../type/type';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
const mdParser = new MarkdownIt();

type Props = {
    handleClose: () => void;
    getAllLesson?: (params: any) => Promise<any>;
    typeModal: string;
    dataToModal?: LessonType;
};

export const ModalLesson = ({
    handleClose,
    getAllLesson,
    typeModal,
    dataToModal,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const params = useParams();
    const course_id = params.courseId;
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const [selectedVideo, setSelectedVideo] = useState<any>();
    const [previewVideo, setPreviewVideo] = useState<any>();
    const [typeLesson, setTypeLesson] = useState<boolean>(true);
    const [contentMarkdown, setContentMarkdown] = useState<any>('');
    const [contentHTML, setContentHTML] = useState<any>('');

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
        if (typeModal === 'edit' && dataToModal) handleFillForm(dataToModal);
    }, []);

    const handleFillForm = (data: LessonType) => {
        form.setFieldValue('name', data.name);
        form.setFieldValue('description', data.description);
        form.setFieldValue('type', data.type);
        setContentMarkdown(data.contentMarkdown);
        setTypeLesson(data.type);
        setPreviewVideo(data.video_url);
    };

    const onSelectVideo = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setSelectedVideo(e.target.files[0]);
    };

    const uploadVideo = async () => {
        if (!selectedVideo) {
            if (typeModal === 'add') return;
            else return previewVideo;
        }
        const imageRef = ref(storage, `video/${selectedVideo.name + v4()}`);
        await uploadBytesResumable(imageRef, selectedVideo);
        const res = await getDownloadURL(imageRef);
        return res;
    };

    const onFinish = async () => {
        const videoUrl = await uploadVideo();
        const data: LessonType = {
            course_id,
            name: form.getFieldValue('name'),
            description: form.getFieldValue('description'),
            type: typeLesson,
            video_url: videoUrl,
            contentHTML,
            contentMarkdown,
        };
        if (typeModal === 'add') handleAddLesson(data);
        if (typeModal === 'edit' && dataToModal) {
            data._id = dataToModal._id;
            handleEditLesson(data);
        }
    };

    const handleAddLesson = async (news: LessonType): Promise<any> => {
        try {
            const res = await lessonApi.add(news);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllLesson)
                        await getAllLesson({
                            page,
                            size,
                            course_id,
                        });
                }
                if (res.data.errCode === 1) toast.error(res.data.errMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    const handleEditLesson = async (news: LessonType): Promise<any> => {
        try {
            const res = await lessonApi.edit(news);
            if (res?.data) {
                if (res.data.errCode === 0) {
                    toast.success(res.data.errMessage);
                    if (getAllLesson)
                        await getAllLesson({
                            page,
                            size,
                            course_id,
                        });
                }
                if (res.data.errCode === 1) toast.error(res.data.errMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    const handleChangeTypeLesson = (e: RadioChangeEvent) => {
        setTypeLesson(e.target.value);
        if (e.target.value) {
            setContentMarkdown(contentMarkdown);
        } else {
            setSelectedVideo(null);
        }
    };

    const handleEditorChange = ({ html, text }: any) => {
        setContentHTML(html);
        setContentMarkdown(text);
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
                        label="Tiêu đề"
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
                        label="Loại bài học"
                        name="type"
                        rules={[
                            { required: true, message: 'Không được để trống' },
                        ]}
                    >
                        <Radio.Group onChange={handleChangeTypeLesson}>
                            <Radio value={true}>Video</Radio>
                            <Radio value={false}>Bài viết</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                {typeLesson ? (
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
                ) : (
                    <div className="editor-component">
                        <MdEditor
                            className="markdown"
                            style={{ height: '650px' }}
                            renderHTML={(text: any) => mdParser.render(text)}
                            onChange={handleEditorChange}
                            value={contentMarkdown}
                        />
                    </div>
                )}
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
