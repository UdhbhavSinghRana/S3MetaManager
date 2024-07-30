import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './files/aws/aws.module';

@Module({
  imports: [FilesModule, AwsModule, ConfigModule.forRoot(
    {
      isGlobal: true,
    }
  ), ],
})
export class AppModule {}
