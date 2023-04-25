import { useEffect } from "react";
import { orderApi } from "../../api/OrderApi";
import { cartApi } from "../../api/cartApi";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";

export const PaymentSuccess = (): React.ReactElement => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const email = user.email;
	const params = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		handleEditOrder();
	}, []);

	const handleEditOrder = async (): Promise<any> => {
		try {
			const data = {
				email,
				isPurchase: true,
				orderId: params?.orderId,
			};
			const res = await orderApi.edit(data);
			if (res) {
				await handleDeleteAllCart();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteAllCart = async (): Promise<any> => {
		try {
			const params = {
				email,
			};
			const res = await cartApi.deleteAllCart(params);
			if (res) console.log("delete all cart: ", res?.data);
		} catch (error) {
			console.log(error);
		}
	};

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
				color: "green",
				fontSize: "32px",
			}}
		>
			<h1>Thanh toán thành công</h1>
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
