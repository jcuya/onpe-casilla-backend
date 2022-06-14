import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CasillaModule } from './casilla/casilla.module';

@Module({
  imports: [CasillaModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
