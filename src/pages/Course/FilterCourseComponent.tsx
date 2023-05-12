import { Checkbox } from 'antd';
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../asset/style/FilterCourseComponent.scss';
import { CONSTANT } from '../../constant/constant';
import { LoadingComponent } from '../../component/LoadingComponent/LoadingComponent';

export const FilterCourseComponent = (): React.ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCheckProCourse, setIsCheckProCourse] = useState<boolean>(false);
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [loading, setLoading] = useState<boolean>(false);

    const [optionCourseType, setOptionCourseType] = useState<any>([
        { key: 0, minPrice: undefined, maxPrice: 0, isChecked: false }, // free
        { key: 1, minPrice: 1, maxPrice: undefined, isChecked: false }, //pro
    ]);

    const [optionsPrice, setOptionsPrice] = useState<any>([
        { key: 0, minPrice: 1, maxPrice: 50, isChecked: false },
        { key: 1, minPrice: 51, maxPrice: 100, isChecked: false },
        { key: 2, minPrice: 101, maxPrice: 200, isChecked: false },
        { key: 3, minPrice: 201, maxPrice: 1000, isChecked: false },
    ]);

    const timeOut: any = useRef();
    const handleCheckBoxTypeCourse = (item: any) => {
        let temp = false;
        if (timeOut.current) clearTimeout(timeOut.current);
        const arr: any = optionCourseType.map((option: any) => {
            if (item.key === option.key) {
                if (item.key === 1 && !item.isChecked)
                    setIsCheckProCourse(true);
                else {
                    setIsCheckProCourse(false);
                    const arr = optionsPrice.map((item: any) => {
                        return {
                            ...item,
                            isChecked: false,
                        };
                    });
                    setOptionsPrice(arr);
                    searchParams.set('filter', '');
                    setSearchParams(searchParams);
                }
                if (!item.isChecked) {
                    searchParams.set('page', CONSTANT.DEFAULT_PAGE);
                    setSearchParams(searchParams);
                }
                temp = !item.isChecked;
                return {
                    ...option,
                    isChecked: !item.isChecked,
                };
            } else {
                return { ...option, isChecked: false };
            }
        });
        setOptionCourseType([...arr]);
        setLoading(true);
        timeOut.current = setTimeout(() => {
            const filter: any = {
                minPrice: item.minPrice,
                maxPrice: item.maxPrice,
            };
            searchParams.set('filter', temp ? JSON.stringify(filter) : '');
            setSearchParams(searchParams);
            setLoading(false);
        }, 500);
    };

    const handleCheckBoxPrice = (item: any) => {
        let temp = false;
        if (timeOut.current) clearTimeout(timeOut.current);
        const arr: any = optionsPrice.map((option: any) => {
            if (item.key === option.key) {
                if (!item.isChecked) {
                    searchParams.set('page', CONSTANT.DEFAULT_PAGE);
                    setSearchParams(searchParams);
                }
                temp = !item.isChecked;
                return {
                    ...option,
                    isChecked: !item.isChecked,
                };
            } else return { ...option, isChecked: false };
        });
        setOptionsPrice([...arr]);
        setLoading(true);
        timeOut.current = setTimeout(() => {
            const filter: any = {
                minPrice: item.minPrice,
                maxPrice: item.maxPrice,
            };
            searchParams.set('filter', temp ? JSON.stringify(filter) : '');
            setSearchParams(searchParams);
            setLoading(false);
        }, 500);
    };

    return (
        <div className="filter-component">
            <div className="filter-course-type">
                <span className="type">Loại khóa học</span>
                {optionCourseType &&
                    optionCourseType.map((item: any) => {
                        return (
                            <Checkbox
                                key={item?.key}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                value={JSON.stringify(item)}
                                onClick={() => handleCheckBoxTypeCourse(item)}
                                checked={item?.isChecked}
                            >
                                {!item?.minPrice && item?.maxPrice === 0
                                    ? 'Miễn phí'
                                    : 'Trả phí'}
                            </Checkbox>
                        );
                    })}
            </div>
            {isCheckProCourse && (
                <div className="filter-price">
                    <span className="price">Giá tiền</span>
                    {optionsPrice &&
                        optionsPrice.map((item: any) => {
                            return (
                                <Checkbox
                                    key={item?.key}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    value={JSON.stringify(item)}
                                    onClick={() => handleCheckBoxPrice(item)}
                                    checked={item?.isChecked}
                                >
                                    {`${item?.minPrice} $ - ${item?.maxPrice}$`}
                                </Checkbox>
                            );
                        })}
                </div>
            )}
            {loading && <LoadingComponent />}
        </div>
    );
};
