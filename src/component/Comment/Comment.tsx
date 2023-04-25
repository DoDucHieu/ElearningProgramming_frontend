import { SendOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { commentApi } from '../../api/commentApi';
import '../../asset/style/Comment.scss';
import { CommentType } from '../../type/type';

export type Props = {
    _id?: string;
    email?: string;
    type?: string;
};

export const Comment = ({ _id, email, type }: Props) => {
    const [comment, setComment] = useState('');
    const [listComment, setListComment] = useState<CommentType[]>([]);

    const handleGetAllComment = async () => {
        try {
            const params = {
                _id,
                type,
            };
            const res = await commentApi.getAll(params);
            setListComment(res?.data?.data.reverse());
        } catch (e) {
            console.log('error: ', e);
        }
    };

    const handleAddComment = async () => {
        try {
            if (comment.trim() !== '') {
                const data = {
                    comment: comment,
                    _id,
                    email,
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
        handleGetAllComment();
    }, []);

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
                                    <Avatar src="https://joeschmoe.io/api/v1/random" />
                                }
                                title={item.email}
                                description={item.comment}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};
