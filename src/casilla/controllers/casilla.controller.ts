import { Body, Controller, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CasillaService } from '../../casilla.service';
import { requestGlobal, ResponseValidateData } from '../dto/ObtenerDatosPersonaDniResultDto';
import { CiudadaoService } from '../services/ciudadao.service';

@Controller()
export class CasillaController {
  constructor(private readonly casillaService: CasillaService,private readonly ciudadaoService: CiudadaoService) {
  }


  

  @Post('create-box')
 // @UseInterceptors(FilesInterceptor('files'))
 @UseInterceptors(FileFieldsInterceptor([
    {name: 'files', maxCount: 1},
    {name: 'filerepresent', maxCount: 2}
    ]))
  async createBox(@Req() dto , @UploadedFiles()  files: {files? : any, filerepresent? : any} ): Promise<ResponseValidateData> {
    
    return await this.casillaService.createBox(dto);
  }


  @Post('validarRUC')
  async validarPersonaJuridica(
    @Body() ruc : string ): Promise<responseSunat> {
    return await this.ciudadaoService.validarDatosSUNAT(ruc);
  }


}
