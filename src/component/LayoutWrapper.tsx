import {
    ContactsOutlined,
    HomeOutlined,
    LogoutOutlined,
    PhoneOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    SnippetsOutlined,
    UserOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userApi } from '../api/userApi';
import '../asset/style/LayoutWrapper.scss';
import { Router } from '../router/router';
import { RootState } from '../store/store';
import { Content } from './Content/Content';
import { Header } from './Header/Header';
import { SideBar } from './SideBar/SideBar';

const LayoutWrapper = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1];
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;
    const userAccessToken = user.accessToken;
    const userRefreshToken = user.refreshToken;
    const userInfor = useSelector(
        (state: RootState) => state.commonReducer.userInfo,
    );
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    type Menu = {
        key: number;
        label: React.ReactElement;
        url: string;
        children?: any;
    };

    const menu: Menu[] = [
        {
            key: 1,
            label: (
                <div>
                    <HomeOutlined />
                    <span>Trang chủ</span>
                </div>
            ),
            url: '/',
        },
        {
            key: 2,
            label: (
                <div>
                    <ShopOutlined />
                    <span>Sản phẩm</span>
                </div>
            ),
            url: '/product',
        },

        {
            key: 3,
            label: (
                <div>
                    <ShopOutlined />
                    <span>Khóa học</span>
                </div>
            ),
            url: '/list-course',
        },

        {
            key: 4,
            label: (
                <div>
                    <ShoppingCartOutlined />
                    <span>Giỏ hàng</span>
                </div>
            ),
            url: '/cart',
        },

        {
            key: 5,
            label: (
                <div>
                    <SnippetsOutlined />
                    <span>Bài viết</span>
                </div>
            ),
            url: '/list-new',
        },

        {
            key: 6,
            label: (
                <div>
                    <PlayCircleOutlined />
                    <span>Video</span>
                </div>
            ),
            url: '/list-video',
        },
        {
            key: 7,
            label: (
                <div>
                    <ContactsOutlined />
                    <span>Về chúng tôi</span>
                </div>
            ),
            url: '/page',
        },

        {
            key: 8,
            label: (
                <div>
                    <PhoneOutlined />
                    <span>Liên hệ</span>
                </div>
            ),
            url: '/contact',
        },
        {
            key: 9,
            label: user.accessToken && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={userInfor?.avatar}
                        style={{
                            width: 32,
                            height: 32,
                            objectFit: 'cover',
                            borderRadius: '50%',
                            marginRight: 8,
                        }}
                    />
                    <span>{userInfor?.fullName}</span>
                </div>
            ),
            url: '/my-infor',
            children: [
                {
                    label: (
                        <div onClick={() => navigate('/my-infor')}>
                            <UserOutlined />
                            <span>Thông tin cá nhân</span>
                        </div>
                    ),
                },
            ],
        },
        {
            key: 10,
            label: (
                <div>
                    <LogoutOutlined />
                    <span>{userAccessToken ? 'Đăng xuất' : 'Đăng nhập'}</span>
                </div>
            ),
            url: '/sign-in',
        },
    ];

    const handleNavigateMenu = (key: number) => {
        menu.forEach(async (item) => {
            if (key == item.key) {
                if (item.key == 10) {
                    if (userAccessToken) {
                        try {
                            const res = await userApi.signOut({
                                refreshToken: userRefreshToken,
                            });
                            if (res) {
                                localStorage.removeItem('user');
                                navigate('/');
                            }
                        } catch (e: any) {
                            console.log(e);
                            toast.error(e.message);
                        }
                    } else navigate(item.url);
                } else return navigate(item.url);
            }
        });
    };

    return (
        <>
            {userAccessToken && role === 'admin' ? (
                <Layout
                    style={{
                        height: '100vh',
                    }}
                    className="layoutWrapperComponent layout-admin"
                >
                    <SideBar />
                    <Layout className="site-layout">
                        <Header />
                        <Content />
                    </Layout>
                </Layout>
            ) : (
                <>
                    <Layout className="layout layout-user">
                        {currentPath !== 'sign-in' &&
                            currentPath !== 'sign-up' && (
                                <Layout.Header style={{ padding: '0 40px' }}>
                                    <div className="logo" />
                                    <div className="header-menu">
                                        <div className="menu-left">
                                            <Menu
                                                theme="light"
                                                mode="horizontal"
                                                defaultSelectedKeys={menu.map(
                                                    (item) =>
                                                        item.url ==
                                                        location.pathname
                                                            ? `${item.key}`
                                                            : '',
                                                )}
                                                items={menu.map((item) =>
                                                    item.key < 9 ? item : null,
                                                )}
                                                onClick={(value: any) =>
                                                    handleNavigateMenu(
                                                        value.key,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="menu-right">
                                            <Menu
                                                theme="light"
                                                mode="horizontal"
                                                items={menu.map((item) =>
                                                    item.key >= 9 ? item : null,
                                                )}
                                                onClick={(value: any) =>
                                                    handleNavigateMenu(
                                                        value.key,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </Layout.Header>
                            )}
                        <Layout.Content
                            style={{
                                marginTop:
                                    currentPath !== 'sign-in' &&
                                    currentPath !== 'sign-up'
                                        ? 64
                                        : 0,
                                padding:
                                    currentPath !== 'sign-in' &&
                                    currentPath !== 'sign-up'
                                        ? '0 40px'
                                        : '0px',
                                backgroundColor: '#FFFFFF',
                            }}
                        >
                            <div
                                className="site-layout-content"
                                style={{ background: colorBgContainer }}
                            >
                                <Router />
                            </div>
                        </Layout.Content>
                        {currentPath !== 'sign-in' &&
                            currentPath !== 'sign-up' && (
                                <Layout.Footer
                                    style={{
                                        textAlign: 'center',
                                        color: 'red',
                                    }}
                                >
                                    Elearning programming ©2023 created by Do
                                    Duc Hieu
                                </Layout.Footer>
                            )}
                    </Layout>
                </>
            )}
        </>
    );
};
export default LayoutWrapper;
