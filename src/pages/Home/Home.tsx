import { Card, Carousel, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import '../../asset/style/Home.scss';
import adidas from '../../asset/video/adidas.mp4';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CONSTANT } from '../../constant/constant';
import { NewsType, ProductType } from '../../type/type';
import { SearchParams } from '../../type/common';
import { productApi } from '../../api/productApi';
import { NewComponent } from '../News/NewComponent';
import { newsApi } from '../../api/newsApi';
export const Home = (): React.ReactElement => {
    const navigate = useNavigate();
    const [listProduct, setListProduct] = useState<ProductType[]>([]);
    const [listNews, setListNews] = useState<NewsType[]>();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;

    useEffect(() => {
        handleGetAllProduct({
            page,
            size,
            keyword,
        });
        handleGetAllNews({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllProduct = async (params: SearchParams): Promise<any> => {
        try {
            const res = await productApi.getAll(params);
            if (res?.data?.listProduct) {
                const arr = handleFormatData(res.data.listProduct);
                setListProduct(arr);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormatData = (data: any) => {
        const arr: ProductType[] = data.map((item: any) => {
            return {
                _id: item._id,
                productName: item.productName,
                description: item.description,
                categoryName: item.categoryName,
                imgUrl: item.imgUrl,
                price: item.price,
                datePublish: item.datePublish,
            };
        });
        return arr;
    };

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
    return (
        <>
            <div className="home">
                <div className="banner">
                    <video
                        autoPlay
                        muted
                        loop
                        style={{
                            width: '100%',
                            height: '86vh',
                            objectFit: 'cover',
                        }}
                    >
                        <source src={adidas} type="video/mp4" />
                    </video>
                    <div className="page-header">
                        <div className="page-header-title">
                            Introducing Footware
                        </div>
                        <div className="page-header-content">
                            <h1>A SPRINGY RIDE FOR EVERY RUN</h1>
                            <span>
                                Back in its fouth decade, the Footware 40 is
                                springier than ever and offers runners of all
                                kinds a perfect fit.
                            </span>
                            <div
                                className="join-us"
                                onClick={() => navigate('/product')}
                            >
                                Shop
                            </div>
                        </div>
                    </div>

                    <Carousel autoplay>
                        <div>
                            <video
                                autoPlay
                                muted
                                loop
                                style={{
                                    width: '100%',
                                    height: '86vh',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={adidas} type="video/mp4" />
                            </video>
                        </div>
                        <div>
                            <video
                                autoPlay
                                muted
                                loop
                                style={{
                                    width: '100%',
                                    height: '86vh',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={adidas} type="video/mp4" />
                            </video>
                        </div>
                        <div>
                            <video
                                autoPlay
                                muted
                                loop
                                style={{
                                    width: '100%',
                                    height: '86vh',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={adidas} type="video/mp4" />
                            </video>
                        </div>
                        <div>
                            <video
                                autoPlay
                                muted
                                loop
                                style={{
                                    width: '100%',
                                    height: '86vh',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={adidas} type="video/mp4" />
                            </video>
                        </div>
                        <div>
                            <video
                                autoPlay
                                muted
                                loop
                                style={{
                                    width: '100%',
                                    height: '86vh',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={adidas} type="video/mp4" />
                            </video>
                        </div>
                    </Carousel>
                </div>

                <div className="page-header">
                    <div className="page-header-title"></div>
                    <div className="page-header-content">
                        <h1>ALL PRODUCT WITH MANY CATEGORY HERE</h1>
                        <span>
                            There are various products, they are the best choice
                            for you
                        </span>
                        <div
                            className="join-us"
                            onClick={() => navigate('/product')}
                        >
                            Shop
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-title">Khóa học trả phí</div>
                    <Row>
                        {listProduct &&
                            listProduct.map((item: ProductType) => {
                                return (
                                    item?.categoryName === 'Adidas' && (
                                        <Col span={6}>
                                            <NewComponent
                                                new_id={item._id}
                                                name={item?.productName}
                                                view={item?.price}
                                            />
                                        </Col>
                                    )
                                );
                            })}
                    </Row>
                </div>
                <div className="category">
                    <div className="category-title">Khóa học miễn phí</div>
                    <Row>
                        {listProduct &&
                            listProduct.map((item: ProductType) => {
                                return (
                                    item?.categoryName === 'Nike' && (
                                        <Col span={6}>
                                            <Card
                                                className="item"
                                                hoverable
                                                cover={
                                                    <img
                                                        style={{
                                                            height: 250,
                                                            objectFit: 'cover',
                                                        }}
                                                        alt="example"
                                                        src={item?.imgUrl}
                                                    />
                                                }
                                                onClick={() => {
                                                    navigate(
                                                        `/detail-product/${item._id}`,
                                                    );
                                                }}
                                            >
                                                <Meta
                                                    title={item?.productName}
                                                    description={
                                                        item?.description
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    )
                                );
                            })}
                    </Row>
                </div>
                <div className="page-header">
                    <div className="page-header-title"></div>
                    <div className="page-header-content">
                        <h1>AIR IN THE FAMILY OF ALL PEOPLE</h1>
                        <span>
                            Highlight the unique vibe of each member of the
                            squad in the Air Max 90.
                        </span>
                        <div
                            className="join-us"
                            onClick={() => navigate('/product')}
                        >
                            Shop
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-title">Video nổi bật</div>
                    <Row>
                        {listProduct &&
                            listProduct.map((item: ProductType) => {
                                return (
                                    item?.categoryName === 'Nike' && (
                                        <Col span={6}>
                                            <Card
                                                className="item"
                                                hoverable
                                                cover={
                                                    <img
                                                        style={{
                                                            height: 250,
                                                            objectFit: 'cover',
                                                        }}
                                                        alt="example"
                                                        src={item?.imgUrl}
                                                    />
                                                }
                                                onClick={() => {
                                                    navigate(
                                                        `/detail-product/${item._id}`,
                                                    );
                                                }}
                                            >
                                                <Meta
                                                    title={item?.productName}
                                                    description={
                                                        item?.description
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    )
                                );
                            })}
                    </Row>
                </div>

                <div className="category">
                    <div className="category-title">Bài viết nổi bật</div>
                    <Row>
                        {listNews &&
                            listNews.map((item: NewsType) => {
                                return (
                                    <Col span={6}>
                                        <NewComponent
                                            new_id={item._id}
                                            name={item?.name}
                                            view={item?.view}
                                        />
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
            </div>
        </>
    );
};
