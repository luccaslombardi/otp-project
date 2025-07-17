import { Module } from '@nestjs/common';
import { dynamoProvider } from 'src/infraestructure/external/aws/dynamo.provider';
import { DynamoUserOtpRepository } from 'src/infraestructure/repositories/dynamo-user-otp.repository';


@Module({
  providers: [
    dynamoProvider,
    {
      provide: 'UserOtpRepository',
      useClass: DynamoUserOtpRepository,
    },
  ],
  exports: ['UserOtpRepository', dynamoProvider],
})
export class DatabaseModule {}
