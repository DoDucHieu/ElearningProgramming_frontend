import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { EyeOutlined } from '@ant-design/icons';
import '../../asset/style/NewComponent.scss';
import { useNavigate } from 'react-router-dom';

export type Props = {
    course_id?: string;
    name?: string;
    number_registry?: number;
    img_url?: string;
};

export const CourseComponent = ({
    course_id,
    name,
    number_registry,
    img_url,
}: Props): React.ReactElement => {
    const navigate = useNavigate();
    return (
        <div className="new-component">
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
                        <div className="new-infor">
                            <span className="new-name">{name}</span>
                            <span className="new-view">
                                <EyeOutlined />
                                <span className="view-number">
                                    {number_registry}
                                </span>
                            </span>
                        </div>
                    }
                />
            </Card>
        </div>
    );
};
