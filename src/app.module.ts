import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
  imports: [FilesModule, ConfigModule.forRoot(
    {
      isGlobal: true,
    }
  ), DynamooseModule.forRoot()],
})
export class AppModule {}
