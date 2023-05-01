import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { videoApi } from '../../api/videoApi';
import '../../asset/style/ModalDetailVideo.scss';
import { VideoType } from '../../type/type';

export type Props = {
    _id?: string;
    handleClose: any;
};
export const ModalDetailVideo = ({
    _id,
    handleClose,
}: Props): React.ReactElement => {
    const [dataView, setDataView] = useState<VideoType>();
    useEffect(() => {
        _id && handleGetDetailNews(_id);
    }, [_id]);

    const handleGetDetailNews = async (_id: string): Promise<any> => {
        try {
            const params = {
                _id: _id,
            };
            const res = await videoApi.getDetail(params);
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
                className="modal-detail-video"
                title={<span className="video-name">{dataView?.name}</span>}
                open={true}
                onOk={handleClose}
                onCancel={handleClose}
                footer={null}
                width={1000}
            >
                <div className="video-author">
                    <img
                        className="author-avatar"
                        src={dataView?.author?.avatar}
                    />
                    <span>{dataView?.author?.fullName}</span>
                </div>
                <div className="video-content">
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
            </Modal>
        </>
    );
};
