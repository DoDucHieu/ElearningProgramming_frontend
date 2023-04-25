import { Layout } from "antd";
import { Router } from "../../router/router";

export const Content = () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const userAccessToken = user.accessToken;
	return (
		<Layout.Content
			style={{
				margin: userAccessToken ? "0 24px" : "0px",
			}}
		>
			<Router />
		</Layout.Content>
	);
};
