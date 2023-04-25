import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import forbiden_403 from "../../asset/image/forbiden_403.png";
export const Component403 = (): React.ReactElement => {
	const navigate = useNavigate();
	return (
		<>
			<div
				className="forbiden"
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
					src={forbiden_403}
					alt=""
					style={{ width: "50%", height: "50%", objectFit: "cover" }}
				/>
				<Button
					type="primary"
					style={{
						marginTop: 40,
					}}
					onClick={() => navigate("/")}
				>
					Quay lại
				</Button>
			</div>
		</>
	);
};
