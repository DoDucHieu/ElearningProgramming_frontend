import '../../asset/style/FilterComponent.scss';
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { SearchParams } from '../../type/common';
import { useState, useEffect, useRef } from 'react';
import { CONSTANT } from '../../constant/constant';
import { useSearchParams } from 'react-router-dom';

export const FilterCourseComponent = (): React.ReactElement => {
    const [optionsCategory, setOptionsCategory] = useState<any>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCheckProCourse, setIsCheckProCourse] = useState<boolean>(false);
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;

    const [optionsPrice, setOptionsPrice] = useState<any>([
        { key: 0, minPrice: 0, maxPrice: 50, isChecked: false },
        { key: 1, minPrice: 50, maxPrice: 100, isChecked: false },
        { key: 2, minPrice: 100, maxPrice: 200, isChecked: false },
        { key: 3, minPrice: 200, maxPrice: 1000, isChecked: false },
    ]);
    useEffect(() => {
        setOptionsCategory([
            {
                label: 'Miễn phí',
                value: false,
            },
            {
                label: 'Trả phí',
                value: true,
            },
        ]);
    }, []);

    const timeOut: any = useRef();
    const handleCheckBoxPrice = (item: any) => {
        let temp = false;
        if (timeOut.current) clearTimeout(timeOut.current);
        const arr: any = optionsPrice.map((option: any) => {
            if (item.key === option.key) {
                temp = !item.isChecked;
                return {
                    ...option,
                    isChecked: !item.isChecked,
                };
            } else return { ...option, isChecked: false };
        });
        setOptionsPrice([...arr]);
        timeOut.current = setTimeout(() => {
            const sort: any = {
                minPrice: item.minPrice,
                maxPrice: item.maxPrice,
            };
            searchParams.set('sort', temp ? JSON.stringify(sort) : '');
            setSearchParams(searchParams);
        }, 1000);
    };

    const onChangeCheckBoxCategory = (checkedValues: CheckboxValueType[]) => {
        if (timeOut.current) clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
            searchParams.set('filter', checkedValues.toString());
            setSearchParams(searchParams);
        }, 1000);
        checkedValues.includes(true)
            ? setIsCheckProCourse(true)
            : setIsCheckProCourse(false);
        console.log('checked = ', checkedValues);
    };

    return (
        <div className="filter-component">
            <div className="filter-category">
                <span className="category">Loại khóa học</span>
                <Checkbox.Group
                    style={{ display: 'flex', flexDirection: 'column' }}
                    options={optionsCategory}
                    onChange={onChangeCheckBoxCategory}
                />
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
        </div>
    );
};
