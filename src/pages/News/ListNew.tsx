import { Button, Col, Row } from 'antd';
import '../../asset/style/ListNew.scss';
import { NewsType } from '../../type/type';
import { NewComponent } from './NewComponent';
import { useEffect, useState } from 'react';
import { CONSTANT } from '../../constant/constant';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../type/common';
import { newsApi } from '../../api/newsApi';
import { ModalNews } from '../ManageNew/ModalNews';
import { PaginationComponent } from '../../component/Pagination/PaginationComponent';
import { LoadingComponent } from '../../component/LoadingComponent/LoadingComponent';

export const ListNew = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userAccessToken = user.accessToken;
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [listNews, setListNews] = useState<NewsType[]>();
    const [totalRecord, setTotalRecord] = useState<number>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        handleGetAllNews({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllNews = async (params: SearchParams): Promise<any> => {
        try {
            const res = await newsApi.getAll(params);
            if (res?.data?.data) {
                setListNews(res.data.data);
                setTotalRecord(res.data.totalRecord);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        setIsOpenModal(false);
    };

    const handleSetLoading = (value: boolean) => {
        setLoading(value);
    };

    return (
        <div className="list-new">
            <div className="list-new-header">
                <span className="list-new-title">Danh sách các bài viết</span>
                <div className="btn-add-new">
                    {userAccessToken && (
                        <Button
                            type="primary"
                            onClick={() => setIsOpenModal(true)}
                        >
                            Đăng bài
                        </Button>
                    )}
                </div>
            </div>
            <Row>
                {listNews &&
                    listNews.map((item: NewsType) => {
                        return item?.is_approved ? (
                            <Col span={6}>
                                <NewComponent
                                    new_id={item._id}
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
            <div className="list-new-pagination">
                <PaginationComponent totalRecord={totalRecord} />
            </div>
            {isOpenModal && (
                <ModalNews
                    handleClose={handleClose}
                    getAllNews={handleGetAllNews}
                    typeModal={'add'}
                    setLoading={handleSetLoading}
                />
            )}
            {loading && <LoadingComponent />}
        </div>
    );
};
