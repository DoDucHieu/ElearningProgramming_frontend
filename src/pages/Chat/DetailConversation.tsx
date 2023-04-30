import '../../asset/style/DetailConversation.scss';
import { ListMessage } from './ListMessage';
import { ChatForm } from './ChatForm';

export const DetailConversation = (): React.ReactElement => {
    return (
        <div className="detail-conversation">
            <div className="detail-conversation-header">header</div>
            <div className="detail-conversation-body">
                <ListMessage />
            </div>
            <div className="detail-conversation-footer">
                <ChatForm />
            </div>
        </div>
    );
};
