import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { AccessControlService } from '../../../shared/services/access-control.service';
import { AccessDeniedException } from '../../../shared/exceptions/access-denied.exception';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    private readonly accessControlService: AccessControlService,
  ) {}

  createUnit(createUnitDto: CreateUnitDto, userId: string) {
    const unit = this.unitRepository.create({
      ...createUnitDto,
      course: { id: createUnitDto.courseId },
      user: { id: userId },
    });
    return this.unitRepository.save(unit);
  }

  findAllUnits() {
    return this.unitRepository.find();
  }

  async findOneUnit(id: string, userId: string) {
    const unit = await this.unitRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`Unit with ID "${id}" not found`);
    }

    const hasAccess = await this.accessControlService.checkUnitAccess(
      id,
      userId,
    );
    if (!hasAccess) {
      throw new AccessDeniedException('юниту', id);
    }

    return unit;
  }

  async findUnitByCourseId(courseId: string) {
    return this.unitRepository.findOne({
      where: { course: { id: courseId } },
      order: { order: 'DESC' },
    });
  }

  async updateUnit(id: string, updateUnitDto: UpdateUnitDto, userId: string) {
    await this.findOneUnit(id, userId);
    await this.unitRepository.update(id, updateUnitDto);
    return this.findOneUnit(id, userId);
  }

  async removeUnit(id: string, userId: string) {
    await this.findOneUnit(id, userId);
    return this.unitRepository.delete(id);
  }

  async findAccessibleUnits(userId: string): Promise<Unit[]> {
    return this.accessControlService.getAccessibleUnits(userId);
  }

  async findSharedUnits(): Promise<Unit[]> {
    return this.accessControlService.getSharedUnits();
  }

  async createUnitForCourse(courseId: string, order: number, userId: string) {
    const unit = this.unitRepository.create({
      course: { id: courseId },
      user: { id: userId },
      title: `Раздел ${order}`,
      order: order,
    });
    return this.unitRepository.save(unit);
  }
}
