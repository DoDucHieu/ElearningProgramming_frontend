import '../../asset/style/ManageAccount.scss';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { NewsType } from '../../type/type';
import { CONSTANT } from '../../constant/constant';
import { PaginationComponent } from '../../component/Pagination/PaginationComponent';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../type/common';
import { ConfirmModal } from '../../component/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import { SearchComponent } from '../../component/SearchComponent/SearchComponent';
import { ModalNews } from './ModalNews';
import { newsApi } from '../../api/newsApi';
import { ModalDetailNews } from './ModalDetailNews';
import { LoadingComponent } from '../../component/LoadingComponent/LoadingComponent';
export const ManageNews = (): React.ReactElement => {
    const [data, setData] = useState<NewsType[]>([]);
    const [dataToModal, setDataToModal] = useState<NewsType>({});
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenModalDetail, setIsOpenModalDetail] = useState<boolean>(false);
    const [newIdDetail, setNewIdDetail] = useState<string>();
    const [typeModal, setTypeModal] = useState<string>('create');
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [totalRecord, setTotalRecord] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);

    const columns: ColumnsType<NewsType> = [
        {
            title: 'STT',
            dataIndex: 'order',
            width: '10%',
        },
        {
            title: 'Tên bài viết',
            dataIndex: 'name',
            width: '20%',
            render: (text, record) => (
                <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setIsOpenModalDetail(true);
                        setNewIdDetail(record?._id);
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            width: '20%',
            title: 'Mô tả',
            dataIndex: 'description',
        },

        {
            width: '15%',
            title: 'Ảnh minh họa',
            dataIndex: 'img_url',
            render: (text) => (
                <img
                    src={text}
                    style={{ width: '60px', objectFit: 'cover' }}
                ></img>
            ),
        },

        {
            width: '15%',
            title: 'Tác giả',
            dataIndex: 'author',
            render: (text) => <span>{text}</span>,
        },
        {
            width: '10%',
            title: 'Phê duyệt',
            dataIndex: 'is_approved',
            render: (text) => <span>{text ? 'Đã duyệt' : 'Chưa duyệt'}</span>,
        },
        {
            width: '10%',
            title: 'Chức năng',
            render: (record) => (
                <>
                    <span
                        style={{
                            marginLeft: 8,
                            cursor: 'pointer',
                            color: 'green',
                            fontSize: 16,
                        }}
                    >
                        <CheckOutlined
                            onClick={() => {
                                handleApproveNews(record?._id);
                            }}
                        />
                    </span>
                    <span
                        style={{
                            marginLeft: 8,
                            cursor: 'pointer',
                            color: 'blue',
                            fontSize: 16,
                        }}
                    >
                        <EditOutlined
                            onClick={() => {
                                setIsOpenModal(true);
                                setTypeModal('edit');
                                setDataToModal(record);
                            }}
                        />
                    </span>
                    <span
                        style={{
                            marginLeft: 8,
                            cursor: 'pointer',
                            color: 'red',
                            fontSize: 16,
                        }}
                    >
                        <DeleteOutlined
                            onClick={() => handleDeleteNews(record?._id)}
                        />
                    </span>
                </>
            ),
        },
    ];

    useEffect(() => {
        handleGetAllNews({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllNews = async (params: SearchParams): Promise<any> => {
        try {
            setLoading(true);
            const res = await newsApi.getAll(params);
            if (res?.data?.data) {
                const arr = handleFormatData(res.data.data);
                setData(arr);
                setTotalRecord(res.data?.totalRecord);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormatData = (data: any) => {
        const arr: NewsType[] = data.map((item: any, index: number) => {
            return {
                order: index + 1,
                _id: item._id,
                name: item.name,
                description: item.description,
                contentHTML: item.contentHTML,
                contentMarkdown: item.contentMarkdown,
                img_url: item.img_url,
                author: item?.author?.fullName,
                is_approved: item.is_approved,
            };
        });
        return arr;
    };

    const handleDeleteNews = (_id: string) => {
        ConfirmModal({
            icon: <></>,
            onOk: async () => {
                try {
                    setLoading(true);
                    const params = {
                        _id,
                    };
                    const res = await newsApi.delete(params);
                    if (res?.data?.errCode === 0) {
                        toast.success(res.data.errMessage);
                        await handleGetAllNews({ page, size });
                    }
                } catch (error: any) {
                    console.log(error);

                    toast.error(error.message);
                } finally {
                    setLoading(false);
                }
            },
            className: 'confirm__modal',
            title: 'Bạn có chắc muốn xóa không',
            description: 'Bài đăng này sẽ bị xóa vĩnh viễn',
            canceText: `Hủy bỏ`,
            okText: 'Xóa',
        });
    };

    const handleApproveNews = (_id: string) => {
        ConfirmModal({
            icon: <></>,
            onOk: async () => {
                try {
                    setLoading(true);
                    const data = {
                        _id,
                    };
                    const res = await newsApi.approve(data);
                    if (res?.data?.errCode === 0) {
                        toast.success(res.data.errMessage);
                        await handleGetAllNews({ page, size });
                    }
                } catch (error: any) {
                    console.log(error);

                    toast.error(error.message);
                } finally {
                    setLoading(false);
                }
            },
            className: 'confirm__modal',
            okType: 'primary',
            title: 'Phê duyệt bài đăng này?',
            description: 'Bài đăng sẽ được hiển thị cho mọi người xem',
            canceText: `Hủy bỏ`,
            okText: 'Phê duyệt',
        });
    };

    const handleClose = () => {
        setIsOpenModal(false);
    };

    const handleCloseModalDetail = () => {
        setIsOpenModalDetail(false);
    };

    const handleSetLoading = (value: boolean) => {
        setLoading(value);
    };

    return (
        <div className="manage-account">
            <SearchComponent
                placeholder="Nhập từ khóa tìm kiếm"
                style={{ width: 600 }}
            />
            <div
                className="manage-account-header"
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end',
                }}
            >
                <Button
                    type="primary"
                    onClick={() => {
                        setIsOpenModal(true);
                        setTypeModal('add');
                    }}
                >
                    Thêm bài đăng
                </Button>
            </div>
            <div className="manage-account-table">
                <div className="table-content">
                    <Table
                        columns={columns}
                        dataSource={[...data]}
                        pagination={false}
                    />
                </div>
                <div className="table-pagination">
                    <PaginationComponent
                        totalRecord={totalRecord ? totalRecord : Number(size)}
                    />
                </div>
            </div>
            {isOpenModal && (
                <ModalNews
                    handleClose={handleClose}
                    getAllNews={handleGetAllNews}
                    typeModal={typeModal}
                    dataToModal={dataToModal}
                    setLoading={handleSetLoading}
                />
            )}
            {isOpenModalDetail && (
                <ModalDetailNews
                    _id={newIdDetail}
                    handleClose={handleCloseModalDetail}
                />
            )}
            {loading && <LoadingComponent />}
        </div>
    );
};
