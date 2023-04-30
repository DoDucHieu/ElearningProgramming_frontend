import '../../asset/style/ChatComponent.scss';
import { DetailConversation } from './DetailConversation';
import { ListConversation } from './ListConversation';

export const ChatComponent = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    return (
        <div className="chat-component">
            <div className="chat-left">
                <ListConversation user_id={user_id} />
            </div>
            <div className="chat-right">
                <DetailConversation />
            </div>
        </div>
    );
};
