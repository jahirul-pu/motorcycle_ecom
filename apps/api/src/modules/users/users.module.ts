import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MeController } from './me.controller';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';

@Module({
  controllers: [MeController, AddressesController],
  providers: [UsersService, AddressesService],
  exports: [UsersService, AddressesService],
})
export class UsersModule {}
