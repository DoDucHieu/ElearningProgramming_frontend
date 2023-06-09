export type CartType = {
    email?: string;
    course_id?: string;
    price?: number;
    img_url?: string;
    name?: string;
    description?: string;
};

export type UserType = {
    order?: number;
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

export type OrderType = {
    order?: number;
    order_id?: string;
    email?: string;
    list_course?: CourseType[];
    total_cost?: number;
    payment_method?: string;
    is_purchase?: boolean;
    created_at?: string;
};

export type NewsType = {
    order?: number;
    _id?: string;
    name?: string;
    description?: string;
    contentMarkdown?: string;
    contentHTML?: string;
    author?: UserType;
    img_url?: string;
    is_approved?: string;
    view?: number;
};

export type VideoType = {
    order?: number;
    _id?: string;
    name?: string;
    description?: string;
    author?: UserType;
    img_url?: string;
    video_url?: string;
    is_approved?: string;
    view?: number;
};

export type LessonType = {
    order?: number;
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
    order?: number;
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
    user_id?: string;
    avatar?: string;
    full_name?: string;
    comment?: string;
    type?: string;
    video_id?: string;
    new_id?: string;
    lesson_id?: string;
};

export type ConversationType = {
    members?: string[];
    name?: string;
};

export type MessageType = {
    conversation_id?: string;
    sender_id?: string;
    text?: string;
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
