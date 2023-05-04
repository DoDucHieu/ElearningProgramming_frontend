import { useEffect, useState } from 'react';
import { LessonType } from '../../type/type';
import { lessonApi } from '../../api/lessonApi';
import '../../asset/style/DetailLesson.scss';
import { Comment } from '../../component/Comment/Comment';

export type Props = {
    _id?: string;
};

export const DetailLesson = ({ _id }: Props): React.ReactElement => {
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
    console.log();

    return (
        <div className="detail-lesson-user">
            <div className="lesson-content">
                {dataView?.type ? (
                    <>
                        <div className="lesson-content-video">
                            <video
                                autoPlay
                                loop
                                controls
                                style={{
                                    width: '1000px',
                                    height: '600px',
                                    objectFit: 'cover',
                                }}
                                src={dataView?.video_url}
                            ></video>
                        </div>
                        <h1 className="lesson-name-video">{dataView?.name}</h1>
                    </>
                ) : (
                    <>
                        <h1 className="lesson-name-post">{dataView?.name}</h1>
                        <div
                            className="lesson-content-post"
                            dangerouslySetInnerHTML={
                                dataView?.contentHTML
                                    ? { __html: dataView.contentHTML }
                                    : undefined
                            }
                        ></div>
                    </>
                )}
            </div>
        </div>
    );
};
