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

export const ListNew = (): React.ReactElement => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [listNews, setListNews] = useState<NewsType[]>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

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
                <span className="list-new-title">Danh sách các bài viết</span>
                <div className="btn-add-new">
                    <Button type="primary" onClick={() => setIsOpenModal(true)}>
                        Đăng bài
                    </Button>
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
            {isOpenModal && (
                <ModalNews
                    handleClose={handleClose}
                    getAllNews={handleGetAllNews}
                    typeModal={'add'}
                />
            )}
        </div>
    );
};
