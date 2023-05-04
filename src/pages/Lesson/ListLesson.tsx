import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONSTANT } from '../../constant/constant';
import { lessonApi } from '../../api/lessonApi';
import { LessonType } from '../../type/type';
import '../../asset/style/ListLesson.scss';

export type Props = {
    course_id?: string;
    handleOpenLesson?: any;
    handleSetTotalLesson?: any;
};
export const ListLesson = ({
    course_id,
    handleOpenLesson,
    handleSetTotalLesson,
}: Props): React.ReactElement => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [listLessons, setListLessons] = useState<LessonType[]>([]);
    const [currentLesson, setCurrentLesson] = useState<string>();

    useEffect(() => {
        handleGetAllLesson({
            page,
            size,
            keyword,
            course_id,
        });
    }, [page, size, keyword, course_id]);

    useEffect(() => {
        listLessons && setCurrentLesson(listLessons[0]?._id);
        listLessons && handleOpenLesson(listLessons[0]?._id);
    }, [listLessons]);

    const handleGetAllLesson = async (params: any): Promise<any> => {
        try {
            const res = await lessonApi.getAll(params);
            if (res?.data?.data) {
                setListLessons(res.data.data);
                handleSetTotalLesson(res.data.data.length);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="list-lesson-user">
            {listLessons?.length > 0 ? (
                listLessons?.map((item: LessonType, index: number) => {
                    return (
                        <div
                            className={
                                currentLesson === item?._id
                                    ? 'lesson-item lesson-item-active'
                                    : 'lesson-item'
                            }
                            onClick={() => {
                                handleOpenLesson(item?._id);
                                setCurrentLesson(item?._id);
                            }}
                        >
                            {`Bài ${index + 1}: ${item?.description}`}
                        </div>
                    );
                })
            ) : (
                <>
                    <h4>Không có bài học nào</h4>
                </>
            )}
        </div>
    );
};
