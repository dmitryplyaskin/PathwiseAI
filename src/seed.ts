import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './modules/users/entities/user.entity';
import { Course } from './modules/courses/entities/course.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const courseRepository = app.get<Repository<Course>>(
    getRepositoryToken(Course),
  );

  // Создаем тестового пользователя
  let testUser = await userRepository.findOne({
    where: { username: 'testuser' },
  });
  if (!testUser) {
    // Хешируем пароль
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Test123456!', salt);

    testUser = userRepository.create({
      username: 'testuser',
      email: 'test@example.com',
      password_hash: hashedPassword,
      settings: {},
    });
    await userRepository.save(testUser);
    console.log('Создан тестовый пользователь:', testUser.id);
    console.log('Email: test@example.com, Password: Test123456!');
  } else {
    console.log('Тестовый пользователь уже существует:', testUser.id);
  }

  // Создаем тестовые курсы
  const testCourses = [
    {
      title: 'Введение в искусственный интеллект',
      description: 'Основы AI и машинного обучения',
    },
    {
      title: 'Промпт-инжиниринг',
      description: 'Искусство создания эффективных промптов для AI',
    },
    {
      title: 'Этика данных и AI',
      description: 'Этические аспекты использования данных и ИИ',
    },
    {
      title: 'Глубокое обучение',
      description: 'Нейронные сети и глубокое обучение',
    },
  ];

  for (const courseData of testCourses) {
    const existingCourse = await courseRepository.findOne({
      where: { title: courseData.title },
    });

    if (!existingCourse) {
      const course = courseRepository.create({
        ...courseData,
        user: testUser,
      });
      await courseRepository.save(course);
      console.log('Создан курс:', course.title);
    } else {
      console.log('Курс уже существует:', courseData.title);
    }
  }

  console.log('Сидер завершен!');
  await app.close();
}

seed().catch((error) => {
  console.error('Ошибка при выполнении сидера:', error);
  process.exit(1);
});
