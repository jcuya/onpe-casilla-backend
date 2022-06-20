import { Body, Controller, Post } from '@nestjs/common';
import { CasillaService } from '../../casilla.service';
import { ResponseValidateData } from '../dto/ObtenerDatosPersonaDniResultDto';

@Controller()
export class CasillaController {
  constructor(private readonly casillaService: CasillaService) {
  }


  

  @Post('create-box')
  async createBox(@Body() dto: any): Promise<ResponseValidateData> {

    return await this.casillaService.createBox(dto);
  }


}
