import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Inbox, InboxDocument} from "../schemas/inbox.schema";

export class InboxService {
  static readonly ESTADO_APROBADO = 'APROBADO';

  constructor(
    @InjectModel(Inbox.name)
    private inboxDocumentModel: Model<InboxDocument>,
  ) {}

  async existeCasilleroConDoc(
    docType: string,
    docNumber: string,
  ): Promise<boolean> {
    console.log('find casillero by:', docType, ' ', docNumber);
    const casillero = await this.inboxDocumentModel.findOne(
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
    if (!casillero) {
      return false;
    }
    console.log('Ya existe el casillero con documento', casillero);
    return true;
  }

  async existeCasilleroConCorreo(
    correo: string,
  ): Promise<boolean> {
    console.log('find casillero by email:', correo);
    const user = await this.inboxDocumentModel.findOne(
      {
        email: correo,
        $or: [{ status: InboxService.ESTADO_APROBADO }, { status: null }],
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
