import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userApi } from "../../api/userApi";
import { CONSTANT } from "../../constant/constant";
import { SearchParams } from "../../type/common";
import { UserType } from "../../type/type";

type Props = {
	handleClose: () => void;
	getAllUser: (params: SearchParams) => Promise<any>;
	typeModal: string;
	dataToModal: UserType;
};

type Option = {
	label: string;
	value: string;
};

export const ModalAccount = ({
	handleClose,
	getAllUser,
	typeModal,
	dataToModal,
}: Props): React.ReactElement => {
	const [form] = Form.useForm();
	const [searchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;
	const option: Option[] = [
		{
			label: "Admin",
			value: "admin",
		},
		{
			label: "User",
			value: "user",
		},
	];

	useEffect(() => {
		if (typeModal === "edit") handleFillForm(dataToModal);
	}, []);

	const handleFillForm = (data: UserType) => {
		form.setFieldValue("email", data.email);
		form.setFieldValue("role", data.role);
		form.setFieldValue("fullName", data.fullName);
		form.setFieldValue("address", data.address);
	};

	const onFinish = () => {
		const data: UserType = {
			email: form.getFieldValue("email"),
			password: form.getFieldValue("password"),
			role: form.getFieldValue("role"),
			fullName: form.getFieldValue("fullName"),
			address: form.getFieldValue("address"),
		};
		if (typeModal === "add") handleAddAccount(data);
		else handleEditAccount(data);
	};

	const handleAddAccount = async (user: UserType): Promise<any> => {
		try {
			const res = await userApi.add(user);
			if (res?.data) {
				if (res.data.errCode === 0) {
					toast.success(res.data.errMessage);
					await getAllUser({ page, size });
				}
				if (res.data.errCode === 1) toast.error(res.data.errMessage);
			}
		} catch (error) {
			console.log(error);
		} finally {
			handleClose();
		}
	};

	const handleEditAccount = async (user: UserType): Promise<any> => {
		try {
			const res = await userApi.edit(user);
			if (res?.data) {
				if (res.data.errCode === 0) {
					toast.success(res.data.errMessage);
					await getAllUser({ page, size });
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
						? "Chỉnh sửa tài khoản"
						: "Tạo tài khoản"
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
						label="Email"
						name="email"
						rules={[
							{
								required: true,
								message: "Không được để trống",
							},
							{
								type: "email",
								message: "Email không hợp lệ",
							},
						]}
					>
						<Input disabled={typeModal === "edit" ? true : false} />
					</Form.Item>
					{typeModal === "add" && (
						<Form.Item
							label="Password"
							name="password"
							rules={[
								{
									required: true,
									message: "Không được để trống",
								},
								{
									pattern: new RegExp(
										/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
									),
									message:
										"Mật khẩu gồm chữ hoa chữ thường và số, tối thiểu 8 ký tự",
								},
							]}
						>
							<Input />
						</Form.Item>
					)}
					<Form.Item
						label="Họ và tên"
						name="fullName"
						rules={[
							{
								required: true,
								message: "Không được để trống !",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Chức vụ"
						name="role"
						rules={[
							{ required: true, message: "Không được để trống" },
						]}
					>
						<Select options={option} />
					</Form.Item>
					<Form.Item
						label="Địa chỉ"
						name="address"
						rules={[
							{ required: true, message: "Không được để trống" },
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
