import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Component403 } from "../component/Component403/Component403";
import { adminRoute, publicRoute, userRoute } from "./listRoute";

const AuthWrapper = () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const userAccessToken = user.accessToken;
	if (userAccessToken) {
		return <Outlet />;
	}
	return <Navigate to={"/sign-in"} replace />;
};

const AdminRouteWrapper = () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const role = user.role;
	if (role === "admin") {
		return <Outlet />;
	}
	return <Navigate to={"/component403"} replace />;
};

const UserRouteWrapper = () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const role = user.role;
	if (role === "user") {
		return <Outlet />;
	}
	return <Navigate to={"/component403"} replace />;
};

const PublicRouteWrapper = () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const role = user.role;
	if (role !== "admin") {
		return <Outlet />;
	}
	return <Navigate to={"/component403"} replace />;
};

export const Router = () => {
	return (
		<>
			<Routes>
				<Route element={<Component403 />} path="/component403" />
				<Route element={<PublicRouteWrapper />}>
					{publicRoute.map((item) => {
						return (
							<Route
								path={item.url}
								element={item.element}
								key={item.url}
							/>
						);
					})}
				</Route>

				<Route element={<AuthWrapper />}>
					<Route element={<AdminRouteWrapper />}>
						{adminRoute.map((item) => {
							return (
								<Route
									path={item.url}
									element={item.element}
									key={item.url}
								/>
							);
						})}
					</Route>
					<Route element={<UserRouteWrapper />}>
						{userRoute.map((item) => {
							return (
								<Route
									path={item.url}
									element={item.element}
									key={item.url}
								/>
							);
						})}
					</Route>
				</Route>
			</Routes>
		</>
	);
};
