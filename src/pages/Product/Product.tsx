import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import Meta from "antd/es/card/Meta";
import "../../asset/style/Product.scss";
import { ProductType } from "../../type/type";
import { CONSTANT } from "../../constant/constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { SearchParams } from "../../type/common";
import { FilterComponent } from "./FilterComponent";
export const Product = (): React.ReactElement => {
	const navigate = useNavigate();
	const [data, setData] = useState<ProductType[]>([]);
	const [searchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;
	const keyword = searchParams.get("keyword") || CONSTANT.DEFAULT_KEYWORD;
	const filter = searchParams.get("filter") || CONSTANT.DEFAULT_FILTER;
	const sortPrice = searchParams.get("sort") || CONSTANT.DEFAULT_SORT_PRICE;

	useEffect(() => {
		handleGetAllProduct({
			page,
			size,
			keyword,
			filter,
			sortPrice,
		});
	}, [page, size, keyword, filter, sortPrice]);

	const handleGetAllProduct = async (params: SearchParams): Promise<any> => {
		try {
			const res = await productApi.getAll(params);
			if (res?.data?.listProduct) {
				const arr = handleFormatData(res.data.listProduct);
				setData(arr);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleFormatData = (data: any) => {
		const arr: ProductType[] = data.map((item: any) => {
			return {
				_id: item._id,
				productName: item.productName,
				description: item.description,
				categoryName: item.categoryName,
				imgUrl: item.imgUrl,
				price: item.price,
				datePublish: item.datePublish,
			};
		});
		return arr;
	};

	return (
		<div className="product-page">
			<div className="filter">
				<FilterComponent />
			</div>
			<div className="product">
				<div className="category">
					<Row>
						{data &&
							data.map((item: ProductType) => {
								return (
									<Col span={6}>
										<Card
											className="item"
											hoverable
											cover={
												<img
													style={{
														height: 300,
														objectFit: "cover",
													}}
													alt="example"
													src={item?.imgUrl}
												/>
											}
											onClick={() => {
												navigate(
													`/detail-product/${item._id}`,
												);
											}}
										>
											<Meta
												title={item?.productName}
												description={item?.description}
											/>
										</Card>
									</Col>
								);
							})}
					</Row>
				</div>
			</div>
		</div>
	);
};
