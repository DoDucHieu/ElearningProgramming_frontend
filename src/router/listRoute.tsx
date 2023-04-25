import { ManageCategory } from '../pages/ManageCategory/ManageCategory';
import { Home } from '../pages/Home/Home';
import { ManageAccount } from '../pages/ManageAccount/ManageAccount';
import { ManageOrder } from '../pages/ManageOrder/ManageOrder';
import { ManageProduct } from '../pages/ManageProduct/ManageProduct';
import { Product } from '../pages/Product/Product';
import { SignIn } from '../pages/SignIn/SignIn';
import { SignUp } from '../pages/SignUp/SignUp';
import { ManageNews } from '../pages/ManageNew/ManageNews';
import { DetailProduct } from '../pages/Product/DetailProduct';
import { Cart } from '../pages/Cart/Cart';
import { PaymentSuccess } from '../pages/Payment/PaymentSuccess';
import { PaymentCancel } from '../pages/Payment/PaymentCancel';
import { Page } from '../pages/Page/Page';
import { Contact } from '../pages/Contact/Contact';
import { MyInfor } from '../pages/MyInfor/MyInfor';
import { DetailNew } from '../pages/News/DetailNew';
import { ListNew } from '../pages/News/ListNew';
import { ManageVideo } from '../pages/ManageVideo/ManageVdeo';

export const adminRoute = [
    {
        url: '/manage-account',
        element: <ManageAccount />,
    },
    {
        url: '/manage-product',
        element: <ManageProduct />,
    },
    {
        url: '/manage-category',
        element: <ManageCategory />,
    },
    {
        url: '/manage-order',
        element: <ManageOrder />,
    },
    {
        url: '/manage-news',
        element: <ManageNews />,
    },
    {
        url: '/manage-video',
        element: <ManageVideo />,
    },
];

export const userRoute = [
    {
        url: '/cart',
        element: <Cart />,
    },
    {
        url: '/my-infor',
        element: <MyInfor />,
    },
    {
        url: '/payment-success/:orderId',
        element: <PaymentSuccess />,
    },
    {
        url: '/payment-cancel/:orderId',
        element: <PaymentCancel />,
    },
];

export const publicRoute = [
    {
        url: '/',
        element: <Home />,
    },
    {
        url: '/product',
        element: <Product />,
    },

    {
        url: '/detail-product/:id',
        element: <DetailProduct />,
    },
    {
        url: '/list-new',
        element: <ListNew />,
    },
    {
        url: '/detail-new/:_id',
        element: <DetailNew />,
    },
    {
        url: '/page',
        element: <Page />,
    },
    {
        url: '/contact',
        element: <Contact />,
    },
    {
        url: '/sign-in',
        element: <SignIn />,
    },
    {
        url: '/sign-up',
        element: <SignUp />,
    },
];
