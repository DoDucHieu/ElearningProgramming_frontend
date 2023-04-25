export type CartType = {
    email?: string;
    productId?: string;
    quantity?: number;
    price?: number;
    imgUrl?: string;
    productName?: string;
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

export type CategoryType = {
    categoryId?: string;
    categoryName?: string;
};

export type OrderType = {
    orderId?: string;
    email?: string;
    listProduct?: ProductType[];
    totalCost?: number;
    shipFee?: number;
    paymentMethod?: string;
    receiveAddress?: string;
    isPurchase?: boolean;
    createdAt?: string;
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
