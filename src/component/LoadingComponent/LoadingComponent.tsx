import '../../asset/style/LoadingComponent.scss';
import { Space, Spin } from 'antd';
import { createPortal } from 'react-dom';

export const LoadingComponent = (): React.ReactElement => {
    return createPortal(
        <div className="loading-component">
            <Space>
                <Spin size="large" spinning={true}>
                    <div className="content" />
                </Spin>
            </Space>
        </div>,
        document.body,
    );
};
