import { Button, Form, Input, Modal } from "antd";
import { userApi } from "../../api/userApi";
import { toast } from "react-toastify";
type Props = {
	handleCancel: () => void;
	isOpenModal: boolean;
};

export const ChangePasswordModal = ({
	handleCancel,
	isOpenModal,
}: Props): React.ReactElement => {
	const [form] = Form.useForm();
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const email = user.email;
	const onFinish = async (): Promise<any> => {
		try {
			const data = {
				email,
				password: form.getFieldValue("password"),
				newPassword: form.getFieldValue("newPassword"),
			};
			const res = await userApi.changePassword(data);
			if (res?.data?.errCode === 0) {
				const data = {
					email: res.data.email,
					role: res.data.role,
					fullName: res.data.fullName,
					accessToken: res.data.accessToken,
					refreshToken: res.data.refreshToken,
				};
				localStorage.setItem("user", JSON.stringify(data));
				toast.success(res.data.errMessage);
				handleCancel();
			}
		} catch (e: any) {
			console.log(e);
			toast.error(e?.response?.data?.errMessage);
		}
	};
	return (
		<>
			<Modal
				title="Đổi mật khẩu"
				open={isOpenModal}
				onCancel={handleCancel}
				footer={null}
			>
				<Form
					style={{ padding: "15px 0" }}
					form={form}
					id="form-change-password"
					labelCol={{ span: 8 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					labelAlign="left"
				>
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
						<Input.Password />
					</Form.Item>
					<Form.Item
						label="New password"
						name="newPassword"
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
						<Input.Password />
					</Form.Item>
					<Form.Item
						label="Confirm password"
						name="confirmPassword"
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
							({ getFieldValue }) => ({
								validator(_, value) {
									if (
										!value ||
										getFieldValue("newPassword") === value
									) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error(
											"Xác nhận mật khẩu không chính xác!",
										),
									);
								},
							}),
						]}
					>
						<Input.Password size="large" />
					</Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						form="form-change-password"
					>
						Save
					</Button>
				</Form>
			</Modal>
		</>
	);
};
