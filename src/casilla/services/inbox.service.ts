import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inbox, InboxDocument } from '../schemas/inbox.schema';

export class InboxService {
  static readonly ESTADO_APROBADO = 'APROBADO';
  static readonly ESTADO_PENDIENTE = 'PENDIENTE';

  constructor(
    @InjectModel(Inbox.name)
    private inboxDocumentModel: Model<InboxDocument>,
  ) {}

  async existeCasilleroConDoc(docType: string, docNumber: string){
    console.log('find casillero by:', docType, ' ', docNumber);
    const casilleroAprobado = await this.inboxDocumentModel.findOne(
      {
        doc_type: docType,
        doc: docNumber,
        $or: [{ status: InboxService.ESTADO_APROBADO }, { status: null }],
      },
      {
        _id: 0,
        doc_type: 1,
        doc: 1,
        status: 1,
      },
    );
    if (casilleroAprobado != null) {
      console.log('Ya existe el casillero aprobado/registrado con documento', casilleroAprobado);
      return {
        exist: true,
        message:
          'Usted ya cuenta con Casilla electrónica ingrese aquí https://casillaelectronica.onpe.gob.pe/#/login y haga clic en "Olvidé mi contraseña"',
      };
    }
    const casillerosPendientes = await this.inboxDocumentModel
      .find(
        {
          doc_type: docType,
          doc: docNumber,
          status: InboxService.ESTADO_PENDIENTE,
        },
        {
          _id: 0,
          doc_type: 1,
          doc: 1,
          status: 1,
        },
      )
      .count();
    if (casillerosPendientes > 1) {
      console.log('Ya existe más de un casillero aprobado/registrado con documento', casilleroAprobado);
      return {
        exist: true,
        message: 'Usted ya cuenta con más de una solicitud de registro de casilla electrónica pendiente de aprobación',
      };
    }
    return {
      exist: false,
    };
  }

  async existeCasilleroConCorreo(correo: string): Promise<boolean> {
    console.log('find casillero by email:', correo);
    const user = await this.inboxDocumentModel.findOne(
      {
        email: correo,
        $or: [{ status: InboxService.ESTADO_APROBADO }, { status: InboxService.ESTADO_PENDIENTE }, { status: null }],
      },
      {
        _id: 0,
        doc_type: 1,
        doc: 1,
        status: 1,
        email: 1,
      },
    );
    if (!user) {
      return false;
    }
    console.log('Ya existe el casillero con correo:', user);
    return true;
  }
}
