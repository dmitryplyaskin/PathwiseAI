import React from 'react';
import { Layout, Button, Card, Progress, Tag, ConfigProvider } from 'antd';
import {
  PlusOutlined,
  BookOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import './App.css';

const { Header, Content } = Layout;

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

// Кастомная тема для Ant Design
const customTheme = {
  token: {
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 12,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  components: {
    Card: {
      borderRadiusLG: 16,
    },
    Button: {
      borderRadiusLG: 28,
    },
  },
};

function App() {
  const handleNewModule = () => {
    console.log('Создание нового модуля');
  };

  const handleModuleClick = (moduleId: number) => {
    console.log('Клик по модулю:', moduleId);
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout className="app-layout">
        <Header className="app-header">
          <div className="main-content">
            <h1 className="app-title">PathwiseAI</h1>
            <p className="app-subtitle">
              Персональная система обучения с искусственным интеллектом
            </p>
          </div>
        </Header>

        <Content>
          <div className="main-content">
            {/* Секция создания нового модуля */}
            <div className="action-section">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="new-module-btn"
                onClick={handleNewModule}
              >
                Изучить новый модуль
              </Button>
            </div>

            {/* Последние пройденные модули */}
            <section>
              <h2 className="section-title">
                <BookOutlined style={{ marginRight: 8 }} />
                Последние пройденные модули
              </h2>
              <div className="modules-grid">
                {recentModules.map((module) => (
                  <Card
                    key={module.id}
                    className="module-card"
                    hoverable
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <div className="module-title">{module.title}</div>
                    <div className="module-description">
                      {module.description}
                    </div>
                    <div className="module-progress">
                      <Progress
                        percent={module.progress}
                        size="small"
                        strokeColor={{
                          '0%': '#3b82f6',
                          '100%': '#1d4ed8',
                        }}
                      />
                    </div>
                    <div className="module-meta">
                      <span>{module.lastStudied}</span>
                      <Tag
                        className={
                          module.status === 'completed' ? 'completed-badge' : ''
                        }
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
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Модули для повторения */}
            <section>
              <h2 className="section-title">
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Требуют повторения
              </h2>
              <div className="modules-grid">
                {reviewModules.map((module) => (
                  <Card
                    key={module.id}
                    className="module-card"
                    hoverable
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <div className="module-title">{module.title}</div>
                    <div className="module-description">
                      {module.description}
                    </div>
                    <div className="module-meta">
                      <span>{module.dueDate}</span>
                      <Tag
                        className="review-badge"
                        color={
                          module.priority === 'high'
                            ? 'red'
                            : module.priority === 'medium'
                              ? 'orange'
                              : 'blue'
                        }
                      >
                        {module.priority === 'high'
                          ? 'Срочно'
                          : module.priority === 'medium'
                            ? 'Средний'
                            : 'Низкий'}
                      </Tag>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
