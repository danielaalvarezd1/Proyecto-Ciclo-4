import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {service} from '@loopback/core';
import {AuthService} from '../services';
import axios from 'axios';
import {Credenciales} from '../models';
import { HttpErrors} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';


@authenticate("admin")
export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    @service(AuthService)
    public servicioAuth: AuthService
  ) { }

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    //return this.usuarioRepository.create(usuario);
     //Nuevo
    let clave = this.servicioAuth.GenerarClave();
    let claveCifrada = this.servicioAuth.CifrarClave(clave);
    usuario.password = claveCifrada;
    let p = await this.usuarioRepository.create(usuario);
    // Notificamos al usuario por correo
    let destino = usuario.correo;
    let asunto = 'Registro de usuario en plataforma';
    let contenido = `Hola, ${usuario.nombre} ${usuario.apellidos} su contraseña en el portal es: ${clave}`
    axios({
      method: 'post',
      url: 'http://localhost:5000/send_email',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        destino: destino,
        asunto: asunto,
        contenido: contenido
      }
    }).then((data: any) => {
      console.log(data)
    }).catch((err: any) => {
      console.log(err)
    })

   return p;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
  //Servicio de login
  @authenticate.skip()
  @post('/login', {
    responses: {
      '200': {
        description: 'Identificación de usuarios'
      }
    }
  })
  async login(
    @requestBody() credenciales: Credenciales
  ) {
    let p = await this.servicioAuth.IdentificarPersona(credenciales.usuario, credenciales.password);
    if (p) {
      let token = this.servicioAuth.GenerarTokenJWT(p);
 
      return {
        status: "success",
        data: {
          nombre: p.nombre,
          apellidos: p.apellidos,
          correo: p.correo,
          id: p.id
        },
        token: token
      }
    } else {
      throw new HttpErrors[401]("Datos invalidos")
    }
  }

}
