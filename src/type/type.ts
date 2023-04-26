export type CartType = {
    email?: string;
    course_id?: string;
    price?: number;
    img_url?: string;
    name?: string;
    description?: string;
};

export type UserType = {
    _id?: string;
    email?: string;
    password?: string;
    gender?: string;
    age?: string;
    role?: string;
    fullName?: string;
    address?: string;
    avatar?: string;
    accessToken?: string;
    refreshToken?: string;
    isBlock?: boolean;
};

export type ProductType = {
    _id?: string;
    productName?: string;
    description?: string;
    categoryId?: string;
    categoryName?: string;
    imgUrl?: string;
    price?: number;
    datePublish?: string;
};

export type OrderType = {
    order_id?: string;
    email?: string;
    list_course?: CourseType[];
    total_cost?: number;
    payment_method?: string;
    is_purchase?: boolean;
    created_at?: string;
};

export type NewsType = {
    _id?: string;
    name?: string;
    description?: string;
    contentMarkdown?: string;
    contentHTML?: string;
    author?: string;
    img_url?: string;
    is_approved?: string;
    view?: number;
};

export type VideoType = {
    _id?: string;
    name?: string;
    description?: string;
    author?: string;
    img_url?: string;
    video_url?: string;
    is_approved?: string;
    view?: number;
};

export type LessonType = {
    _id?: string;
    course_id?: string;
    name: string;
    description?: string;
    type: boolean;
    video_url?: string;
    contentHTML?: string;
    contentMarkdown?: string;
};

export type CourseType = {
    _id?: string;
    name?: string;
    description?: string;
    img_url?: string;
    price?: number;
    number_registry?: number;
};

export type MyCourseType = {
    _id?: string;
    email?: string;
    course_id?: string;
};

export type CommentType = {
    email?: string;
    comment?: string;
    type?: string;
    video_id?: string;
    new_id?: string;
};

export type TokenType = {
    accessToken: string;
    refreshToken: string;
};

export type RouteApp = {
    href: string;
    isPublic: boolean;
    element: JSX.Element;
};
