import React, { useEffect, useState } from 'react';
import { Card, List, Button, message, Typography, Modal, Spin } from 'antd';
import ReactPlayer from 'react-player';
import './videos.css';
import { useRole } from '../context/AuthContext';
const { Text, Paragraph } = Typography;
const VideoComponent = () => {
  const [videos, setVideos] = useState([]);
  const [videoErrors, setVideoErrors] = useState({});
  const [debugInfo, setDebugInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const { selectedRole } = useRole(); 
  const { visible, setvisible } = useRole();
  useEffect(() => {
    const fetchVideos = async () => {
      if (!selectedRole) return; 
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5003/videos/${selectedRole}`);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        message.error('Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [selectedRole]);
  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`http://localhost:5003/videos/${selectedRole}/${filename}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setVideos(videos.filter(video => video !== filename));
        setVideoErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[filename];
          return newErrors;
        });
        setDebugInfo(prevInfo => {
          const newInfo = { ...prevInfo };
          delete newInfo[filename];
          return newInfo;
        });
        message.success(`Deleted ${filename}`);
      } else {
        console.error('Error deleting video:', response.statusText);
        message.error(`Failed to delete ${filename}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error(`Error occurred while deleting ${filename}`);
    }
  };
  const handleVideoError = (video) => {
    console.error(`Error loading video: ${video}`);
    setVideoErrors(prevErrors => ({ ...prevErrors, [video]: true }));
    setDebugInfo(prevInfo => ({
      ...prevInfo,
      [video]: { errorMessage: 'Failed to load video' },
    }));
  };
  const showDebugInfo = (video) => {
    setIsModalVisible(true);
  };
  const openVideoPlayer = (video) => {
    setCurrentVideo(video);
    setIsModalVisible(true);
  };
  const renderVideoOrFallback = (video) => {
    if (videoErrors[video]) {
      return (
        <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', flexDirection: 'column' }}>
          <Text type="danger">Error loading video: {video}</Text>
          <Button onClick={() => showDebugInfo(video)} style={{ marginTop: '10px' }}>Show Debug Info</Button>
        </div>
      );
    }
    return (
      <div onClick={() => openVideoPlayer(video)} style={{ cursor: 'pointer' }}>
        <ReactPlayer
          url={`http://localhost:5003/videos/${selectedRole}/${video}`}
          width="100%"
          height="240px"
          controls
          onError={() => handleVideoError(video)}
          style={{ maxHeight: '240px', objectFit: 'contain' }}
        />
      </div>
    );
  };

  return (
    <>
      <Card title="Video List" style={{ width: '100%', maxWidth: '1200px', margin: '100px auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={videos}
            renderItem={(video) => (
              <List.Item>
                <Card
                  cover={renderVideoOrFallback(video)}
                  actions={[
                    visible && (
                    <Button onClick={() => handleDelete(video)} danger>Delete</Button>),
                   
                  ]}
                >
                  <Card.Meta 
                    title={video} 
                    description={
                      <a 
                        href={`http://localhost:5003/videos/${selectedRole}/${video}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Direct link
                      </a>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
      <Modal
        title="Video Player"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentVideo && (
          <ReactPlayer
            url={`http://localhost:5003/videos/${selectedRole}/${currentVideo}`}
            controls
            width="100%"
            height="500px"
          />
        )}
      </Modal>
      <Modal
        title="Debug Information"
        visible={isModalVisible && !!debugInfo[currentVideo]}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Paragraph>
          <pre>{JSON.stringify(debugInfo[currentVideo], null, 2)}</pre>
        </Paragraph>
      </Modal>
    </>
  );
};

export default VideoComponent;
