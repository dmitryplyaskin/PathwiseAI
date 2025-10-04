import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  createUnit(createUnitDto: CreateUnitDto) {
    const unit = this.unitRepository.create({
      ...createUnitDto,
      course: { id: createUnitDto.courseId },
    });
    return this.unitRepository.save(unit);
  }

  findAllUnits() {
    return this.unitRepository.find();
  }

  async findOneUnit(id: string) {
    const unit = await this.unitRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`Unit with ID "${id}" not found`);
    }
    return unit;
  }

  async findUnitByCourseId(courseId: string) {
    return this.unitRepository.findOne({
      where: { course: { id: courseId } },
      order: { order: 'DESC' },
    });
  }

  async updateUnit(id: string, updateUnitDto: UpdateUnitDto) {
    await this.findOneUnit(id);
    await this.unitRepository.update(id, updateUnitDto);
    return this.findOneUnit(id);
  }

  async removeUnit(id: string) {
    await this.findOneUnit(id);
    return this.unitRepository.delete(id);
  }

  async createUnitForCourse(courseId: string, order: number) {
    const unit = this.unitRepository.create({
      course: { id: courseId },
      title: `Раздел ${order}`,
      order: order,
    });
    return this.unitRepository.save(unit);
  }
}
