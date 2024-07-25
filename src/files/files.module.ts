import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { metaDataSchema } from 'src/metadata/metadata.schema';


@Module({
  imports: [
    DynamooseModule.forFeature([{
      name: 'Meta',
      schema: metaDataSchema,
      options: {
        tableName: 'user',
      },
    }]),
  ],
  controllers: [FilesController],
  providers: [FilesService, ConfigService],
})
export class FilesModule {}
