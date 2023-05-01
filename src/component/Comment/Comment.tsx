import { SendOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { commentApi } from '../../api/commentApi';
import '../../asset/style/Comment.scss';
import { CommentType } from '../../type/type';
import { ModalUserContact } from '../ModalUserContact/ModaUserContact';

export type Props = {
    _id?: string;
    user_id?: string;
    type?: string;
};

export const Comment = ({ _id, user_id, type }: Props) => {
    const [comment, setComment] = useState('');
    const [listComment, setListComment] = useState<CommentType[]>([]);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [userContact, setUserContact] = useState<string>();

    const handleGetAllComment = async () => {
        try {
            const params = {
                _id,
                type,
            };
            const res = await commentApi.getAll(params);
            setListComment(handleFormatListComment(res?.data?.data.reverse()));
        } catch (e) {
            console.log('error: ', e);
        }
    };

    const handleFormatListComment = (data: any) => {
        const arr: CommentType[] = data.map((item: any) => {
            return {
                user_id: item?.user_id?._id,
                avatar: item?.user_id?.avatar,
                full_name: item?.user_id?.fullName,
                comment: item?.comment,
                type: item?.type,
                new_id: item?.new_id,
            };
        });
        return arr;
    };

    const handleAddComment = async () => {
        try {
            if (comment.trim() !== '') {
                const data = {
                    comment: comment,
                    _id,
                    user_id,
                    type,
                };
                await commentApi.create(data);
            }
        } catch (e) {
            console.log('error: ', e);
        } finally {
            setComment('');
            await handleGetAllComment();
        }
    };

    useEffect(() => {
        _id && handleGetAllComment();
    }, [_id, user_id]);

    const handleClose = () => {
        setIsOpenModal(false);
    };

    return (
        <div className="comment">
            <div className="add-comment">
                <TextArea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Thêm bình luận ..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                />
                <SendOutlined
                    style={{
                        color: '#4E89FF',
                        fontSize: 24,
                        cursor: 'pointer',
                    }}
                    onClick={handleAddComment}
                />
            </div>
            <div className="list-comment">
                <List
                    itemLayout="horizontal"
                    dataSource={listComment}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{ cursor: 'pointer' }}
                                        src={item?.avatar}
                                        onClick={() => {
                                            setIsOpenModal(true);
                                            setUserContact(item?.user_id);
                                        }}
                                    />
                                }
                                title={item?.full_name}
                                description={item?.comment}
                            />
                        </List.Item>
                    )}
                />
                {isOpenModal && userContact && (
                    <ModalUserContact
                        receiver_id={userContact}
                        handleClose={handleClose}
                    />
                )}
            </div>
        </div>
    );
};
