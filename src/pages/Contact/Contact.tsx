import '../../asset/style/Contact.scss';
import emailjs from '@emailjs/browser';
import {
    MailOutlined,
    InstagramOutlined,
    FacebookOutlined,
} from '@ant-design/icons';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingComponent } from '../../component/LoadingComponent/LoadingComponent';
export const Contact = (): React.ReactElement => {
    const form: any = useRef();
    const [loading, setLoading] = useState<boolean>(false);
    const [fullName, setFullname] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [reason, setReason] = useState<string>();

    const sendEmail = (e: any) => {
        e.preventDefault();
        setLoading(true);
        emailjs
            .sendForm(
                'service_2qir8fl',
                'template_rnqykgu',
                form.current,
                'QrRRO0bb5sqsoQ_Ut',
            )
            .then(
                (result) => {
                    toast.success('Liên hệ thành công!');
                },
                (error) => {
                    console.log(error.text);
                },
            )
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
                setFullname('');
                setEmail('');
                setReason('');
            });
    };
    return (
        <div className="contact">
            <div className="contact-bg">
                <div className="contact-left">
                    <h1>Cùng trò chuyện.</h1>
                    <h1>Hãy cho chúng tôi biết những điều</h1>
                    <h1>bạn muốn.</h1>
                    <div className="something-together">
                        Hãy làm mọi thứ cùng nhau bạn nhé!
                    </div>
                    <div className="associate-network">
                        <div className="app-email">
                            <MailOutlined />
                            <p>hieuncncnc@gmail.com</p>
                        </div>
                        <div className="app-email">
                            <InstagramOutlined />
                            <p>https://www.instagram.com/doduchieu_7</p>
                        </div>
                        <div className="app-email">
                            <FacebookOutlined />
                            <p>https://www.facebook.com/hieuncncnc</p>
                        </div>
                    </div>
                </div>
                <div className="contact-right">
                    <div className="form-contact">
                        <form ref={form} onSubmit={sendEmail} className="form">
                            <div className="row">
                                <label>Họ tên</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullname(e.target.value)
                                    }
                                />
                            </div>
                            <div className="row">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="user_email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="row">
                                <label>Nội dung liên hệ</label>
                                <textarea
                                    name="message"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <input type="submit" value="Send" className="btn" />
                        </form>
                    </div>
                </div>
            </div>
            {loading && <LoadingComponent />}
        </div>
    );
};
