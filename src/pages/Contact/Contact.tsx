import { Button, Form, Input } from "antd";
import "../../asset/style/Contact.scss";
import {
	MailOutlined,
	InstagramOutlined,
	FacebookOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
export const Contact = (): React.ReactElement => {
	const [form] = Form.useForm();
	const onFinish = (values: any) => {
		console.log("Success:", values);
	};
	return (
		<div className="contact">
			<div className="contact-bg">
				<div className="contact-left">
					<h1>Let's chat.</h1>
					<h1>Tell me about anything</h1>
					<h1>you want.</h1>
					<div className="something-together">
						Let's create something together
					</div>
					<div className="associate-network">
						<div className="app-email">
							<MailOutlined />
							<p>vantu0512@gmail.com</p>
						</div>
						<div className="app-email">
							<InstagramOutlined />
							<p>vantu0512@gmail.com</p>
						</div>
						<div className="app-email">
							<FacebookOutlined />
							<p>vantu0512@gmail.com</p>
						</div>
					</div>
				</div>
				<div className="contact-right">
					<div className="form-contact">
						<Form
							form={form}
							id="form-contact"
							name="basic"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							style={{ maxWidth: 600 }}
							initialValues={{ remember: true }}
							onFinish={onFinish}
							autoComplete="off"
						>
							<Form.Item
								name="email"
								rules={[
									{
										required: true,
										message: "Please input your email!",
									},
									{
										type: "email",
										message: "Email is not correct!",
									},
								]}
							>
								<Input placeholder="Your email" />
							</Form.Item>

							<Form.Item
								name="fullName"
								rules={[
									{
										required: true,
										message: "Please input your full name!",
									},
								]}
							>
								<Input placeholder="Full name" />
							</Form.Item>

							<Form.Item
								name="reason"
								rules={[
									{
										required: true,
										message:
											"Please tell us about your reason!",
									},
								]}
							>
								<TextArea placeholder="Tell us about your reason?" />
							</Form.Item>

							<Button
								type="primary"
								htmlType="submit"
								form="form-contact"
							>
								Send
							</Button>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};
