import { Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import { CONSTANT } from "../../constant/constant";

export type Props = {
	totalRecord?: number;
};

export const PaginationComponent = ({
	totalRecord,
}: Props): React.ReactElement => {
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;

	const handleChangePage = (page: number) => {
		searchParams.set("page", page.toString());
		setSearchParams(searchParams);
	};
	return (
		<>
			<Pagination
				defaultCurrent={Number(page)}
				total={
					totalRecord
						? totalRecord / Number(size) <= 1
							? totalRecord
							: Number(size) + totalRecord
						: Number(size)
				}
				onChange={(page) => handleChangePage(page)}
			/>
		</>
	);
};
