import { Input } from 'antd';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SearchProps = {
    placeholder?: string;
    style?: any;
};

export const SearchComponent = ({
    placeholder,
    style,
}: SearchProps): React.ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams();

    const timeOut: any = useRef();
    const handleKeywordChange = (event: any) => {
        if (timeOut.current) clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
            searchParams.set('keyword', event.target.value.trim());
            setSearchParams(searchParams);
        }, 1000);
    };
    return (
        <>
            <Input
                placeholder={placeholder}
                style={style}
                onChange={(event) => handleKeywordChange(event)}
                allowClear
            />
        </>
    );
};
