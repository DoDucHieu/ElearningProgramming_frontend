import { Col, Row } from 'antd';
import '../../asset/style/ListCourse.scss';
import { CourseType } from '../../type/type';
import { CourseComponent } from './CourseComponent';
import { useEffect, useState } from 'react';
import { CONSTANT } from '../../constant/constant';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../type/common';
import { courseApi } from '../../api/courseApi';
import { FilterCourseComponent } from './FilterCourseComponent';
import { SearchComponent } from '../../component/SearchComponent/SearchComponent';

export const ListCourse = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userAccessToken = user.accessToken;
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [listCourses, setListCourses] = useState<CourseType[]>();

    useEffect(() => {
        handleGetAllCourse({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllCourse = async (params: SearchParams): Promise<any> => {
        try {
            const res = await courseApi.getAll(params);
            if (res?.data?.data) {
                setListCourses(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="list-course-page">
            <div className="search-filter">
                <SearchComponent
                    placeholder="Nhập tên khóa học tìm kiếm?"
                    style={{ marginBottom: 24 }}
                />
                <FilterCourseComponent />
            </div>
            <div className="list-course">
                <div className="list-course-header">
                    <span className="list-course-title">
                        Danh sách các khóa học
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
                                    />
                                </Col>
                            );
                        })}
                </Row>
            </div>
        </div>
    );
};
