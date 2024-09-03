import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapaters/axios.adapter';
import { PokemonService } from '../pokemon/pokemon.service';
import { PokemonResponse } from './interfaces/pokemon-response.interface';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly httpAdapter: AxiosAdapter,
  ) {}

  async runSeed() {
    const { results } = await this.httpAdapter.get<PokemonResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemons = results.map(({ name, url }) => ({
      no: +url.split('/').reverse()[1],
      name,
    }));

    await this.pokemonService.createMany(pokemons, { ordered: false });

    return pokemons;
  }
}
