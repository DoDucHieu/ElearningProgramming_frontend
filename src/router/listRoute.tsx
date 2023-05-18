import { Home } from '../pages/Home/Home';
import { ManageAccount } from '../pages/ManageAccount/ManageAccount';
import { ManageOrder } from '../pages/ManageOrder/ManageOrder';
import { SignIn } from '../pages/SignIn/SignIn';
import { SignUp } from '../pages/SignUp/SignUp';
import { ManageNews } from '../pages/ManageNew/ManageNews';
import { Cart } from '../pages/Cart/Cart';
import { PaymentSuccess } from '../pages/Payment/PaymentSuccess';
import { PaymentCancel } from '../pages/Payment/PaymentCancel';
import { Contact } from '../pages/Contact/Contact';
import { DetailNew } from '../pages/News/DetailNew';
import { ListNew } from '../pages/News/ListNew';
import { ManageVideo } from '../pages/ManageVideo/ManageVideo';
import { ListVideo } from '../pages/Video/ListVideo';
import { DetailVideo } from '../pages/Video/DetailVideo';
import { ManageCourse } from '../pages/ManageCourse/ManageCourse';
import { ManageLesson } from '../pages/ManageLesson/ManageLesson';
import { ListCourse } from '../pages/Course/ListCourse';
import { DetailCourse } from '../pages/Course/DetailCourse';
import { ListMyCourse } from '../pages/MyCourse/ListMyCourse';

export const adminRoute = [
    {
        url: '/manage-account',
        element: <ManageAccount />,
    },
    {
        url: '/manage-course',
        element: <ManageCourse />,
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
    {
        url: '/manage-lesson/:courseId',
        element: <ManageLesson />,
    },
];

export const userRoute = [
    {
        url: '/cart',
        element: <Cart />,
    },
    {
        url: '/list-my-course',
        element: <ListMyCourse />,
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
        url: '/list-course',
        element: <ListCourse />,
    },
    {
        url: '/detail-course/:_id',
        element: <DetailCourse />,
    },
    {
        url: '/list-new',
        element: <ListNew />,
    },
    {
        url: '/list-video',
        element: <ListVideo />,
    },
    {
        url: '/detail-new/:_id',
        element: <DetailNew />,
    },

    {
        url: '/detail-video/:_id',
        element: <DetailVideo />,
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
