// apps/api/src/modules/products/products.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
