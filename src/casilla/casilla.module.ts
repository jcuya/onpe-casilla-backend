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
import { CiudadanoService } from './services/ciudadano.service';
import { PersonaNaturalController } from './controllers/personaNatural.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Inbox, InboxSchema } from './schemas/inbox.schema';
import { UserInbox, UserInboxSchema } from './schemas/user_inbox.schema';
import { Utils } from './utils/util';
import { CasillaController } from './controllers/casilla.controller';
import { Representante, RepresentanteSchema } from './schemas/representante.schema';
import { UserService } from "./services/user.service";
import { EmailService } from "./services/email.service";
import { InboxService } from './services/inbox.service';
import { MpveService } from './services/mpve.service';
import { CaptchaService } from "./services/captcha.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_WEB_USERNAME}:${process.env.MONGODB_WEB_PASSWORD}@${process.env.MONGODB_WEB_HOST}:${process.env.MONGODB_WEB_PORT}`,
        {
          dbName:`${process.env.MONGODB_WEB_DATABASE}`
        }
      
      ),
    MongooseModule.forFeature([
      { name: Ubigeo.name, schema: UbigeoSchema },
      { name: CodigoVerificacion.name, schema: CodigoVerificacionSchema },
      { name: Juridica.name, schema: JuridicaSchema },
      { name: Ciudadano.name, schema: CiudadanoSchema },
      { name: User.name, schema: UserSchema },
      { name: Inbox.name, schema: InboxSchema },
      { name: UserInbox.name, schema: UserInboxSchema },
      { name: Representante.name, schema: RepresentanteSchema }
      
    ])
  ],
  controllers: [
    IndexController,
    UbigeosController,
    ValidacionCorreoController,
    PersonaNaturalController,
    CasillaController,
  ],
  providers: [
    CasillaService,
    UbigeosService,
    CodigoVerificacionService,
    CiudadanoService,
    UserService,
    EmailService,
    InboxService,
    MpveService,
    CaptchaService,
  ],
})
export class CasillaModule {}
