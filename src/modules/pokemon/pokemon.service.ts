/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      return await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createMany(pokemons: { no: number; name: string; }[], options = {}) {
    try {
      const result = await this.pokemonModel.insertMany(pokemons, options);
      console.log(`${result.length} documents were inserted`);
    } catch (err) {
        if (err.code === 11000) {
            console.log('Duplicate key error detected. Some documents were not inserted.');
        } else {
            throw err;
        }
    }

  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page, limit = this.defaultLimit } = paginationQuery;

    const skip = (page - 1) * limit;

    return await this.pokemonModel
      .find()
      .skip(skip)
      .limit(limit)
      .select(['name', 'no'])
      .exec();
  }

  async findOne(search_param: string) {
    let pokemon: Pokemon;

    if (!isNaN(+search_param)) {
      pokemon = await this.pokemonModel.findOne({ no: search_param });
    }

    if (!pokemon && isValidObjectId(search_param)) {
      pokemon = await this.pokemonModel.findById(search_param);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: search_param.toLocaleLowerCase(),
      });
    }

    // if (!isValidObjectId(search_param) && isNaN(+search_param)) {
    //   pokemon = await this.pokemonModel.findOne({
    //     name: search_param.toLocaleLowerCase(),
    //   });
    // }

    if (!pokemon) {
      throw new BadRequestException(
        `No pokemon with the search key ${search_param}`,
      );
    }

    return pokemon;
  }

  async update(search_param: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(search_param);

      const updatePokemonDtoModified = {
        ...updatePokemonDto,
        ...(updatePokemonDto.name && {
          name: updatePokemonDto.name.toLocaleLowerCase(),
        }),
      };

      await pokemon.updateOne(updatePokemonDtoModified);

      return {
        ...pokemon.toJSON(),
        ...updatePokemonDtoModified,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(search_param: string) {
    const pokemon = await this.findOne(search_param);
    await pokemon.deleteOne();

    return { search_param };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(error.errorResponse.errmsg);
    }
    console.log(error);
    throw new Error('Error');
  }
}
