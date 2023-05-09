import '../../asset/style/ManageAccount.scss';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { ModalOrder } from './ModalOrder';
import { CourseType, OrderType, UserType } from '../../type/type';
import { CONSTANT } from '../../constant/constant';
import { PaginationComponent } from '../../component/Pagination/PaginationComponent';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../type/common';
import { ConfirmModal } from '../../component/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import { SearchComponent } from '../../component/SearchComponent/SearchComponent';
import { orderApi } from '../../api/OrderApi';
import moment from 'moment';
export const ManageOrder = (): React.ReactElement => {
    const [data, setData] = useState<OrderType[]>([]);
    const [dataToModal, setDataToModal] = useState<UserType>({});
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<string>('create');
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [totalRecord, setTotalRecord] = useState<number>();

    const columns: ColumnsType<OrderType> = [
        {
            title: 'Email',
            dataIndex: 'email',
            fixed: true,
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Danh sách khóa học',
            dataIndex: 'list_course',
            fixed: true,
            render: (text) => (
                <span>{handleFormatListCourse(text).toString()}</span>
            ),
        },
        {
            fixed: true,
            title: 'Phương thức thanh toán',
            dataIndex: 'payment_method',
            render: (text) => <span>{text && 'Thanh toán online'}</span>,
        },
        {
            fixed: true,
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            render: (text) => (
                <span>{moment(text).format(CONSTANT.FORMAT_DATE_HOUR)}</span>
            ),
        },
        {
            fixed: true,
            title: 'Trạng thái',
            dataIndex: 'is_purchase',
            render: (text) => (
                <span>{!text ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
            ),
        },
        {
            fixed: true,
            title: 'Chức năng',
            render: (record) => (
                <>
                    <span
                        style={{
                            marginLeft: 8,
                            cursor: 'pointer',
                            color: 'red',
                            fontSize: 16,
                        }}
                    >
                        <DeleteOutlined
                            onClick={() =>
                                handleDeleteOrder(
                                    record?.email,
                                    record?.order_id,
                                )
                            }
                        />
                    </span>
                </>
            ),
        },
    ];

    useEffect(() => {
        handleGetAllOrder({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllOrder = async (params: SearchParams): Promise<any> => {
        try {
            const res = await orderApi.getAll(params);
            if (res?.data?.data) {
                const arr: OrderType[] = handleFormatData(res.data.data);
                setData(arr);
                setTotalRecord(res.data?.totalRecord);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormatData = (data: any) => {
        const arr: OrderType[] = data.map((item: any) => {
            return {
                order_id: item._id,
                email: item.email,
                list_course: item.list_course,
                payment_method: item.payment_method,
                is_purchase: item.is_purchase,
                createdAt: item.createdAt,
            };
        });
        return arr;
    };

    const handleFormatListCourse = (data: CourseType[]) => {
        const arr = data.map((item: CourseType) => {
            return item.name;
        });
        return arr;
    };

    const handleDeleteOrder = (email: string, order_id: string) => {
        ConfirmModal({
            icon: <></>,
            onOk: async () => {
                try {
                    const params = {
                        email,
                        order_id,
                    };
                    const res = await orderApi.delete(params);
                    if (res && res.status === 200) {
                        toast.success(res.data.errMessage);
                        await handleGetAllOrder({ page, size });
                    }
                } catch (error: any) {
                    console.log(error);
                    toast.error(error.message);
                }
            },
            className: 'confirm__modal',
            title: 'Bạn có chắc muốn xóa không',
            description: 'Đơn hàng sẽ bị hủy!',
            canceText: `Hủy bỏ`,
            okText: 'Xóa',
        });
    };

    const handleClose = () => {
        setIsOpenModal(false);
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
                {/* <Button
                    type="primary"
                    onClick={() => {
                        setIsOpenModal(true);
                        setTypeModal('add');
                    }}
                >
                    Add order
                </Button> */}
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
                <ModalOrder
                    handleClose={handleClose}
                    getAllOrder={handleGetAllOrder}
                    typeModal={typeModal}
                    dataToModal={dataToModal}
                />
            )}
        </div>
    );
};
