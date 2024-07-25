import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FilesModule, ConfigModule.forRoot(
    {
      isGlobal: true,
    }
  )],
})
export class AppModule {}
