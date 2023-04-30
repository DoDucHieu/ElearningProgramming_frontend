import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../asset/style/DetailNew.scss';
import { Comment } from '../../component/Comment/Comment';
import { VideoType } from '../../type/type';
import { videoApi } from '../../api/videoApi';

export const DetailVideo = (): React.ReactElement => {
    const params = useParams();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const [dataView, setDataView] = useState<VideoType>();

    useEffect(() => {
        params?._id && handleGetDetailVideo(params._id);
    }, [params?._id]);

    const handleGetDetailVideo = async (_id: string): Promise<any> => {
        try {
            const params = {
                _id: _id,
            };
            const res = await videoApi.getDetail(params);
            if (res?.data?.data) {
                setDataView(res.data.data);
                await handleIncreaseView(_id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleIncreaseView = async (_id: string): Promise<any> => {
        try {
            const data = {
                _id: _id,
            };
            await videoApi.increaseView(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="news">
            <div className="news-left">
                <h1 className="news-name">{dataView?.name}</h1>
                <div className="author">
                    <div className="author-avatar"></div>
                    <span>{dataView?.author}</span>
                </div>
                <div className="view-news">
                    <video
                        autoPlay
                        loop
                        controls
                        style={{
                            width: '1000px',
                            height: '600px',
                            objectFit: 'cover',
                            marginLeft: 40,
                        }}
                        src={dataView?.video_url}
                    ></video>
                </div>
            </div>
            <div className="news-right">
                {user_id && (
                    <Comment _id={params?._id} user_id={user_id} type="video" />
                )}
            </div>
        </div>
    );
};
