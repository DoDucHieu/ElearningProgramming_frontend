import '../../asset/style/ManageAccount.scss';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { userApi } from '../../api/userApi';
import { ModalAccount } from './ModalAccount';
import { UserType } from '../../type/type';
import { CONSTANT } from '../../constant/constant';
import { PaginationComponent } from '../../component/Pagination/PaginationComponent';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../type/common';
import { ConfirmModal } from '../../component/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import { SearchComponent } from '../../component/SearchComponent/SearchComponent';
import { LoadingComponent } from '../../component/LoadingComponent/LoadingComponent';
export const ManageAccount = (): React.ReactElement => {
    const [data, setData] = useState<UserType[]>([]);
    const [dataToModal, setDataToModal] = useState<UserType>({});
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<string>('create');
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [totalRecord, setTotalRecord] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);

    const columns: ColumnsType<UserType> = [
        {
            title: 'STT',
            dataIndex: 'order',
            width: '10%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '20%',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Full name',
            dataIndex: 'fullName',
            width: '20%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: '10%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: '20%',
        },
        {
            title: 'Chức năng',
            width: '20%',
            render: (record) => (
                <>
                    <span
                        style={{
                            marginLeft: 8,
                            cursor: 'pointer',
                            color: record?.isBlock ? 'green' : 'red',
                            fontSize: 16,
                        }}
                    >
                        <LockOutlined
                            onClick={() =>
                                handleBlockUser(record?.email, record?.isBlock)
                            }
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
                            onClick={() => handleDeleteUser(record?._id)}
                        />
                    </span>
                </>
            ),
        },
    ];

    useEffect(() => {
        handleGetAllUser({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllUser = async (params: SearchParams): Promise<any> => {
        try {
            setLoading(true);
            const res = await userApi.getAllUser(params);
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
        const arr: UserType[] = data.map((item: any, index: number) => {
            return {
                order: index + 1,
                _id: item._id,
                userName: item.userName,
                email: item.email,
                fullName: item.fullName,
                role: item.role,
                address: item.address,
                isBlock: item.isBlock,
            };
        });
        return arr;
    };

    const handleDeleteUser = (id: string) => {
        ConfirmModal({
            icon: <></>,
            onOk: async () => {
                try {
                    setLoading(true);
                    const params = {
                        id,
                    };
                    const res = await userApi.delete(params);
                    if (res && res.status === 200) {
                        toast.success(res.data.message);
                        await handleGetAllUser({ page, size });
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
            description: 'Dữ liệu người dùng này sẽ bị xóa vĩnh viễn',
            canceText: `Hủy bỏ`,
            okText: 'Xóa',
        });
    };

    const handleBlockUser = (email: string, isBlock: boolean) => {
        ConfirmModal({
            icon: <></>,
            onOk: async () => {
                try {
                    setLoading(true);
                    const data = {
                        email,
                        isBlock: !isBlock,
                    };
                    const res = await userApi.blockUser(data);
                    if (res && res.status === 200) {
                        toast.success(res.data.message);
                        await handleGetAllUser({ page, size });
                    }
                } catch (error: any) {
                    console.log(error);
                    toast.error(error?.response?.data?.message);
                } finally {
                    setLoading(false);
                }
            },
            className: 'confirm__modal',
            title: isBlock
                ? 'Mở khóa quyền truy cập tài khoản?'
                : 'Chặn quyền truy cập tài khoản?',
            description: isBlock
                ? 'Người dùng sẽ đăng nhập tài khoản trở lại!'
                : 'Người dùng sẽ không thể đăng nhập vào tài khoản!',
            canceText: `Hủy bỏ`,
            okText: isBlock ? 'Bỏ chặn' : 'Chặn',
        });
    };

    const handleClose = () => {
        setIsOpenModal(false);
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
                    Add account
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
                <ModalAccount
                    handleClose={handleClose}
                    getAllUser={handleGetAllUser}
                    typeModal={typeModal}
                    dataToModal={dataToModal}
                    setLoading={handleSetLoading}
                />
            )}
            {loading && <LoadingComponent />}
        </div>
    );
};
