import { useEffect, useState } from 'react';
import { NewsType } from '../../type/type';
import { newsApi } from '../../api/newsApi';
import { Modal } from 'antd';

export type Props = {
    _id?: string;
    handleClose: any;
};
export const ModalDetailNews = ({
    _id,
    handleClose,
}: Props): React.ReactElement => {
    const [dataView, setDataView] = useState<NewsType>();
    useEffect(() => {
        _id && handleGetDetailNews(_id);
    }, [_id]);

    const handleGetDetailNews = async (_id: string): Promise<any> => {
        try {
            const params = {
                _id: _id,
            };
            const res = await newsApi.getDetail(params);
            if (res?.data?.data) {
                setDataView(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Modal
                title={'Chi tiết bài đăng'}
                open={true}
                onOk={handleClose}
                onCancel={handleClose}
                footer={null}
                width={1200}
            >
                <div className="news">
                    <div className="news-left" style={{ width: '100%' }}>
                        <h1 className="news-name">{dataView?.name}</h1>
                        <div className="author">
                            <img
                                className="author-avatar"
                                src={dataView?.author?.avatar}
                            />
                            <span>{dataView?.author?.fullName}</span>
                        </div>
                        <div className="view-news">
                            <div
                                className="view-news-content"
                                dangerouslySetInnerHTML={
                                    dataView?.contentHTML
                                        ? { __html: dataView.contentHTML }
                                        : undefined
                                }
                            ></div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
