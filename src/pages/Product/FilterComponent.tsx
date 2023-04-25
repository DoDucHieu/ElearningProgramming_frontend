import "../../asset/style/FilterComponent.scss";
import { Checkbox } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { SearchParams } from "../../type/common";
import { categoryApi } from "../../api/categoryApi";
import { useState, useEffect, useRef } from "react";
import { CategoryType } from "../../type/type";
import { CONSTANT } from "../../constant/constant";
import { useSearchParams } from "react-router-dom";

export const FilterComponent = (): React.ReactElement => {
	const [optionsCategory, setOptionsCategory] = useState<any>();
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get("page") || CONSTANT.DEFAULT_PAGE;
	const size = searchParams.get("size") || CONSTANT.DEFAULT_SIZE;
	const keyword = searchParams.get("keyword") || CONSTANT.DEFAULT_KEYWORD;

	const [optionsPrice, setOptionsPrice] = useState<any>([
		{ key: 0, minPrice: 0, maxPrice: 50, isChecked: false },
		{ key: 1, minPrice: 50, maxPrice: 100, isChecked: false },
		{ key: 2, minPrice: 100, maxPrice: 200, isChecked: false },
		{ key: 3, minPrice: 200, maxPrice: 1000, isChecked: false },
	]);
	useEffect(() => {
		handleGetAllCategory({
			page,
			size,
			keyword,
		});
	}, []);

	const timeOut: any = useRef();
	const handleCheckBoxPrice = (item: any) => {
		let temp = false;
		if (timeOut.current) clearTimeout(timeOut.current);
		const arr: any = optionsPrice.map((option: any) => {
			if (item.key === option.key) {
				temp = !item.isChecked;
				return {
					...option,
					isChecked: !item.isChecked,
				};
			} else return { ...option, isChecked: false };
		});
		setOptionsPrice([...arr]);
		timeOut.current = setTimeout(() => {
			const sort: any = {
				minPrice: item.minPrice,
				maxPrice: item.maxPrice,
			};
			searchParams.set("sort", temp ? JSON.stringify(sort) : "");
			setSearchParams(searchParams);
		}, 1000);
	};

	const onChangeCheckBoxCategory = (checkedValues: CheckboxValueType[]) => {
		if (timeOut.current) clearTimeout(timeOut.current);
		timeOut.current = setTimeout(() => {
			searchParams.set("filter", checkedValues.toString());
			setSearchParams(searchParams);
		}, 1000);
		console.log("checked = ", checkedValues);
	};

	const handleGetAllCategory = async (params: SearchParams): Promise<any> => {
		try {
			const res = await categoryApi.getAll(params);
			if (res?.data?.listCategory) {
				const arr = handleFormatData(res.data.listCategory);
				setOptionsCategory(arr);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleFormatData = (data: any) => {
		const arr: CategoryType[] = data.map((item: any) => {
			return {
				label: item.categoryName,
				value: item.categoryId,
			};
		});
		return arr;
	};

	return (
		<div className="filter-component">
			<div className="filter-category">
				<span className="category">Category</span>
				<Checkbox.Group
					style={{ display: "flex", flexDirection: "column" }}
					options={optionsCategory}
					onChange={onChangeCheckBoxCategory}
				/>
			</div>
			<div className="filter-price">
				<span className="price">Price</span>
				{optionsPrice &&
					optionsPrice.map((item: any) => {
						return (
							<Checkbox
								key={item?.key}
								style={{
									display: "flex",
									flexDirection: "column",
								}}
								value={JSON.stringify(item)}
								onClick={() => handleCheckBoxPrice(item)}
								checked={item?.isChecked}
							>
								{`${item?.minPrice} $ - ${item?.maxPrice}$`}
							</Checkbox>
						);
					})}
			</div>
		</div>
	);
};
