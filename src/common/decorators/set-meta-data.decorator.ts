import { SetMetadata } from '@nestjs/common';
import { MetaDataKeys } from '@common/enums/metaDataKeys.enum';

export const SetMetaData = <T>(key: MetaDataKeys, args: T) =>
  SetMetadata(key, args);
