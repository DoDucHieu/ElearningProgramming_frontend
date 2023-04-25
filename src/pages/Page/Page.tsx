import { useNavigate } from "react-router-dom";
import "../../asset/style/Page.scss";
export const Page = (): React.ReactElement => {
	const navigate = useNavigate();
	return (
		<div className="about-us-page">
			<div className="page-header">
				<div className="page-header-title">Nike Membership</div>
				<div className="page-header-content">
					<h1>BECOME A MEMBER</h1>
					<span>Sign up for free. Join the community.</span>
					<div
						className="join-us"
						onClick={() => navigate("/sign-up")}
					>
						Join Us
					</div>
				</div>
			</div>
			<div className="feature-benefit">
				<div className="feature-style-title">Featured benefit</div>
				<div className="feature-benefit-content">
					<div className="content-left">
						<div className="content-item">
							<img
								src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_700,c_limit/729313d9-036c-45f5-985a-8d82fdb9e880/nike-membership.jpg"
								alt=""
							/>
							<div className="item-description">
								Shop Member-exclusive styles
							</div>
						</div>
						<div className="content-item">
							<img
								src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/w_765,c_limit/3813c078-64a4-4538-b3ec-352928b999a8/nike-membership.jpg"
								alt=""
							/>
							<div className="item-description">
								Shop Member-exclusive styles
							</div>
						</div>
					</div>
					<div className="content-right">
						<div className="content-item">
							<img
								src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_500,c_limit/22befae5-7263-4b6e-af4c-d8985aaabdd9/nike-membership.jpg"
								alt=""
							/>
							<div className="item-description">
								Shop Member-exclusive styles
							</div>
						</div>
						<div className="content-item">
							<img
								src="https://static.nike.com/a/images/w_772,c_limit/469ad8dd-9f86-48ae-a8bb-61ced8897454/nike-membership.jpg"
								alt=""
							/>
							<div className="item-description">
								Shop Member-exclusive styles
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="more-benefit">
				<div className="more-benefit-title">
					<span>More Benefits</span>
					<span>
						Free shipping, wear-testing, motivating workouts and
						more.
					</span>
				</div>
				<div className="more-benefit-content">
					<div className="more-benefit-item">
						<img
							src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_540,c_limit/6dc2a4fa-a48a-4e81-aaaa-3b573a43f472/nike-membership.jpg"
							alt=""
						/>
						<span>Explore workouts from Nike Trainers.</span>
					</div>
					<div className="more-benefit-item">
						<img
							src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_540,c_limit/05cb7783-e2fa-4034-99a6-32d8f9041ce0/nike-membership.jpg"
							alt=""
						/>
						<span>Special offers and promos all year long.</span>
					</div>
					<div className="more-benefit-item">
						<img
							src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_540,c_limit/4246ec2d-1fc3-4ed6-854b-2b36ab9218fe/nike-membership.jpg"
							alt=""
						/>
						<span>Get tip on styling and product.</span>
					</div>
					<div className="more-benefit-item">
						<img
							src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_540,c_limit/49a0117f-63c9-43d2-83d6-ebc1001c681e/nike-membership.jpg"
							alt=""
						/>
						<span>
							Get more in-store with excludesive benefits.
						</span>
					</div>
				</div>
			</div>

			<div className="page-header">
				<div className="page-header-title">Nike Membership</div>
				<div className="page-header-content">
					<h1>THANK FOR BEING HERE</h1>
					<span>Your global community awaits.</span>
					<div
						className="join-us"
						onClick={() => navigate("/sign-up")}
					>
						Join Us
					</div>
				</div>
			</div>
		</div>
	);
};
