import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { EyeOutlined } from '@ant-design/icons';
import '../../asset/style/CourseComponent.scss';
import { useNavigate } from 'react-router-dom';

export type Props = {
    course_id?: string;
    name?: string;
    number_registry?: number;
    img_url?: string;
    price?: number;
};

export const CourseComponent = ({
    course_id,
    name,
    number_registry,
    img_url,
    price,
}: Props): React.ReactElement => {
    const navigate = useNavigate();
    return (
        <div className="course-component">
            <Card
                className="item"
                hoverable
                cover={
                    <img
                        style={{
                            height: 250,
                            objectFit: 'cover',
                        }}
                        alt="example"
                        src={img_url}
                    />
                }
                onClick={() => {
                    navigate(`/detail-course/${course_id}`);
                }}
            >
                <Meta
                    title={
                        <div className="course-infor">
                            <span className="course-name">{name}</span>
                            <span className="course-view">
                                <span className="view-number">
                                    {price === 0 ? 'Miễn phí' : `${price}$`}
                                </span>
                            </span>
                        </div>
                    }
                />
            </Card>
        </div>
    );
};
