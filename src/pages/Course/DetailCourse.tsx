import { useEffect, useState } from 'react';
import { courseApi } from '../../api/courseApi';
import { DetailLesson } from '../Lesson/DetailLesson';
import { ListLesson } from '../Lesson/ListLesson';
import { CartType, CourseType } from '../../type/type';
import { useParams } from 'react-router-dom';
import '../../asset/style/DetailCourse.scss';
import { myCourseApi } from '../../api/myCourseApi';
import { Button, Card } from 'antd';
import { CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { toast } from 'react-toastify';
import { cartAction } from '../../store/action/cartAction';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { Comment } from '../../component/Comment/Comment';

export const DetailCourse = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const user_id = user.user_id;
    const params = useParams();
    const dispatch: AppDispatch = useDispatch();
    const [detailCourse, setDetailCourse] = useState<CourseType>();
    const [currentLesson, setCurrentLesson] = useState<string>();
    const [isRegistryCourse, setIsRegistryCourse] = useState<boolean>();
    const [totalLesson, setTotalLesson] = useState<number>();

    useEffect(() => {
        params?._id && handleGetDetailCourse(params._id);
        email && params?._id && handleGetDetailMyCourse(params?._id, email);
    }, [params?._id]);

    const handleGetDetailMyCourse = async (
        _id: string,
        email: string,
    ): Promise<any> => {
        try {
            const params = {
                course_id: _id,
                email,
            };
            const res = await myCourseApi.getDetail(params);
            if (res?.data?.data?._id) {
                setIsRegistryCourse(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetDetailCourse = async (_id: string): Promise<any> => {
        try {
            const params = {
                _id: _id,
            };
            const res = await courseApi.getDetail(params);
            if (res?.data?.data) {
                setDetailCourse(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenLesson = (_id: string) => {
        setCurrentLesson(_id);
    };

    const handleSetTotalLesson = (total: number) => {
        setTotalLesson(total);
    };

    const handleRegistryCourse = async (): Promise<any> => {
        try {
            const params = {
                course_id: detailCourse?._id,
                email,
            };
            const res = await myCourseApi.registryCourse(params);
            if (res?.data?.data) {
                setIsRegistryCourse(true);
                toast.success(res?.data?.errMessage);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddToCart = async () => {
        try {
            const data: CartType = {
                email: email,
                course_id: params._id,
                name: detailCourse?.name,
                img_url: detailCourse?.img_url,
                price: detailCourse?.price,
            };
            await dispatch(cartAction.addToCart(data));
        } catch (e) {
            console.log('error: ', e);
        }
    };

    return (
        <>
            {isRegistryCourse ? (
                <>
                    <div className="detail-course-user">
                        <div className="detail-course-left">
                            <DetailLesson _id={currentLesson} />
                        </div>
                        <div className="detail-course-right">
                            <ListLesson
                                course_id={params?._id}
                                handleOpenLesson={handleOpenLesson}
                            />
                        </div>
                    </div>
                    {currentLesson && user_id && (
                        <div className="lesson-comment">
                            <Comment
                                _id={currentLesson}
                                user_id={user_id}
                                type="lesson"
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="detail-course-user-no-registry">
                    <div className="detail-course-left">
                        <div className="detail-course-left-infor">
                            <div className="course-name">
                                {detailCourse?.name}
                            </div>
                            <div className="course-description">
                                {`Mô tả: ${detailCourse?.description}`}
                            </div>
                            <div className="content-course">
                                Nội dung khóa học
                            </div>
                        </div>
                        <ListLesson
                            course_id={params?._id}
                            handleOpenLesson={handleOpenLesson}
                            handleSetTotalLesson={handleSetTotalLesson}
                        />
                    </div>
                    <div className="detail-course-right">
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
                                    src={detailCourse?.img_url}
                                />
                            }
                        >
                            <Meta
                                title={
                                    <div className="course-infor">
                                        <span className="course-name">
                                            {detailCourse?.name}
                                        </span>
                                    </div>
                                }
                            />
                        </Card>
                        <div className="course-description">
                            <div className="course-type">
                                {detailCourse?.price === 0
                                    ? 'Miễn phí'
                                    : `Giá: ${detailCourse?.price}$`}
                            </div>
                            <Button
                                type="primary"
                                className="registry-btn"
                                onClick={
                                    detailCourse?.price === 0
                                        ? handleRegistryCourse
                                        : handleAddToCart
                                }
                            >
                                {detailCourse?.price === 0
                                    ? 'ĐĂNG KÝ HỌC'
                                    : 'THÊM VÀO GIỎ HÀNG'}
                            </Button>
                            <div className="number-lesson">
                                <span>
                                    <PlayCircleOutlined />
                                </span>
                                {`Tổng cộng ${totalLesson} bài học`}
                            </div>
                            <div className="number-registry">
                                <span>
                                    <CheckCircleOutlined />
                                </span>
                                {`Có ${detailCourse?.number_registry} người đăng ký
                            khóa học`}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
