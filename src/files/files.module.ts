import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { FileRepository } from './files.repository';


@Module({
  imports: [AwsModule],
  controllers: [FilesController],
  providers: [FilesService, ConfigService, FileRepository],
})
export class FilesModule {}
