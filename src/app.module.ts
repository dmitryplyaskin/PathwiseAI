import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PGliteDriver } from 'typeorm-pglite';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { CoursesModule } from './modules/courses/courses.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ChatModule } from './modules/chat/chat.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      driver: new PGliteDriver({
        dataDir: './pglite-data',
        extensions: { uuid_ossp },
      }).driver,
      database: 'pathwiseai',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SharedModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    QuestionsModule,
    ExamsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
