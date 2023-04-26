import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseApi } from '../../api/courseApi';
import '../../asset/style/ManageAccount.scss';
import { ConfirmModal } from '../../component/ConfirmModal/ConfirmModal';
import { PaginationComponent } from '../../component/Pagination/PaginationComponent';
import { SearchComponent } from '../../component/SearchComponent/SearchComponent';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { CourseType } from '../../type/type';
import { ModalCourse } from './ModalCourse';
export const ManageCourse = (): React.ReactElement => {
    const [data, setData] = useState<CourseType[]>([]);
    const [dataToModal, setDataToModal] = useState<CourseType>({});
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<string>('create');
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [totalRecord, setTotalRecord] = useState<number>();
    const navigate = useNavigate();

    const columns: ColumnsType<CourseType> = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            width: '20%',
            render: (text, record) => (
                <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        console.log('course_id: ', record._id);
                        navigate(`/manage-lesson/${record._id}`);
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
            width: '20%',
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
            width: '20%',
            title: 'Đơn giá',
            dataIndex: 'price',
            render: (text) => <span>{text}$</span>,
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
                            onClick={() => handleDeleteCourse(record?._id)}
                        />
                    </span>
                </>
            ),
        },
    ];

    useEffect(() => {
        handleGetAllCourse({
            page,
            size,
            keyword,
        });
    }, [page, size, keyword]);

    const handleGetAllCourse = async (params: SearchParams): Promise<any> => {
        try {
            const res = await courseApi.getAll(params);
            if (res?.data?.data) {
                const arr = handleFormatData(res.data.data);
                setData(arr);
                setTotalRecord(res.data?.totalRecord);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormatData = (data: any) => {
        const arr: CourseType[] = data.map((item: any) => {
            return {
                _id: item._id,
                name: item.name,
                description: item.description,
                img_url: item.img_url,
                price: item.price,
            };
        });
        return arr;
    };

    const handleDeleteCourse = (_id: string) => {
        ConfirmModal({
            icon: <></>,
            onOk: async () => {
                try {
                    const params = {
                        _id,
                    };
                    const res = await courseApi.delete(params);
                    if (res?.data?.errCode === 0) {
                        toast.success(res.data.errMessage);
                        await handleGetAllCourse({ page, size });
                    }
                } catch (error: any) {
                    console.log(error);

                    toast.error(error.message);
                }
            },
            className: 'confirm__modal',
            title: 'Bạn có chắc muốn xóa không',
            description: 'Bài đăng này sẽ bị xóa vĩnh viễn',
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
                <Button
                    type="primary"
                    onClick={() => {
                        setIsOpenModal(true);
                        setTypeModal('add');
                    }}
                >
                    Thêm khóa học
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
                <ModalCourse
                    handleClose={handleClose}
                    getAllCourse={handleGetAllCourse}
                    typeModal={typeModal}
                    dataToModal={dataToModal}
                />
            )}
        </div>
    );
};
