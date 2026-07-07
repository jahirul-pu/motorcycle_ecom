import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('addresses')
@Controller('me/addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'List all addresses for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of addresses returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  findAll(@Request() req) {
    return this.addressesService.findAll(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new address for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Address created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(req.user.sub, createAddressDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing address details' })
  @ApiResponse({ status: 200, description: 'Address updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  update(@Request() req, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(req.user.sub, id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an address from address book' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  delete(@Request() req, @Param('id') id: string) {
    return this.addressesService.delete(req.user.sub, id);
  }
}
