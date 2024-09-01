import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':search_param')
  findOne(@Param('search_param') search_param: string) {
    return this.pokemonService.findOne(search_param);
  }

  @Patch(':search_param')
  update(
    @Param('search_param') search_param: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(search_param, updatePokemonDto);
  }

  @Delete(':search_param')
  async remove(@Param('search_param', ParseMongoIdPipe) search_param: string) {
    return await this.pokemonService.remove(search_param);
  }
}
