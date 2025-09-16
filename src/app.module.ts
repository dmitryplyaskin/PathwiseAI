import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PGliteDriver } from 'typeorm-pglite';
import { CoursesModule } from './modules/courses/courses.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      driver: new PGliteDriver().driver,
      database: 'pathwiseai',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    CoursesModule,
    QuestionsModule,
    ExamsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
