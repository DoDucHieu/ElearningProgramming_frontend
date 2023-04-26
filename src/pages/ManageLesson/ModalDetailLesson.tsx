import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { LessonType } from '../../type/type';
import { lessonApi } from '../../api/lessonApi';
import '../../asset/style/ModalDetailLesson.scss';

export type Props = {
    _id?: string;
    handleClose: any;
};
export const ModalDetailLesson = ({
    _id,
    handleClose,
}: Props): React.ReactElement => {
    const [dataView, setDataView] = useState<LessonType>();
    useEffect(() => {
        _id && handleGetDetailLesson(_id);
    }, [_id]);

    const handleGetDetailLesson = async (_id: string): Promise<any> => {
        try {
            const params = {
                _id: _id,
            };
            const res = await lessonApi.getDetail(params);
            if (res?.data?.data) {
                setDataView(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Modal
                className="modal-detail-lesson"
                title={'Chi tiết bài học'}
                open={true}
                onOk={handleClose}
                onCancel={handleClose}
                footer={null}
                width={1000}
            >
                <h1 className="lesson-name">{dataView?.name}</h1>
                <div className="lesson-content">
                    {dataView?.type ? (
                        <div className="lesson-content-video">
                            <video
                                autoPlay
                                loop
                                controls
                                style={{
                                    width: '700px',
                                    height: '400px',
                                    objectFit: 'cover',
                                }}
                                src={dataView?.video_url}
                            ></video>
                        </div>
                    ) : (
                        <div
                            className="lesson-content-post"
                            dangerouslySetInnerHTML={
                                dataView?.contentHTML
                                    ? { __html: dataView.contentHTML }
                                    : undefined
                            }
                        ></div>
                    )}
                </div>
            </Modal>
        </>
    );
};
