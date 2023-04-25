import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const PaymentCancel = (): React.ReactElement => {
	const navigate = useNavigate();
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
				marginTop: 40,
				color: "red",
				fontSize: "32px",
			}}
		>
			<h1>Thanh toán đã bị hủy</h1>
			<Button
				style={{ marginTop: 40, width: 200, height: 40 }}
				type="primary"
				onClick={() => navigate("/")}
			>
				Quay lại trang chủ
			</Button>
		</div>
	);
};
