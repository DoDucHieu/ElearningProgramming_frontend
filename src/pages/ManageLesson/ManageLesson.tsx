import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { lessonApi } from '../../api/lessonApi';
import '../../asset/style/ManageAccount.scss';
import { ConfirmModal } from '../../component/ConfirmModal/ConfirmModal';
import { PaginationComponent } from '../../component/Pagination/PaginationComponent';
import { SearchComponent } from '../../component/SearchComponent/SearchComponent';
import { CONSTANT } from '../../constant/constant';
import { SearchParams } from '../../type/common';
import { LessonType } from '../../type/type';
import { ModalDetailLesson } from './ModalDetailLesson';
import { ModalLesson } from './ModalLesson';

export const ManageLesson = (): React.ReactElement => {
    const params = useParams();
    const course_id = params.courseId;
    const [data, setData] = useState<LessonType[]>([]);
    const [dataToModal, setDataToModal] = useState<LessonType>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenModalDetail, setIsOpenModalDetail] = useState<boolean>(false);
    const [lessonIdDetail, setLessonIdDetail] = useState<string>();
    const [typeModal, setTypeModal] = useState<string>('create');
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || CONSTANT.DEFAULT_PAGE;
    const size = searchParams.get('size') || CONSTANT.DEFAULT_SIZE;
    const keyword = searchParams.get('keyword') || CONSTANT.DEFAULT_KEYWORD;
    const [totalRecord, setTotalRecord] = useState<number>();

    const columns: ColumnsType<LessonType> = [
        {
            title: 'Tên bài học',
            dataIndex: 'name',
            width: '20%',
            render: (text, record) => (
                <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setIsOpenModalDetail(true);
                        setLessonIdDetail(record?._id);
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
            render: (text) => <span>{text}</span>,
        },

        {
            width: '20%',
            title: 'Loại bài học',
            dataIndex: 'type',
            render: (text) => <span>{text ? 'Video' : 'Bài viết'}</span>,
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
                            onClick={() => handleDeleteLesson(record?._id)}
                        />
                    </span>
                </>
            ),
        },
    ];

    useEffect(() => {
        handleGetAllLesson({
            page,
            size,
            keyword,
            course_id,
        });
    }, [page, size, keyword, course_id]);

    const handleGetAllLesson = async (params: any): Promise<any> => {
        try {
            const res = await lessonApi.getAll(params);
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
        const arr: LessonType[] = data.map((item: any) => {
            return {
                _id: item._id,
                course_id: item?.course_id,
                name: item.name,
                description: item?.description,
                type: item?.type,
                video_url: item.video_url,
                contentHTML: item.contentHTML,
                contentMarkdown: item.contentMarkdown,
            };
        });
        return arr;
    };

    const handleDeleteLesson = (_id: string) => {
        ConfirmModal({
            icon: <></>,
            onOk: async () => {
                try {
                    const params = {
                        _id,
                    };
                    const res = await lessonApi.delete(params);
                    if (res?.data?.errCode === 0) {
                        toast.success(res.data.errMessage);
                        await handleGetAllLesson({ page, size, course_id });
                    }
                } catch (error: any) {
                    console.log(error);

                    toast.error(error.message);
                }
            },
            className: 'confirm__modal',
            title: 'Bạn có chắc muốn xóa không',
            description: 'Bài học này sẽ bị xóa vĩnh viễn',
            canceText: `Hủy bỏ`,
            okText: 'Xóa',
        });
    };

    const handleClose = () => {
        setIsOpenModal(false);
    };

    const handleCloseModalDetail = () => {
        setIsOpenModalDetail(false);
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
                    Thêm bài học
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
                <ModalLesson
                    handleClose={handleClose}
                    getAllLesson={handleGetAllLesson}
                    typeModal={typeModal}
                    dataToModal={dataToModal}
                />
            )}
            {isOpenModalDetail && (
                <ModalDetailLesson
                    _id={lessonIdDetail}
                    handleClose={handleCloseModalDetail}
                />
            )}
        </div>
    );
};
