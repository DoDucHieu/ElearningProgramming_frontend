import {
    PayCircleOutlined,
    FundOutlined,
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    WalletOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import shoeBG from '../../asset/image/shoeBG.jpg';
import { Layout, Menu } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { commonAction } from '../../store/action/commonAction';
import { userApi } from '../../api/userApi';
import { toast } from 'react-toastify';

function getItem(label: string, key: string, icon?: any, children?: any) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items: any = [
    getItem('Quản lý tài khoản', '1', <UserOutlined />),
    getItem('Quản lý sản phẩm', '2', <WalletOutlined />),
    getItem('Quản lý danh mục sản phẩm', '3', <ProfileOutlined />),
    getItem('Quản lý đơn hàng', '4', <PayCircleOutlined />),
    getItem('Quản lý bài đăng', '5', <FundOutlined />),
    getItem('Quản lý video', '6', <PlayCircleOutlined />),
];

type ArrTabsType = {
    key: number;
    tabName: string;
    url: string;
};

const arrTabs: ArrTabsType[] = [
    {
        key: 1,
        tabName: 'Quản lý tài khoản',
        url: '/manage-account',
    },
    {
        key: 2,
        tabName: 'Quản lý sản phẩm',
        url: '/manage-product',
    },
    {
        key: 3,
        tabName: 'Quản lý danh mục sản phẩm',
        url: '/manage-category',
    },
    {
        key: 4,
        tabName: 'Quản lý đơn hàng',
        url: '/manage-order',
    },
    {
        key: 5,
        tabName: 'Quản lý bài đăng',
        url: '/manage-news',
    },
    {
        key: 6,
        tabName: 'Quản lý video',
        url: '/manage-video',
    },
];

export const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email;
    const userRefreshToken = user.refreshToken;
    const selectedKey = useMemo(() => {
        const item = arrTabs.find((item) => {
            return item.url === location.pathname;
        });
        dispatch(
            commonAction.changeTab({
                key: item?.key,
                name: item?.tabName,
            }),
        );
        return item?.key ?? 0;
    }, [location.pathname]);

    const handleNavigate = (key: any) => {
        arrTabs.forEach((item) => {
            if (Number(key) === item.key) {
                navigate(item.url);
            }
        });
    };

    const handleSignOut = async () => {
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
    };

    return (
        <Layout.Sider>
            <div className="sidebar_logo">
                <img src={shoeBG} alt="" />
            </div>
            <Menu
                theme="dark"
                mode="inline"
                items={items}
                onClick={(value) => {
                    handleNavigate(value?.key);
                }}
                selectedKeys={[selectedKey.toString()]}
            />
            <div className="sidebar_login-logout">
                <div className="user-infor">
                    <img src={shoeBG} alt="" className="avatar" />
                    <div className="infor">
                        <label>Admin</label>
                        <label>{email}</label>
                    </div>
                </div>
                <div className="logout-icon">
                    <LogoutOutlined
                        style={{
                            color: 'white',
                            fontSize: 20,
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            handleSignOut();
                        }}
                    />
                </div>
            </div>
        </Layout.Sider>
    );
};
