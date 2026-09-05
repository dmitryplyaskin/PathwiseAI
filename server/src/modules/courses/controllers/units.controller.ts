import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UnitsService } from '../services/units.service';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createUnit(@Body() createUnitDto: CreateUnitDto, @CurrentUser() user: User) {
    return this.unitsService.createUnit(createUnitDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllUnits(@CurrentUser() user: User) {
    return this.unitsService.findAccessibleUnits(user.id);
  }

  @Get('shared')
  @UseGuards(JwtAuthGuard)
  findSharedUnits() {
    return this.unitsService.findSharedUnits();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOneUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.unitsService.findOneUnit(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @CurrentUser() user: User,
  ) {
    return this.unitsService.updateUnit(id, updateUnitDto, user.id);
  }

  @Patch(':id/shared')
  @UseGuards(JwtAuthGuard)
  toggleUnitShared(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { shared: boolean },
    @CurrentUser() user: User,
  ) {
    return this.unitsService.updateUnit(id, { shared: body.shared }, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.unitsService.removeUnit(id, user.id);
  }
}
