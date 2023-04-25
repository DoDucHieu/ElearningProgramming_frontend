import "../../asset/style/ManageAccount.scss";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ModalCategory } from "./ModalCategory";
import { CategoryType } from "../../type/type";
import { CONSTANT } from "../../constant/constant";
import { PaginationComponent } from "../../component/Pagination/PaginationComponent";
import { useSearchParams } from "react-router-dom";
import { SearchParams } from "../../type/common";
import { ConfirmModal } from "../../component/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { SearchComponent } from "../../component/SearchComponent/SearchComponent";
import { categoryApi } from "../../api/categoryApi";
export const ManageCategory = (): React.ReactElement => {
	const [data, setData] = useState<CategoryType[]>([]);
	const [dataToModal, setDataToModal] = useState<CategoryType>({});
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<string>("create");
	const [searchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;
	const keyword = searchParams.get("keyword") || CONSTANT.DEFAULT_KEYWORD;
	const [totalRecord, setTotalRecord] = useState<number>();
	const columns: ColumnsType<CategoryType> = [
		{
			title: "Mã danh mục",
			dataIndex: "categoryId",
			fixed: true,
			render: (text) => <span>{text}</span>,
		},

		{
			fixed: true,
			title: "Tên danh mục",
			dataIndex: "categoryName",
		},
		{
			fixed: true,
			title: "Chức năng",
			render: (record) => (
				<>
					<span
						style={{
							marginLeft: 8,
							cursor: "pointer",
							color: "blue",
							fontSize: 16,
						}}
					>
						<EditOutlined
							onClick={() => {
								setIsOpenModal(true);
								setTypeModal("edit");
								setDataToModal(record);
							}}
						/>
					</span>
					<span
						style={{
							marginLeft: 8,
							cursor: "pointer",
							color: "red",
							fontSize: 16,
						}}
					>
						<DeleteOutlined
							onClick={() => handleDeleteCategory(record?._id)}
						/>
					</span>
				</>
			),
		},
	];

	useEffect(() => {
		handleGetAllCategory({
			page,
			size,
			keyword,
		});
	}, [page, size, keyword]);

	const handleGetAllCategory = async (params: SearchParams): Promise<any> => {
		try {
			const res = await categoryApi.getAll(params);
			if (res?.data?.listCategory) {
				const arr = handleFormatData(res.data.listCategory);
				setData(arr);
				setTotalRecord(res.data?.totalRecord);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleFormatData = (data: any) => {
		const arr: CategoryType[] = data.map((item: any) => {
			return {
				_id: item._id,
				categoryId: item.categoryId,
				categoryName: item.categoryName,
			};
		});
		return arr;
	};

	const handleDeleteCategory = (id: string) => {
		ConfirmModal({
			icon: <></>,
			onOk: async () => {
				try {
					const params = {
						id,
					};
					const res = await categoryApi.delete(params);
					if (res && res.status === 200) {
						toast.success(res.data.message);
						await handleGetAllCategory({ page, size });
					}
				} catch (error: any) {
					console.log(error);
					toast.error(error.message);
				}
			},
			className: "confirm__modal",
			title: "Bạn có chắc muốn xóa không",
			description: "Dữ liệu người dùng này sẽ bị xóa vĩnh viễn",
			canceText: `Hủy bỏ`,
			okText: "Xóa",
		});
	};

	const handleClose = () => {
		setIsOpenModal(false);
	};

	return (
		<div className="manage-account">
			<SearchComponent
				placeholder="Nhập từ khóa tìm kiếm"
				style={{ width: 600 }}
			/>
			<div
				className="manage-account-header"
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "end",
				}}
			>
				<Button
					type="primary"
					onClick={() => {
						setIsOpenModal(true);
						setTypeModal("add");
					}}
				>
					Add category
				</Button>
			</div>
			<div className="manage-account-table">
				<div className="table-content">
					<Table
						columns={columns}
						dataSource={[...data]}
						pagination={false}
					/>
				</div>
				<div className="table-pagination">
					<PaginationComponent
						totalRecord={totalRecord ? totalRecord : Number(size)}
					/>
				</div>
			</div>
			{isOpenModal && (
				<ModalCategory
					handleClose={handleClose}
					getAllCategory={handleGetAllCategory}
					typeModal={typeModal}
					dataToModal={dataToModal}
				/>
			)}
		</div>
	);
};
