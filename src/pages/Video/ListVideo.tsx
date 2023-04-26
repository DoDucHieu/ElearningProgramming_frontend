import { Button, Col, Row } from 'antd';
import '../../asset/style/ListNew.scss';
import { NewsType } from '../../type/type';
import { useEffect, useState } from 'react';
import { CONSTANT } from '../../constant/constant';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../type/common';
import { ModalVideo } from '../ManageVideo/ModalVideo';
import { videoApi } from '../../api/videoApi';
import { VideoComponent } from './VideoComponent';

export const ListVideo = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userAccessToken = user.accessToken;
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [listNews, setListNews] = useState<NewsType[]>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    useEffect(() => {
        handleGetAllVideo({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllVideo = async (params: SearchParams): Promise<any> => {
        try {
            const res = await videoApi.getAll(params);
            if (res?.data?.data) {
                setListNews(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        setIsOpenModal(false);
    };

    return (
        <div className="list-new">
            <div className="list-new-header">
                <span className="list-new-title">Danh sách các video</span>
                <div className="btn-add-new">
                    {userAccessToken && (
                        <Button
                            type="primary"
                            onClick={() => setIsOpenModal(true)}
                        >
                            Đăng video
                        </Button>
                    )}
                </div>
            </div>
            <Row>
                {listNews &&
                    listNews.map((item: NewsType) => {
                        return item?.is_approved ? (
                            <Col span={6}>
                                <VideoComponent
                                    video_id={item._id}
                                    name={item?.name}
                                    view={item?.view}
                                    img_url={item?.img_url}
                                />
                            </Col>
                        ) : (
                            <></>
                        );
                    })}
            </Row>
            {isOpenModal && (
                <ModalVideo
                    handleClose={handleClose}
                    getAllVideo={handleGetAllVideo}
                    typeModal={'add'}
                />
            )}
        </div>
    );
};
