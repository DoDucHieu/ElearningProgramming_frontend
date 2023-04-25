import "../../asset/style/ManageAccount.scss";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ModalOrder } from "./ModalOrder";
import { OrderType, UserType } from "../../type/type";
import { CONSTANT } from "../../constant/constant";
import { PaginationComponent } from "../../component/Pagination/PaginationComponent";
import { useSearchParams } from "react-router-dom";
import { SearchParams } from "../../type/common";
import { ConfirmModal } from "../../component/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { SearchComponent } from "../../component/SearchComponent/SearchComponent";
import { orderApi } from "../../api/OrderApi";
import moment from "moment";
export const ManageOrder = (): React.ReactElement => {
	const [data, setData] = useState<UserType[]>([]);
	const [dataToModal, setDataToModal] = useState<UserType>({});
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<string>("create");
	const [searchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;
	const keyword = searchParams.get("keyword") || CONSTANT.DEFAULT_KEYWORD;
	const [totalRecord, setTotalRecord] = useState<number>();

	const columns: ColumnsType<OrderType> = [
		{
			title: "Email",
			dataIndex: "email",
			fixed: true,
			render: (text) => <span>{text}</span>,
		},
		{
			fixed: true,
			title: "Thành tiền",
			dataIndex: "totalCost",
			render: (text) => <span>{text}</span>,
		},
		{
			fixed: true,
			title: "Địa chỉ nhận hàng",
			dataIndex: "receiveAddress",
			render: (text) => <span>{text}</span>,
		},
		{
			fixed: true,
			title: "Phương thức thanh toán",
			dataIndex: "paymentMethod",
			render: (text) => (
				<span>
					{text ? "Thanh toán online" : "Thanh toán sau khi nhận"}
				</span>
			),
		},
		{
			fixed: true,
			title: "Ngày đặt hàng",
			dataIndex: "createdAt",
			render: (text) => (
				<span>{moment(text).format(CONSTANT.FORMAT_DATE_HOUR)}</span>
			),
		},
		{
			fixed: true,
			title: "Trạng thái",
			dataIndex: "isPurchase",
			render: (text) => (
				<span>{text ? "Đã thanh toán" : "Chưa thanh toán"}</span>
			),
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
							onClick={() =>
								handleDeleteOrder(
									record?.email,
									record?.orderId,
								)
							}
						/>
					</span>
				</>
			),
		},
	];

	const handleCalculateSubTotal = (data: any[]) => {
		let total: any = 0;
		data.forEach((item) => {
			total += item?.price * item?.quantity;
		});
		return total;
	};

	useEffect(() => {
		handleGetAllOrder({
			page,
			size,
			keyword,
		});
	}, [page, size, keyword]);

	const handleGetAllOrder = async (params: SearchParams): Promise<any> => {
		try {
			const res = await orderApi.getAll(params);
			if (res?.data?.data) {
				const arr = handleFormatData(res.data.data);
				setData(arr);
				setTotalRecord(res.data?.totalRecord);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleFormatData = (data: any) => {
		const arr: OrderType[] = data.map((item: any) => {
			return {
				orderId: item._id,
				email: item.email,
				totalCost: handleCalculateSubTotal(item.listProduct),
				receiveAddress: item.receiveAddress,
				paymentMethod: item.paymentMethod,
				isPurchase: item.isPurchase,
				createdAt: item.createdAt,
			};
		});
		return arr;
	};

	const handleDeleteOrder = (email: string, orderId: string) => {
		ConfirmModal({
			icon: <></>,
			onOk: async () => {
				try {
					const params = {
						email,
						orderId,
					};
					const res = await orderApi.delete(params);
					if (res && res.status === 200) {
						toast.success(res.data.errMessage);
						await handleGetAllOrder({ page, size });
					}
				} catch (error: any) {
					console.log(error);
					toast.error(error.message);
				}
			},
			className: "confirm__modal",
			title: "Bạn có chắc muốn xóa không",
			description: "Đơn hàng sẽ bị hủy!",
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
					Add order
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
				<ModalOrder
					handleClose={handleClose}
					getAllOrder={handleGetAllOrder}
					typeModal={typeModal}
					dataToModal={dataToModal}
				/>
			)}
		</div>
	);
};
