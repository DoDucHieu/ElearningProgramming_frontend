import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { myCourseApi } from '../../api/myCourseApi';
import '../../asset/style/ListCourse.scss';
import { PaginationComponent } from '../../component/Pagination/PaginationComponent';
import { CONSTANT } from '../../constant/constant';
import { CourseType } from '../../type/type';
import { CourseComponent } from '../Course/CourseComponent';

export const ListMyCourse = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const filter = searchParams.get('filter') || CONSTANT.DEFAULT_FILTER;
    const [listCourses, setListCourses] = useState<CourseType[]>();
    const [totalRecord, setTotalRecord] = useState<number>();

    useEffect(() => {
        email &&
            handleGetAllMyCourse({
                page,
                size,
                keyword,
                email,
            });
    }, [email, page, size, keyword, filter]);

    const handleGetAllMyCourse = async (params: any): Promise<any> => {
        try {
            const res = await myCourseApi.getAll(params);
            if (res?.data?.data) {
                const data: CourseType[] = handleFormatCourse(res.data.data);
                setListCourses(data);
                setTotalRecord(res.data.totalRecord);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormatCourse = (data: any) => {
        const arr: CourseType[] = data.map((item: any) => {
            return {
                _id: item?.course_id?._id,
                name: item?.course_id?.name,
                description: item?.course_id?.description,
                img_url: item?.course_id?.img_url,
                price: item?.course_id?.price,
                number_registry: item?.course_id?.number_registry,
            };
        });
        return arr;
    };

    return (
        <div className="list-course-page">
            <div className="list-course">
                <div className="list-course-header">
                    <span className="list-course-title">
                        Danh sách các khóa học của tôi
                    </span>
                </div>
                <Row>
                    {listCourses &&
                        listCourses.map((item: CourseType) => {
                            return (
                                <Col span={6}>
                                    <CourseComponent
                                        course_id={item._id}
                                        name={item?.name}
                                        number_registry={item?.number_registry}
                                        img_url={item?.img_url}
                                        price={item?.price}
                                    />
                                </Col>
                            );
                        })}
                </Row>
                <div className="list-course-pagination">
                    <PaginationComponent totalRecord={totalRecord} />
                </div>
            </div>
        </div>
    );
};
