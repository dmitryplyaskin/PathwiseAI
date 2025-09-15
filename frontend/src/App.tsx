import {
  Layout,
  Button,
  Card,
  Tag,
  ConfigProvider,
  Typography,
  Space,
  Row,
  Col,
  Flex,
} from 'antd';
import {
  PlusOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { customTheme } from './theme';
import { EducationCard } from './ui';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Заглушки данных для демонстрации
const recentModules = [
  {
    id: 1,
    title: 'Основы JavaScript',
    description:
      'Изучение базовых концепций JavaScript: переменные, функции, циклы',
    progress: 85,
    lastStudied: '2 дня назад',
    status: 'completed',
  },
  {
    id: 2,
    title: 'React Hooks',
    description:
      'Глубокое погружение в хуки React: useState, useEffect, useContext',
    progress: 60,
    lastStudied: '5 дней назад',
    status: 'in-progress',
  },
  {
    id: 3,
    title: 'TypeScript Fundamentals',
    description: 'Основы TypeScript: типы, интерфейсы, дженерики',
    progress: 100,
    lastStudied: '1 неделя назад',
    status: 'completed',
  },
];

const reviewModules = [
  {
    id: 4,
    title: 'Алгоритмы сортировки',
    description:
      'Повторение основных алгоритмов сортировки и их временной сложности',
    dueDate: 'Сегодня',
    priority: 'high',
  },
  {
    id: 5,
    title: 'CSS Flexbox',
    description: 'Закрепление знаний о флексбокс-контейнерах и их свойствах',
    dueDate: 'Завтра',
    priority: 'medium',
  },
  {
    id: 6,
    title: 'Git команды',
    description: 'Повторение основных команд Git для работы с репозиторием',
    dueDate: 'Через 2 дня',
    priority: 'low',
  },
];

function App() {
  const handleNewModule = () => {
    console.log('Создание нового модуля');
  };

  const handleModuleClick = (moduleId: string) => {
    console.log('Клик по модуль:', moduleId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Срочно';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Обычный';
    }
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fbff 0%, #e8f4fd 100%)',
        }}
      >
        <Header
          style={{
            background: 'transparent',
            textAlign: 'center',
            padding: '48px 0',
          }}
        >
          <Space direction="vertical" size="small">
            <Title
              level={1}
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
              }}
            >
              PathwiseAI
            </Title>
            <Text
              style={{
                fontSize: '1.1rem',
                color: '#64748b',
              }}
            >
              Персональная система обучения с искусственным интеллектом
            </Text>
          </Space>
        </Header>

        <Content style={{ padding: '0 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Секция создания нового модуля */}
            <Flex justify="center" style={{ marginBottom: 48 }}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleNewModule}
                style={{
                  height: 56,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 28,
                  paddingLeft: 32,
                  paddingRight: 32,
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 32px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(59, 130, 246, 0.3)';
                }}
              >
                Изучить новый модуль
              </Button>
            </Flex>

            {/* Последние пройденные модули */}
            <Space
              direction="vertical"
              size="large"
              style={{ width: '100%', marginBottom: 48 }}
            >
              <Title
                level={2}
                style={{
                  color: '#1e3a8a',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                <BookOutlined style={{ marginRight: 8 }} />
                Последние пройденные модули
              </Title>

              <Row gutter={[20, 20]}>
                {recentModules.map((module) => (
                  <Col xs={24} sm={12} lg={8} key={module.id}>
                    <EducationCard
                      // @ts-ignore
                      module={module}
                      handleModuleClick={handleModuleClick}
                    />
                  </Col>
                ))}
              </Row>
            </Space>

            {/* Модули для повторения */}
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title
                level={2}
                style={{
                  color: '#1e3a8a',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Требуют повторения
              </Title>

              <Row gutter={[20, 20]}>
                {reviewModules.map((module) => (
                  <Col xs={24} sm={12} lg={8} key={module.id}>
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
                        e.currentTarget.style.boxShadow =
                          '0 8px 24px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 16px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: '100%' }}
                      >
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

                        <Flex justify="space-between" align="center">
                          <Text
                            style={{ fontSize: '0.85rem', color: '#94a3b8' }}
                          >
                            {module.dueDate}
                          </Text>

                          <Tag
                            color={getPriorityColor(module.priority)}
                            style={{
                              borderRadius: 12,
                              padding: '4px 12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                            }}
                          >
                            {getPriorityText(module.priority)}
                          </Tag>
                        </Flex>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
