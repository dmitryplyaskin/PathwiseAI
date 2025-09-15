import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PGliteDriver } from 'typeorm-pglite';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
