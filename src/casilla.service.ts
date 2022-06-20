import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Inbox, InboxDocument } from "./casilla/schemas/inbox.schema";
import { User, UserDocument } from "./casilla/schemas/user.schema";
import { UserInbox, userInboxDocument } from "./casilla/schemas/user_inbox.schema";



export class CasillaService {

constructor( 
@InjectModel(User.name)
private userDocument: Model<UserDocument>,

@InjectModel(Inbox.name)
private inboxDocument: Model<InboxDocument>,

@InjectModel(UserInbox.name)
private userInboxDocument: Model<userInboxDocument>,

){

}

  saludar(nombre: string) {
    return 'hola ' + nombre;
  }


  async createBox(req){
    console.log("USEREEEER", req)


    try{
      var respuestaUsuario = await new this.userDocument({
        doc : req.numeroDocumento,
        doc_type :req.tipoDocumento,
        profile: "",
        password :"",
        name :req.nombres,
        lastname : req.apePaterno,
        second_lastname : req.apeMaterno,
        email : req.correoElectronico,
        cellphone : req.numeroCelular,
        phone : req.telefono,
        address : req.domicilioFisico,
        organization_name : "",
        register_user_id : "",
        created_at : null,
        updated_password : false,
        create_user : "JOSÉ CUYA"
      }).save();

      if(!respuestaUsuario) return {status :false , mensaje :'Error al guardar usuario'}


      var respuestaInbox = await new this.inboxDocument({
        doc : req.numeroDocumento,
        doc_type :req.tipoDocumento,
        email : req.correoElectronico,
        cellphone : req.numeroCelular,
        phone : req.telefono,
        address : req.domicilioFisico,
        acreditation_type : "",
        attachments : null,
        register_user_id : "",
        created_at : null,
        create_user : "JOSÉ CUYA"
      }).save();

      if(!respuestaInbox) return {status :false , mensaje :'Error al guardar casilla'}

      var respuestaUserInbox = await new this.userInboxDocument({
        doc : req.numeroDocumento,
        doc_type :req.tipoDocumento,
        profile: "owner",
        
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




}
