import '../../asset/style/Message.scss';

export type Props = {
    text: string;
    type: boolean;
    receiver_avatar?: string;
};

export const Message = ({
    text,
    type,
    receiver_avatar,
}: Props): React.ReactElement => {
    return (
        <>
            <div className="message message-sender">
                <div className="message-item message-item-sender">{text}</div>
            </div>
            <div className="message message-receiver">
                <img
                    src={receiver_avatar}
                    className="message-receiver-avatar"
                />
                <div className="message-item message-item-receiver">{text}</div>
            </div>
        </>
    );
};
