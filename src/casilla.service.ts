import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Inbox, InboxDocument } from "./casilla/schemas/inbox.schema";
import { User, UserDocument } from "./casilla/schemas/user.schema";
import { UserInbox, userInboxDocument } from "./casilla/schemas/user_inbox.schema";
import * as fs from 'fs';
import * as cryptoJS from 'crypto';
import sha256 from 'crypto-js/sha256';
import { Representante, RepresentanteDocument } from "./casilla/schemas/representante.schema";
import { CaptchaService } from "./casilla/services/captcha.service";

export class CasillaService {

static readonly DEFAULT_STATUS = 'PENDIENTE';

  constructor(
    @InjectModel(User.name)
    private userDocument: Model<UserDocument>,
    @InjectModel(Inbox.name)
    private inboxDocument: Model<InboxDocument>,
    @InjectModel(UserInbox.name)
    private userInboxDocument: Model<userInboxDocument>,
    @InjectModel(Representante.name)
    private representanteDocument: Model<RepresentanteDocument>,
    private captchaService: CaptchaService,
  ) {}

  saludar(nombre: string) {
    return 'hola ' + nombre;
  }

  async createBox(body, files, ipAddress) {
    console.log("create box request: ", body);
    let data = body;
    let Filesupload = files;

    let FileDni = Filesupload.files[0];

    //await this.captchaService.validarCapcha(body.recaptcha, ipAddress);

    if (!this.validFile(FileDni)) {
        return {status :false , mensaje :'Archivo imagen de DNI está dañado o no es válido'};
    }

    try{
      const pass = cryptoJS.randomBytes(5).toString('hex');
      data.tipoDocumento = data.tipoDocumento.toLowerCase();
      data.tipoPersona = data.tipoPersona.toLowerCase();
      data.apePaterno = typeof data.apePaterno !== 'undefined' ? data.apePaterno : '';
      data.apeMaterno = typeof data.apeMaterno !== 'undefined' ? data.apeMaterno : '';

      if (data.apePaterno == '' && data.apeMaterno == '') {
        return { status: false, mensaje: 'Ingrese por lo menos un apellido' };
      }

      var respuestaUsuario = await new this.userDocument({
        doc : data.numeroDocumento,
        doc_type :data.tipoDocumento,
        profile: "citizen",
        password :pass,
        name : data.tipoPersona === 'j'  ? data.razonSocial : data.nombres ,
        lastname : data.apePaterno,
        second_lastname : data.apeMaterno,
        email : data.correoElectronico,
        cellphone : data.numeroCelular,
        phone : data.telefono,
        Ubigeo : data.ubigeo,
        address : data.domicilioFisico,
        PaginaWeb : data.paginaweb,
        organization_name : "",
        register_user_id : "",
        created_at : Date.now(),
        updated_password : false,
        create_user : "owner",
        status : CasillaService.DEFAULT_STATUS
      }).save();

      if(!respuestaUsuario) return {status :false , mensaje :'Error al guardar usuario'}

      if(data.tipoPersona === 'j'){
          let FileRepresent = Filesupload.filerepresent[0];
          var rep = JSON.parse(data.representante)
          var pdf = await this.copyFile(FileRepresent.buffer,'box/',FileRepresent.originalname,rep.numeroDocumento,Date.now(),false,false);
        
        var respuestaRepresentante = await new this.representanteDocument({
          tipoDocumentoAdjunto : rep.tipoDocumentoAdjunto,
          tipoDocumentoAdjuntoNombre : rep.tipoDocumentoAdjuntoNombre,
          tipoDocumento : rep.tipoDocumento,
          numeroDocumento : rep.numeroDocumento,
          rucUser : data.numeroDocumento,
          nombreCompleto : rep.nombreCompleto,
          correoElectronico : rep.correoElectronico,
          numeroCelular : rep.numeroCelular,
          domicilioFisico : rep.domicilioFisico,
          cargo : rep.cargo,
          Ubigeo: rep.ubigeo,
          cargoNombre: rep.cargoNombre,
          archivo : pdf,
          created_at : Date.now(),
        }).save();
  
        if(!respuestaRepresentante) return {status :false , mensaje :'Error al guardar usuario'}
  
      }

      var img = await this.copyFile(FileDni.buffer,'box/',FileDni.originalname,data.numeroDocumento,Date.now(),false,false);
      let id_usuario =  respuestaUsuario._id;
      var respuestaInbox = await new this.inboxDocument({
        doc : data.numeroDocumento,
        doc_type :data.tipoDocumento,
        email : data.correoElectronico,
        cellphone : data.numeroCelular,
        phone : data.telefono,
        address : data.domicilioFisico,
        acreditation_type : "",
        attachments : null,
        imageDNI : img,
        register_user_id : new mongoose.Types.ObjectId(id_usuario),
        created_at : Date.now(),
        create_user : "owner",
        status : CasillaService.DEFAULT_STATUS
      }).save();


      if(!respuestaInbox) return {status :false , mensaje :'Error al guardar casilla'}
       let id_inbox =  respuestaInbox._id;
      var respuestaUserInbox = await new this.userInboxDocument({
        doc : data.numeroDocumento,
        doc_type :data.tipoDocumento,
        profile: "owner",
        user_id : id_usuario,
        inbox_id : id_inbox
      }).save();

      if(!respuestaUserInbox) return {status :false , mensaje :'Error al guardar usuario-casilla'}

      return {
        status : true,
        mensaje : "success"
      }

    }
    catch(e){
      return {
        status : false,
        mensaje : e
      }
    }

    // let box = req.fields;
    // let files = req.files;
    // let countFiles = Object.keys(files).length;

    // if (this.utils.isEmpty(box.docType) ||
    // this.utils.isEmpty(box.doc) ||
    // this.utils.isEmpty(box.email) ||
    // this.utils.isEmpty(box.cellphone) ||
    // this.utils.isEmpty(box.address) ||
    // this.utils.isEmpty(box.acreditation_type)) {
    //     return res.sendStatus(400);
    // }

    // if (!this.utils.validNumeric(box.cellphone) || box.cellphone.length < 9) {
    //     return res.sendStatus(400);
    // }

    // let _files = [];
    // let attachments = [];
    // for (let i = 1; i <= countFiles; i++) {
    //     _files.push({ index: i });
    // }


    

    let isValid = true;
    let message = "";
    // for await (file of _files) {
    //     if(files['file' + file.index].size == 0 || files['file' + file.index].size > 1048576 * 3) {
    //         isValid = false;
    //         message+= ((message.length> 0) ? ", " : "") + `El Archivo ${file.index} con tamaño no válido`;
    //         break;
    //     }
    //     if(files['file' + file.index].type != "application/pdf") {
    //         isValid = false;
    //         message+= ((message.length> 0) ? ", " : "") + `El Archivo ${file.index} sólo en formato PDF`;
    //         break;
    //     }
    //     const signedPdfBuffer = fs.readFileSync(files['file' + file.index].path);
    //     let verified = (Buffer.isBuffer(signedPdfBuffer) && signedPdfBuffer.lastIndexOf("%PDF-") === 0 && signedPdfBuffer.lastIndexOf("%%EOF") > -1);
    //     if(!verified) {
    //         isValid = false;
    //         message+= ((message.length> 0) ? ", " : "") + `El Archivo ${file.index} está dañado o no es válido`;
    //     }
    // }

    //if(!isValid) return res.status(400).json({success: false, error: message});

    // let userExist = await userService.getUserCitizen(box.docType, box.doc);
    // let emailExist = await userService.getEmailCitizen2(box.email);

    // if (userExist.success) {
    //     return res.status(400).json({ success: false, error: errors.CREATE_BOX_EXIST_BOX_TO_CANDIDATE.message });
    // }
    // if (emailExist.success) {
    //     return res.status(400).json({ success: false, error: errors.CREATE_BOX_EXIST_BOX_TO_EMAIL.message });
    // }

    // for await (file of _files) {
    //     file.file = await utils.copyFile(
    //         files['file' + file.index].path,
    //         appConstants.PATH_BOX,
    //         files['file' + file.index].name,
    //         box.doc,
    //         Date.now(),
    //         false,
    //         false
    //     );
    //     attachments.push(file.file);
    // }
    // let usuarioRegistro = req.user.name + ' ' + req.user.lastname;
    // let result = await userService.createUserCitizen(box, req.user.id, attachments, usuarioRegistro);
    
    // if (!result.success) {
    //     return res.status(400).json({ success: false, error: result.error });
    // }
    //return res.json({ success: true });


  }

