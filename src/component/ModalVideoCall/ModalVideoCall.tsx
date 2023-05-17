import {
    AudioOutlined,
    PhoneOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import { Peer } from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../asset/style/ModalVideoCall.scss';
import { RootState } from '../../store/store';

export type Props = {
    receiver_id?: string;
    sender_id?: string;
    handleClose?: any;
    socket?: any;
    type?: string;
};
export const ModalVideoCall = ({
    receiver_id,
    sender_id,
    handleClose,
    socket,
    type,
}: Props): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user.user_id;
    const navigate = useNavigate();
    const receiver_avatar = useSelector(
        (state: RootState) => state.conversationReducer.receiver_avatar,
    );
    const receiver_name = useSelector(
        (state: RootState) => state.conversationReducer.receiver_name,
    );
    const [status, setStatus] = useState<string>('calling');
    const localVideoRef: any = useRef();
    const remoteVideoRef: any = useRef();
    const [isOpenCam, setIsOpenCam] = useState<boolean>(true);
    const [isOpenMic, setIsOpenMic] = useState<boolean>(true);
    const [isOpenCam2, setIsOpenCam2] = useState<boolean>(true);
    const [isOpenMic2, setIsOpenMic2] = useState<boolean>(true);
    const userStream: any = useRef();
    const peer = new Peer(user_id);

    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });

    console.log('sender: ', sender_id);

    useEffect(() => {
        if (type === 'caller' && user_id && receiver_id && socket) {
            socket.emit('makeVideoCall', {
                sender_id: user_id,
                receiver_id,
            });

            socket.on(`getAcceptVideoCall${receiver_id}`, (peerId: string) => {
                openStream().then((stream) => {
                    playStream(localVideoRef, stream);
                    peerCall(peer, peerId, stream);
                    userStream.current = stream;
                });

                socket.on(`userDisconnect${receiver_id}`, (userId: string) => {
                    console.log('Người dùng vừa ngắt kết nối: ', userId);
                    userStream.current && endCall();
                });

                socket.on(`getEndCall${receiver_id}`, (userId: string) => {
                    console.log('Người dùng vừa kết thúc cuộc gọi: ', userId);
                    setStatus('finish');
                });

                socket.on(
                    `getShowHideCamera${receiver_id}`,
                    ({ user_id, value }: any) => {
                        console.log(
                            `Người dùng ${receiver_id} vừa điều chỉnh camera: ${value}`,
                        );
                        setIsOpenCam2(value);
                    },
                );
            });

            socket.on(
                `getDeclineVideoCall${receiver_id}`,
                (user_id: string) => {
                    console.log(
                        `Người dùng ${user_id} đã từ chối cuộc gọi video!`,
                    );
                    setStatus('decline');
                },
            );
        }

        if (type === 'answer' && user_id && socket) {
            socket.emit('makeAcceptVideoCall', {
                user_id,
                peer: user_id,
            });
            peerAnswer(peer);
            console.log('sender_id: ', sender_id, user_id);

            sender_id &&
                socket.on(`userDisconnect${sender_id}`, (userId: string) => {
                    console.log('Người dùng vừa ngắt kết nối: ', userId);
                    userStream.current && endCall();
                });

            sender_id &&
                socket.on(`getEndCall${sender_id}`, (userId: string) => {
                    console.log('Người dùng vừa kết thúc cuộc gọi: ', userId);
                    setStatus('finish');
                });

            sender_id &&
                socket.on(
                    `getShowHideCamera${sender_id}`,
                    ({ user_id, value }: any) => {
                        console.log(
                            `Người dùng ${sender_id} vừa điều chỉnh camera: ${value}`,
                        );

                        setIsOpenCam2(value);
                    },
                );
        }
    }, [user_id, sender_id, receiver_id, socket]);

    const openStream = () => {
        const config = { audio: true, video: true };
        return navigator.mediaDevices.getUserMedia(config);
    };

    const playStream = async (videoRef: any, stream: any) => {
        try {
            const video = videoRef.current;
            video.srcObject = stream;
            await video.play();
        } catch (e) {
            console.log('error: ', e);
        }
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
                userStream.current = stream;
            });
        });
    };

    useEffect(() => {
        if (isOpenCam && userStream.current)
            showHideCam(userStream.current, true);
        if (!isOpenCam && userStream.current)
            showHideCam(userStream.current, false);
    }, [isOpenCam, userStream?.current]);

    useEffect(() => {
        if (isOpenMic && userStream.current)
            showHideMic(userStream.current, true);
        if (!isOpenMic && userStream.current)
            showHideMic(userStream.current, false);
    }, [isOpenMic, userStream?.current]);

    const showHideCam = (userStream: any, type: boolean) => {
        if (userStream) {
            const videoTrack = userStream
                .getTracks()
                .find((track: any) => track.kind === 'video');
            videoTrack.enabled = type ? true : false;
        }
    };

    const showHideMic = (userStream: any, type: boolean) => {
        if (userStream) {
            const audioTrack = userStream
                .getTracks()
                .find((track: any) => track.kind === 'audio');
            audioTrack.enabled = type ? true : false;
        }
    };

    const endCall = () => {
        try {
            socket.emit('makeEndCall', user_id);
            userStream?.current &&
                userStream.current.getTracks().forEach(async (track: any) => {
                    await track.stop();
                });
        } catch (e) {
            console.log(e);
        } finally {
            setStatus('finish');
        }
    };

    const handleShowHideCam = (value: boolean) => {
        setIsOpenCam(value);
        socket.emit('makeShowHideCamera', { user_id, value });
    };

    return (
        <Modal
            title={'Video call'}
            open={true}
            onCancel={() => {
                if (status === 'calling') endCall();
                handleClose(type);
            }}
            footer={null}
            width={1200}
            maskClosable={false}
        >
            {status === 'calling' ? (
                <div className="modal-video-call">
                    <video
                        ref={remoteVideoRef}
                        className={
                            isOpenCam2
                                ? 'remote-video'
                                : 'remote-video remote-video-hide'
                        }
                    ></video>
                    <div
                        className={
                            isOpenCam2
                                ? 'remote-avatar remote-avatar-hide'
                                : 'remote-avatar'
                        }
                    >
                        <img
                            className="avatar"
                            src={receiver_avatar && receiver_avatar}
                        />
                    </div>
                    <video
                        ref={localVideoRef}
                        className={
                            isOpenCam
                                ? 'local-video'
                                : 'local-video local-video-hide'
                        }
                    ></video>
                    <div
                        className={
                            isOpenCam
                                ? 'local-avatar local-avatar-hide'
                                : 'local-avatar'
                        }
                    >
                        <img
                            className="avatar"
                            src={user?.avatar && user.avatar}
                        />
                    </div>
                    <div className="video-feature">
                        <div
                            className={
                                !isOpenMic
                                    ? 'feature-item feature-item-hide-mic'
                                    : 'feature-item'
                            }
                            onClick={() => setIsOpenMic(!isOpenMic)}
                        >
                            <AudioOutlined />
                        </div>
                        <div
                            className="feature-item end-call"
                            onClick={() => endCall()}
                        >
                            <PhoneOutlined />
                        </div>
                        <div
                            className={
                                !isOpenCam
                                    ? 'feature-item feature-item-hide-cam'
                                    : 'feature-item'
                            }
                            onClick={() => handleShowHideCam(!isOpenCam)}
                        >
                            <VideoCameraOutlined />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="modal-end-call">
                    <div className="receiver">
                        <img
                            className="avatar"
                            src={receiver_avatar && receiver_avatar}
                        />
                        <div className="name">
                            {receiver_name && receiver_name}
                        </div>
                        <div className="notification">
                            {status === 'decline'
                                ? 'Người dùng đã từ chối cuộc gọi!'
                                : 'Cuộc trò chuyện đã kết thúc!'}
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};
