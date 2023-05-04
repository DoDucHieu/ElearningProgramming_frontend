import '../../asset/style/ModalVideoCall.scss';
import { useEffect, useState, useRef } from 'react';
import { Button, Modal } from 'antd';
import {
    PhoneOutlined,
    VideoCameraOutlined,
    MessageOutlined,
    AudioOutlined,
    AudioMutedOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Peer } from 'peerjs';

export type Props = {
    receiver_id?: string;
    handleClose?: any;
    socket?: any;
    type?: string;
};
export const ModalVideoCall = ({
    receiver_id,
    handleClose,
    socket,
    type,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const navigate = useNavigate();
    const localVideoRef: any = useRef();
    const remoteVideoRef: any = useRef();
    const [isOpenCam, setIsOpenCam] = useState<boolean>(false);
    const peer = new Peer(user_id);
    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });

    useEffect(() => {
        if (type === 'caller' && user_id && receiver_id && socket?.current) {
            socket.current.emit('makeVideoCall', {
                sender_id: user_id,
                receiver_id,
            });
            socket.current.on(
                `getAcceptVideoCall$${receiver_id}`,
                (peerId: string) => {
                    console.log(
                        'Người dùng đã chấp nhận cuộc gọi với peer id là: ',
                        peerId,
                    );
                    openStream().then((stream) => {
                        playStream(localVideoRef, stream);
                        peerCall(peer, peerId, stream);
                    });
                },
            );
        }
    }, [user_id, receiver_id, socket?.current]);

    useEffect(() => {
        if (type === 'answer' && socket?.current) {
            socket.current.emit('makeAcceptVideoCall', {
                user_id,
                peer: user_id,
            });
            peerAnswer(peer);
        }
    }, [user_id, socket?.current]);

    useEffect(() => {
        receiver_id && handleGetDetailUser(receiver_id);
    }, [receiver_id]);

    const handleGetDetailUser = async (receiver_id: string): Promise<any> => {
        try {
            const params = {
                user_id: receiver_id,
            };
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddConversation = async () => {
        try {
            const data = {
                sender_id: user_id,
                receiver_id: receiver_id,
            };
        } catch (e) {
            console.log(e);
        }
    };

    const openStream = () => {
        const config = { audio: true, video: true };
        return navigator.mediaDevices.getUserMedia(config);
    };

    const playStream = (videoRef: any, stream: any) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
    };

    const peerCall = (peer: any, id: string, stream: any) => {
        const call = peer.call(id, stream);
        call.on('stream', (remoteStream: any) =>
            playStream(remoteVideoRef, remoteStream),
        );
    };

    const peerAnswer = (peer: any) => {
        peer.on('call', (call: any) => {
            openStream().then((stream: any) => {
                call.answer(stream);
                playStream(localVideoRef, stream);
                call.on('stream', (remoteStream: any) =>
                    playStream(remoteVideoRef, remoteStream),
                );
            });
        });
    };

    // useEffect(() => {
    //     isOpenCam &&
    //         openStream().then((stream) => {
    //             playStream(localVideoRef, stream);
    //             peerCall(peer, '123', stream);
    //         });
    //     peerAnswer(peer);
    // }, [isOpenCam]);

    return (
        <Modal
            title={'Video call'}
            open={true}
            onOk={() => handleClose(type)}
            onCancel={() => handleClose(type)}
            footer={null}
            width={1200}
        >
            <div className="modal-video-call">
                {/* <Button onClick={() => setIsOpenCam(!isOpenCam)}>Camera</Button> */}
                <video ref={remoteVideoRef} className="remote-video"></video>
                <video ref={localVideoRef} className="local-video"></video>
                <div className="video-feature">
                    <div className="feature-item show-hide-mic">
                        <AudioOutlined />
                    </div>
                    <div className="feature-item end-call">
                        <PhoneOutlined />
                    </div>
                    <div className="feature-item show-hide-video">
                        <VideoCameraOutlined />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
