import { Carousel, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { newsApi } from '../../api/newsApi';
import { videoApi } from '../../api/videoApi';
import '../../asset/style/Home.scss';
import programming from '../../asset/video/programming.mp4';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { CourseType, NewsType, VideoType } from '../../type/type';
import { CourseComponent } from '../Course/CourseComponent';
import { NewComponent } from '../News/NewComponent';
import { VideoComponent } from '../Video/VideoComponent';

export const Home = (): React.ReactElement => {
    const navigate = useNavigate();
    const [listFreeCourse, setListFreeCourse] = useState<CourseType[]>([]);
    const [listProCourse, setListProCourse] = useState<CourseType[]>([]);
    const [listNews, setListNews] = useState<NewsType[]>();
    const [listVideos, setListVideos] = useState<VideoType[]>();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;

    useEffect(() => {
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
                setListProCourse(res.data.data);
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
                            Giới thiệu chung về website
                        </div>
                        <div className="page-header-content">
                            <h1>NỀN TẢNG HỌC LẬP TRÌNH TOÀN DIỆN</h1>
                            <span>
                                {/* Platform with many courses with a variety of
                                videos and articles. */}
                                Nền tảng có nhiều khóa học với đa dạng video và
                                bài viết.
                            </span>
                            <div
                                className="join-us"
                                onClick={() => navigate('/list-course')}
                            >
                                {/* Course */}
                                Khóa học
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
                                    marginTop: 80,
                                }}
                            >
                                <source src={programming} type="video/mp4" />
                            </video>
                        </div>
                    </Carousel>
                </div>

                <div className="page-header">
                    <div className="page-header-title"></div>
                    <div className="page-header-content">
                        {/* <h1>ALL COURSE WITH MANY PROGRAMMING HERE</h1>
                         */}
                        <h1>NHIỀU KHÓA HỌC VỚI ĐA DẠNG NGÔN NGỮ LẬP TRÌNH</h1>

                        {/* <span>
                            There are various courses, they are the best choice
                            for you
                        </span> */}
                        <span>
                            Đa dạng khóa học, nơi đây là sự lựa chọn tốt nhất
                            cho bạn.
                        </span>
                        <div
                            className="join-us"
                            onClick={() => navigate('/product')}
                        >
                            Khóa học
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
                                            price={item?.price}
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
                                            price={item?.price}
                                        />
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
                <div className="page-header">
                    <div className="page-header-title"></div>
                    <div className="page-header-content">
                        {/* <h1>SOME POST AND VIDEO TRENDING</h1>
                         */}
                        <h1>MỘT SỐ BÀI VIẾT VÀ VIDEO NỔI BẬT</h1>
                        {/* <span>
                            Highlight the unique vibe of each member of the
                            squad in the Air Max 90.
                        </span> */}
                        <span>
                            Tại đây chia sẻ các bài viết và video nổi bật về
                            công nghệ được quan tâm nhiều nhất.
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
