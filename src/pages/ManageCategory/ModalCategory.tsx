import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { categoryApi } from "../../api/categoryApi";
import { CONSTANT } from "../../constant/constant";
import { SearchParams } from "../../type/common";
import { CategoryType } from "../../type/type";

type Props = {
	handleClose: () => void;
	getAllCategory: (params: SearchParams) => Promise<any>;
	typeModal: string;
	dataToModal: CategoryType;
};

export const ModalCategory = ({
	handleClose,
	getAllCategory,
	typeModal,
	dataToModal,
}: Props): React.ReactElement => {
	const [form] = Form.useForm();
	const [searchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;

	useEffect(() => {
		if (typeModal === "edit") handleFillForm(dataToModal);
	}, []);

	const handleFillForm = (data: CategoryType) => {
		form.setFieldValue("categoryId", data.categoryId);
		form.setFieldValue("categoryName", data.categoryName);
	};

	const onFinish = () => {
		const data: CategoryType = {
			categoryId: form.getFieldValue("categoryId"),
			categoryName: form.getFieldValue("categoryName"),
		};
		if (typeModal === "add") handleAddCategory(data);
		else handleEditAccount(data);
	};

	const handleAddCategory = async (category: CategoryType): Promise<any> => {
		try {
			const res = await categoryApi.add(category);
			if (res?.data) {
				if (res.data.errCode === 0) {
					toast.success(res.data.errMessage);
					await getAllCategory({ page, size });
				}
				if (res.data.errCode === 1) toast.error(res.data.errMessage);
			}
		} catch (error) {
			console.log(error);
		} finally {
			handleClose();
		}
	};

	const handleEditAccount = async (category: CategoryType): Promise<any> => {
		try {
			const res = await categoryApi.update(category);
			if (res?.data) {
				if (res.data.errCode === 0) {
					toast.success(res.data.errMessage);
					await getAllCategory({ page, size });
				}
				if (res.data.errCode === 1) toast.error(res.data.errMessage);
			}
		} catch (error) {
			console.log(error);
		} finally {
			handleClose();
		}
	};

	return (
		<>
			<Modal
				title={
					typeModal === "edit"
						? "Chỉnh sửa danh mục sản phẩm"
						: "Tạo danh mục sản phẩm"
				}
				open={true}
				onOk={handleClose}
				onCancel={handleClose}
				footer={null}
			>
				<Form
					style={{ padding: "15px 0" }}
					name="basic"
					form={form}
					labelCol={{ span: 8 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="off"
					labelAlign="left"
					id="form"
				>
					<Form.Item
						label="Mã danh mục"
						name="categoryId"
						rules={[
							{
								required: true,
								message: "Không được để trống",
							},
						]}
					>
						<Input disabled={typeModal === "edit" ? true : false} />
					</Form.Item>

					<Form.Item
						label="Tên danh mục"
						name="categoryName"
						rules={[
							{
								required: true,
								message: "Không được để trống !",
							},
						]}
					>
						<Input />
					</Form.Item>
				</Form>
				<Button type="primary" htmlType="submit" form="form">
					Save
				</Button>
			</Modal>
		</>
	);
};
