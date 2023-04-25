import { Button, Col, Form, Input, Row } from "antd";
import { useNavigate } from "react-router-dom";
import img from "../../asset/image/shoeBG.jpg";
import loginIcon from "../../asset/image/login.png";
import { userApi } from "../../api/userApi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { commonAction } from "../../store/action/commonAction";
export const SignIn = (): React.ReactElement => {
	const [loginForm] = Form.useForm();
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const role = user.role;

	useEffect(() => {
		role && role === "user" && navigate("/");
		role && role === "admin" && navigate("/manage-account");
	}, []);

	const onFinish = async (values: { email: string; password: string }) => {
		try {
			const res = await userApi.signIn({
				email: values.email,
				password: values.password,
			});
			if (res?.data?.errCode === 0) {
				const data = {
					email: res.data.email,
					role: res.data.role,
					fullName: res.data.fullName,
					avatar: res.data.avatar,
					accessToken: res.data.accessToken,
					refreshToken: res.data.refreshToken,
				};
				localStorage.setItem("user", JSON.stringify(data));
				dispatch(
					commonAction.changeUserInfor({
						fullName: data.fullName,
						avatar: data.avatar,
					}),
				);
				if (data.role === "user") navigate("/");
				if (data.role === "admin")
					setTimeout(() => {
						navigate("/manage-account");
					}, 1);
			}
			if (res?.data.errCode === 1) toast.error(res.data.errMessage);
		} catch (e: any) {
			console.log(e);
			toast.error(e?.response?.data?.errMessage);
		}
	};

	return (
		<Row style={{ height: "100vh" }}>
			<Col span={12} style={{ background: "gray" }}>
				<img
					src={img}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
				/>
			</Col>
			<Col span={12}>
				<div
					className="formLogin"
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<img
						src={loginIcon}
						style={{
							width: 80,
							height: 80,
							objectFit: "cover",
							marginBottom: 24,
						}}
					/>
					<h2 style={{ margin: 24, fontSize: 32 }}>Sign in</h2>
					<Form
						onFinish={onFinish}
						layout="vertical"
						style={{ width: "60%" }}
						form={loginForm}
					>
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{
									required: true,
									message: "Trường này không được để trống!",
								},
								{
									type: "email",
									message: "Email không hợp lệ!",
								},
							]}
						>
							<Input size="large" />
						</Form.Item>

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
							<Input.Password size="large" />
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								style={{ width: "100%", marginTop: 32 }}
								size="large"
							>
								Sign in
							</Button>
						</Form.Item>
						<span
							style={{
								color: "green",
								fontSize: 14,
								cursor: "pointer",
							}}
							onClick={() => {
								navigate("/sign-up");
							}}
						>
							Sign up here!
						</span>
					</Form>
				</div>
			</Col>
		</Row>
	);
};
