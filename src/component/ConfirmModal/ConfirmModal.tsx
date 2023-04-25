import { Modal } from "antd";
import { LegacyButtonType } from "antd/lib/button/button";
import { ReactNode } from "react";
import "../../asset/style/ConfirmModal.scss";

type props = {
	onOk: () => void;
	onCancel?: () => void;
	title: string;
	description: string;
	canceText: string;
	okText: string;
	icon?: ReactNode;

	width?: number;
	height?: number;
	className?: string;
	okType?: LegacyButtonType;
};

export const ConfirmModal = ({
	onOk,
	onCancel,
	title,
	description,
	canceText,
	okText,
	icon,
	width,
	height,
	className,
	okType,
}: props) => {
	Modal.confirm({
		width: width ?? 450,
		style: {
			height: height ?? 250,
		},
		centered: true,
		className: className,
		title: title,
		icon: icon,
		content: description,
		okText: okText,
		okType: okType ? okType : "danger",
		closable: true,
		cancelText: canceText,
		onOk: () => {
			if (onOk) {
				onOk();
			}
		},
		onCancel: () => {
			if (onCancel) {
				onCancel();
			}
		},
	});
};
