import { Card, Carousel, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import '../../asset/style/Home.scss';
import adidas from '../../asset/video/adidas.mp4';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CONSTANT } from '../../constant/constant';
import { CourseType, NewsType, ProductType, VideoType } from '../../type/type';
import { SearchParams } from '../../type/common';
import { productApi } from '../../api/productApi';
import { NewComponent } from '../News/NewComponent';
import { newsApi } from '../../api/newsApi';
import { VideoComponent } from '../Video/VideoComponent';
import { videoApi } from '../../api/videoApi';
import { courseApi } from '../../api/courseApi';
import { CourseComponent } from '../Course/CourseComponent';
export const Home = (): React.ReactElement => {
    const navigate = useNavigate();
    const [listProduct, setListProduct] = useState<ProductType[]>([]);
    const [listFreeCourse, setListFreeCourse] = useState<CourseType[]>([]);
    const [listProCourse, setListProCourse] = useState<CourseType[]>([]);
    const [listNews, setListNews] = useState<NewsType[]>();
    const [listVideos, setListVideos] = useState<VideoType[]>();
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
        handleGetAllVideo({
            page,
            size,
            keyword,
        });
        handleGetAllFreeCourse({
            page,
            size,
            keyword,
        });

        handleGetAllProCourse({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllFreeCourse = async (
        params: SearchParams,
    ): Promise<any> => {
        try {
            const res = await courseApi.getAllFreeCourse(params);
            if (res?.data?.data) {
                console.log('free: ', res.data);
                setListFreeCourse(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetAllProCourse = async (
        params: SearchParams,
    ): Promise<any> => {
        try {
            const res = await courseApi.getAllProCourse(params);
            if (res?.data?.data) {
                console.log('pro: ', res.data);
                setListProCourse(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetAllProduct = async (params: SearchParams): Promise<any> => {
        try {
            const res = await productApi.getAll(params);
            if (res?.data?.listProduct) {
                setListProduct(res.data.listProduct);
            }
        } catch (error) {
            console.log(error);
        }
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

    const handleGetAllVideo = async (params: SearchParams): Promise<any> => {
        try {
            const res = await videoApi.getAll(params);
            if (res?.data?.data) {
                setListVideos(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="home">
                <div className="banner">
                    <div className="page-header">
                        <div className="page-header-title">
                            Introducing elearning programming
                        </div>
                        <div className="page-header-content">
                            <h1>COMPREHENSIVE PROGRAMMING PLATFORM</h1>
                            <span>
                                Platform with many courses with a variety of
                                videos and articles.
                            </span>
                            <div
                                className="join-us"
                                onClick={() => navigate('/product')}
                            >
                                Course
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
                        <h1>ALL COURSE WITH MANY PROGRAMMING HERE</h1>
                        <span>
                            There are various courses, they are the best choice
                            for you
                        </span>
                        <div
                            className="join-us"
                            onClick={() => navigate('/product')}
                        >
                            Course
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-title">Khóa học trả phí</div>
                    <Row>
                        {listProCourse &&
                            listProCourse.map((item: CourseType) => {
                                return (
                                    <Col span={6}>
                                        <CourseComponent
                                            course_id={item._id}
                                            name={item?.name}
                                            number_registry={
                                                item?.number_registry
                                            }
                                            img_url={item?.img_url}
                                        />
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
                <div className="category">
                    <div className="category-title">Khóa học miễn phí</div>
                    <Row>
                        {listFreeCourse &&
                            listFreeCourse.map((item: CourseType) => {
                                return (
                                    <Col span={6}>
                                        <CourseComponent
                                            course_id={item._id}
                                            name={item?.name}
                                            number_registry={
                                                item?.number_registry
                                            }
                                            img_url={item?.img_url}
                                        />
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
                <div className="page-header">
                    <div className="page-header-title"></div>
                    <div className="page-header-content">
                        <h1>SOME POST AND VIDEO TRENDING</h1>
                        <span>
                            Highlight the unique vibe of each member of the
                            squad in the Air Max 90.
                        </span>
                        <div
                            className="join-us"
                            onClick={() => navigate('/list-video')}
                        >
                            Video
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-title">Video nổi bật</div>
                    <Row>
                        {listVideos &&
                            listVideos.map((item: VideoType) => {
                                return (
                                    <Col span={6}>
                                        <VideoComponent
                                            video_id={item._id}
                                            name={item?.name}
                                            view={item?.view}
                                            img_url={item?.img_url}
                                        />
                                    </Col>
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
                                            img_url={item?.img_url}
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
