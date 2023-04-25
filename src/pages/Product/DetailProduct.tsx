import { Button, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../asset/style/DetailProduct.scss";
import { cartAction } from "../../store/action/cartAction";
import { productApi } from "../../api/productApi";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { CartType } from "../../type/type";

export const DetailProduct = (): React.ReactElement => {
	const params = useParams();
	const [detailProduct, setDetailProduct] = useState<any>();
	const [quantity, setQuantity] = useState(1);
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const email = user.email;
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		params?.id && handleGetDetailProduct(params.id);
	}, [params?.id]);

	const handleGetDetailProduct = async (id: string) => {
		try {
			const params = {
				id,
			};
			const res = await productApi.getDetail(params);
			setDetailProduct(res?.data?.product);
		} catch (e) {
			console.log("err: ", e);
		}
	};

	const handleChangeQuantity = (value: any) => {
		setQuantity(value);
	};

	const handleAddToCart = async () => {
		try {
			const data: CartType = {
				email: email,
				productId: params.id,
				productName: detailProduct?.productName,
				imgUrl: detailProduct?.imgUrl,
				price: detailProduct?.price,
				quantity: quantity,
			};
			await dispatch(cartAction.addToCart(data));
		} catch (e) {
			console.log("error: ", e);
		}
	};

	return (
		<>
			<div className="detailProductUser">
				<div className="bookInfor">
					<img src={detailProduct?.imgUrl} alt="" className="img" />

					<div className="bookDetailInfor">
						<h3 className="title">{detailProduct?.productName}</h3>
						<p className="author">
							Mô tả: {detailProduct?.description}
						</p>
						<p className="category">
							Danh mục sản phẩm: {detailProduct?.categoryName}
						</p>
						<p className="date">
							Ngày ra mắt: {detailProduct?.datePublish}
						</p>
						<p className="price">{`Đơn giá: ${detailProduct?.price}`}</p>
						<div className="quantity">
							<label>Số lượng mua:</label>
							<InputNumber
								className="inputNumber"
								min={1}
								defaultValue={1}
								onChange={handleChangeQuantity}
							/>
						</div>
						<p className="totalCost">{`Thành tiền: ${
							detailProduct?.price * quantity
						} $`}</p>
						<Button
							type="primary"
							style={{ width: "100%", height: 40, marginTop: 80 }}
							onClick={() => {
								handleAddToCart();
								email
									? navigate("/product")
									: navigate("/sign-in");
							}}
						>
							Thêm vào giỏ hàng
						</Button>
					</div>
				</div>
				<div className="bookComment"></div>
			</div>
		</>
	);
};
