import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { EyeOutlined } from '@ant-design/icons';
import '../../asset/style/VideoComponent.scss';
import { useNavigate } from 'react-router-dom';

export type Props = {
    video_id?: string;
    name?: string;
    view?: number;
    img_url?: string;
};

export const VideoComponent = ({
    video_id,
    name,
    view,
    img_url,
}: Props): React.ReactElement => {
    const navigate = useNavigate();
    return (
        <div className="video-component">
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
                    navigate(`/detail-video/${video_id}`);
                }}
            >
                <Meta
                    title={
                        <div className="video-infor">
                            <span className="video-name">{name}</span>
                            <span className="video-view">
                                <EyeOutlined />
                                <span className="view-number">{view}</span>
                            </span>
                        </div>
                    }
                />
            </Card>
        </div>
    );
};
