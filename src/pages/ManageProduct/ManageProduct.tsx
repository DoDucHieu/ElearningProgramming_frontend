import "../../asset/style/ManageAccount.scss";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ModalProduct } from "./ModalProduct";
import { ProductType } from "../../type/type";
import { CONSTANT } from "../../constant/constant";
import { PaginationComponent } from "../../component/Pagination/PaginationComponent";
import { useSearchParams } from "react-router-dom";
import { SearchParams } from "../../type/common";
import { ConfirmModal } from "../../component/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { SearchComponent } from "../../component/SearchComponent/SearchComponent";
import { productApi } from "../../api/productApi";
// import moment from "moment";
export const ManageProduct = (): React.ReactElement => {
	const [data, setData] = useState<ProductType[]>([]);
	const [dataToModal, setDataToModal] = useState<ProductType>({});
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<string>("create");
	const [searchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;
	const keyword = searchParams.get("keyword") || CONSTANT.DEFAULT_KEYWORD;
	const [totalRecord, setTotalRecord] = useState<number>();

	const columns: ColumnsType<ProductType> = [
		{
			title: "Tên sản phẩm",
			dataIndex: "productName",
			render: (text) => <span>{text}</span>,
		},
		{
			title: "Mô tả",
			dataIndex: "description",
			render: (text) => <span>{text}</span>,
		},
		{
			title: "Thể loại",
			dataIndex: "categoryName",
			render: (text) => <span>{text}</span>,
		},
		{
			title: "Ảnh",
			dataIndex: "imgUrl",
			render: (text) => (
				<img
					src={text}
					style={{ width: "60px", objectFit: "cover" }}
				></img>
			),
		},
		{
			title: "Đơn giá",
			dataIndex: "price",
			render: (text) => <span>{text}</span>,
		},
		{
			title: "Ngày ra mắt",
			dataIndex: "datePublish",
			render: (text) => <span>{text}</span>,
		},
		{
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
							onClick={() => handleDeleteProduct(record?._id)}
						/>
					</span>
				</>
			),
		},
	];

	useEffect(() => {
		handleGetAllProduct({
			page,
			size,
			keyword,
		});
	}, [page, size, keyword]);

	const handleGetAllProduct = async (params: SearchParams): Promise<any> => {
		try {
			const res = await productApi.getAll(params);
			if (res?.data?.listProduct) {
				const arr = handleFormatData(res.data.listProduct);
				setData(arr);
				setTotalRecord(res.data?.totalRecord);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleFormatData = (data: any) => {
		const arr: ProductType[] = data.map((item: any) => {
			return {
				_id: item._id,
				productName: item.productName,
				description: item.description,
				categoryName: item.categoryName,
				imgUrl: item.imgUrl,
				price: item.price,
				datePublish: item.datePublish,
			};
		});
		return arr;
	};

	const handleDeleteProduct = (id: string) => {
		ConfirmModal({
			icon: <></>,
			onOk: async () => {
				try {
					const params = {
						id,
					};
					const res = await productApi.delete(params);
					if (res && res.status === 200) {
						toast.success(res.data.message);
						await handleGetAllProduct({ page, size });
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
					Add product
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
				<ModalProduct
					handleClose={handleClose}
					getAllProduct={handleGetAllProduct}
					typeModal={typeModal}
					dataToModal={dataToModal}
				/>
			)}
		</div>
	);
};
