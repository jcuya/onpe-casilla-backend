import {
  Body,
  Controller,
  HttpException,
  HttpStatus, Ip,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CasillaService } from '../../casilla.service';
import { requestGlobal, ResponseValidateData } from '../dto/ObtenerDatosPersonaDniResultDto';
import { responseSunat } from '../dto/ObtenerDatosSUNAT';
import { CiudadanoService } from '../services/ciudadano.service';
import { MpveService } from '../services/mpve.service';
import { extname } from 'path';
import { CreateInboxRequest } from "../dto/CreateInboxRequest";

export const multerOptions = {
  limits: {
    fileSize: 3145728,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
    const validMimeTypes: validMimeType[] = [
      'image/png',
      'image/jpg',
      'image/jpeg',
    ];
    if (validMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
};

@Controller()
export class CasillaController {
  constructor(
    private readonly casillaService: CasillaService,
    private readonly mpveService: MpveService,
    private readonly ciudadaoService: CiudadanoService,
  ) {}

  @Post('create-box')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 1 },
        { name: 'filerepresent', maxCount: 2 },
      ], multerOptions),)
  async createBox(
    @Body() dto: CreateInboxRequest,
    @UploadedFiles() files: { files?: any; filerepresent?: any },
    @Ip() ipAddress,
  ): Promise<ResponseValidateData> {
    const result = await this.casillaService.createBox(dto, files, ipAddress);
    //const result2 = await this.mpveService.enviarDocMesaPartes(dto.tipoDocumento, dto.numeroDocumento);
    return result;
  }

  @Post('validarRUC')
  async validarPersonaJuridica(@Body() ruc: string): Promise<responseSunat> {
    return await this.ciudadaoService.validarDatosSUNAT(ruc);
  }
}
