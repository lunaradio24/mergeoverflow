import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TechService } from './tech.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

@Controller('tech')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @Post()
  create(@Body() createTechDto: CreateTechDto) {
    return this.techService.create(createTechDto);
  }

  @Get()
  findAll() {
    return this.techService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechDto: UpdateTechDto) {
    return this.techService.update(+id, updateTechDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techService.remove(+id);
  }
}
