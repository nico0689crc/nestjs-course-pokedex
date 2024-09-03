import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapaters/axios.adapter';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
