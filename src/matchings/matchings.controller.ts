import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchingsService } from './matchings.service';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { UpdateMatchingDto } from './dto/update-matching.dto';

@Controller('matchings')
export class MatchingsController {
  constructor(private readonly matchingsService: MatchingsService) {}

  @Post()
  create(@Body() createMatchingDto: CreateMatchingDto) {
    return this.matchingsService.create(createMatchingDto);
  }

  @Get()
  findAll() {
    return this.matchingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchingDto: UpdateMatchingDto) {
    return this.matchingsService.update(+id, updateMatchingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchingsService.remove(+id);
  }
}