  validFile(file) {
      const signedFile = file.buffer;
      if (this.validatebyteFile(file.mimetype, signedFile)) {
          return true;
      }
    return false;
  }

    validatebyteFile(typeFile, signedFile) {
        switch (typeFile) {
            case 'application/pdf':
                return (Buffer.isBuffer(signedFile) && signedFile.lastIndexOf('%PDF-') === 0 && signedFile.lastIndexOf('%%EOF') > -1);
            case 'image/jpg':
            case 'image/jpeg':
                return (/^(ffd8ffe([0-9]|[a-f]){1}$)/g).test(signedFile.toString('hex').substring(0, 8));
            case 'image/png':
                return signedFile.toString('hex').startsWith('89504e47');
            case 'image/bmp':
            case 'image/x-ms-bmp':
                return signedFile.toString('hex').startsWith('424d');
            default:
                return false;
        }
    }

   stringHash (text)  {
    return cryptoJS.createHash('sha256').update(text).digest('hex');
}

   getPath (prePath) {
    let _date = new Date(Date.now());
    var retorno = prePath + _date.getFullYear() + '/' + (_date.getMonth() + 1) + '/' + _date.getDate() + '/';

    
    return retorno;
}

   async copyFile  (Buffer, newPath, filename, doc, timestamp, isTmp, isBlocked) {
    const path_upload = process.env.PATH_UPLOAD;
    const path_upload_tmp = process.env.PATH_UPLOAD_TMP;
    try {
        let rawData = Buffer//fs.readFileSync(oldPathFile);
        let pathAttachment = this.getPath(newPath);
        

        let stringHashNameFile = this.stringHash(cryptoJS.randomBytes(5).toString('hex')  + '_' + doc + '_' + timestamp + '_' + filename);

        let newPathFile = (isTmp ? path_upload_tmp : path_upload) + "/" + pathAttachment + stringHashNameFile;

        fs.mkdirSync((isTmp ? path_upload_tmp : path_upload) + "/" + pathAttachment, {recursive: true});

        fs.writeFileSync(newPathFile, rawData);

        return {path: pathAttachment + stringHashNameFile, name: filename, blocked: isBlocked};

    } catch (err) {
        console.log("ERROOOOOORR" , err)
        return false;
    }

}




}
