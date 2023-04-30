import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { newsApi } from '../../api/newsApi';
import '../../asset/style/DetailNew.scss';
import { Comment } from '../../component/Comment/Comment';
import { NewsType } from '../../type/type';

export const DetailNew = (): React.ReactElement => {
    const params = useParams();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const [dataView, setDataView] = useState<NewsType>();

    console.log('user_id:', user_id);

    useEffect(() => {
        params?._id && handleGetDetailNews(params._id);
    }, [params?._id]);

    const handleGetDetailNews = async (_id: string): Promise<any> => {
        try {
            const params = {
                _id: _id,
            };
            const res = await newsApi.getDetail(params);
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
            await newsApi.increaseView(data);
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
                    <div
                        className="view-news-content"
                        dangerouslySetInnerHTML={
                            dataView?.contentHTML
                                ? { __html: dataView.contentHTML }
                                : undefined
                        }
                    ></div>
                </div>
            </div>
            <div className="news-right">
                {user_id && (
                    <Comment _id={params?._id} user_id={user_id} type="new" />
                )}
            </div>
        </div>
    );
};
