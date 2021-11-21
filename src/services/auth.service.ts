import {injectable, /* inject, */ BindingScope} from '@loopback/core';
// Nuevas librerias
import {config} from '../config/config';
import {Usuario} from '../models';
const jwt = require('jsonwebtoken');
import {UsuarioRepository} from '../repositories';
import {repository} from '@loopback/repository';
const generator = require("password-generator");
const cryptoJS = require("crypto-js");


@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(@repository(UsuarioRepository)
  public usuarioRepository: UsuarioRepository) {}

  /*
   * Add service methods here
   */
   //Generacion de claves
  GenerarClave() {
    let clave = generator(8, false);
    return clave;
  }
  CifrarClave(clave: String) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }
  //JWT
  GenerarTokenJWT(usuario: Usuario) {
    let token = jwt.sign({
      data: {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre + " " + usuario.apellidos
      }
    }, config.claveJWT)
 
    return token
  }
//Autenticacion
IdentificarPersona(correo: string, password: string) {
  try {
    let p = this.usuarioRepository.findOne({where: {correo: correo, password: password}})
    if (p) {
      return p;
    }
    return false;
  } catch {
    return false;
  }
}

validarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, config.claveJWT);
      return datos;
    } catch (error) {
      return false;
    }
  }

}
