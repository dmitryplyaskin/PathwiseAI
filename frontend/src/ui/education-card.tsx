import { Card, Space, Typography, Progress, Tag, Flex } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import type { FC } from 'react';

const { Title, Text } = Typography;

interface EducationCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    progress: number;
    lastStudied: string;
    status: string;
  };
  handleModuleClick: (id: string) => void;
}

export const EducationCard: FC<EducationCardProps> = ({
  module,
  handleModuleClick,
}) => {
  return (
    <Card
      hoverable
      onClick={() => handleModuleClick(module.id)}
      style={{
        borderRadius: 16,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Title
          level={4}
          style={{
            color: '#1e3a8a',
            margin: 0,
            fontSize: '1.1rem',
          }}
        >
          {module.title}
        </Title>

        <Text
          style={{
            color: '#64748b',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          {module.description}
        </Text>

        <Progress
          percent={module.progress}
          size="small"
          strokeColor={{
            '0%': '#3b82f6',
            '100%': '#1d4ed8',
          }}
          trailColor="#e2e8f0"
        />

        <Flex justify="space-between" align="center">
          <Text style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {module.lastStudied}
          </Text>

          <Tag
            color={module.status === 'completed' ? 'success' : 'processing'}
            style={{
              borderRadius: 12,
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
            }}
          >
            {module.status === 'completed' ? (
              <>
                <TrophyOutlined style={{ marginRight: 4 }} />
                Завершен
              </>
            ) : (
              'В процессе'
            )}
          </Tag>
        </Flex>
      </Space>
    </Card>
  );
};
