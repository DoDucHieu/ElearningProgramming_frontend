import '../../asset/style/ChatForm.scss';
import { Button, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useSearchParams } from 'react-router-dom';
import { messageApi } from '../../api/messageApi';

export const ChatForm = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const [searchParams, setSearchParams] = useSearchParams();
    const conversation_id = searchParams.get('conversation_id');
    const [form] = Form.useForm();

    const onFinish = async () => {
        try {
            if (conversation_id && user_id) {
                const data = {
                    sender_id: user_id,
                    conversation_id,
                    text: form.getFieldValue('text'),
                };
                const res = await messageApi.add(data);
                if (res?.data?.data) {
                    console.log('send message: ', res.data.data);
                    form.setFieldValue('text', '');
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="chat-form">
            <Form
                style={{ padding: '15px 0' }}
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                labelAlign="left"
                id="form"
            >
                <Form.Item name="text">
                    <TextArea rows={2} />
                </Form.Item>
            </Form>

            <Button
                type="primary"
                htmlType="submit"
                form="form"
                className="btn-send-message"
            >
                Gửi
            </Button>
        </div>
    );
};
