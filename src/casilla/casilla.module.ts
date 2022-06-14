import { Module } from '@nestjs/common';
import { IndexController } from './controllers/index.controller';
import { CasillaService } from '../casilla.service';
import { UbigeosController } from './controllers/ubigeos.controller';
import { UbigeosService } from './services/ubigeos.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Ubigeo, UbigeoSchema } from './schemas/ubigeo.schema';
import {
  CodigoVerificacion,
  CodigoVerificacionSchema,
} from './schemas/codigoVerificacion.schema';
import { ValidacionCorreoController } from './controllers/validacionCorreo.controller';
import { CodigoVerificacionService } from './services/codigoVerificacion.service';
import { Juridica, JuridicaSchema } from './schemas/juridica.schema';
import { Ciudadano, CiudadanoSchema } from './schemas/ciudadano.schema';
import { CiudadaoService } from './services/ciudadao.service';
import { PersonaNaturalController } from './controllers/personaNatural.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
    ),
    MongooseModule.forFeature([
      { name: Ubigeo.name, schema: UbigeoSchema },
      { name: CodigoVerificacion.name, schema: CodigoVerificacionSchema },
      { name: Juridica.name, schema: JuridicaSchema },
      { name: Ciudadano.name, schema: CiudadanoSchema },
    ]),
  ],
  controllers: [
    IndexController,
    UbigeosController,
    ValidacionCorreoController,
    PersonaNaturalController,
  ],
  providers: [
    CasillaService,
    UbigeosService,
    CodigoVerificacionService,
    CiudadaoService,
  ],
})
export class CasillaModule {}
