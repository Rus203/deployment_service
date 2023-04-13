import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerModule } from './server/server.module';
import typeOrmConfig from './configs/type-orm.config';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(typeOrmConfig), ServerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
