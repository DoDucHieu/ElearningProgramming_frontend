import { Pagination } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONSTANT } from '../../constant/constant';

export type Props = {
    totalRecord?: number;
};

export const PaginationComponent = ({
    totalRecord,
}: Props): React.ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const [total, setTotal] = useState<number>();

    const handleChangePage = (page: number) => {
        searchParams.set('page', page.toString());
        setSearchParams(searchParams);
    };

    return (
        <>
            <Pagination
                defaultCurrent={Number(page)}
                pageSize={Number(size)}
                total={totalRecord}
                onChange={(page) => handleChangePage(page)}
            />
        </>
    );
};
