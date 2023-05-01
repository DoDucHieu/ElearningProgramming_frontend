import { useSelector } from 'react-redux';
import '../../asset/style/Message.scss';
import { RootState } from '../../store/store';

export type Props = {
    text: string;
    type: boolean;
};

export const Message = ({ text, type }: Props): React.ReactElement => {
    const receiver_avatar = useSelector(
        (state: RootState) => state.conversationReducer.receiver_avatar,
    );
    return (
        <>
            {type ? (
                <div className="message message-sender">
                    <div className="message-item message-item-sender">
                        {text}
                    </div>
                </div>
            ) : (
                <div className="message message-receiver">
                    <img
                        src={receiver_avatar && receiver_avatar}
                        className="message-receiver-avatar"
                    />
                    <div className="message-item message-item-receiver">
                        {text}
                    </div>
                </div>
            )}
        </>
    );
};
