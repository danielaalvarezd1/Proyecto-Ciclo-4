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
import {Estacion} from '../models';
import {EstacionRepository} from '../repositories';

export class EstacionController {
  constructor(
    @repository(EstacionRepository)
    public estacionRepository : EstacionRepository,
  ) {}

  @post('/estacions')
  @response(200, {
    description: 'Estacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Estacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estacion, {
            title: 'NewEstacion',
            exclude: ['id'],
          }),
        },
      },
    })
    estacion: Omit<Estacion, 'id'>,
  ): Promise<Estacion> {
    return this.estacionRepository.create(estacion);
  }

  @get('/estacions/count')
  @response(200, {
    description: 'Estacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Estacion) where?: Where<Estacion>,
  ): Promise<Count> {
    return this.estacionRepository.count(where);
  }

  @get('/estacions')
  @response(200, {
    description: 'Array of Estacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Estacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Estacion) filter?: Filter<Estacion>,
  ): Promise<Estacion[]> {
    return this.estacionRepository.find(filter);
  }

  @patch('/estacions')
  @response(200, {
    description: 'Estacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estacion, {partial: true}),
        },
      },
    })
    estacion: Estacion,
    @param.where(Estacion) where?: Where<Estacion>,
  ): Promise<Count> {
    return this.estacionRepository.updateAll(estacion, where);
  }

  @get('/estacions/{id}')
  @response(200, {
    description: 'Estacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Estacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Estacion, {exclude: 'where'}) filter?: FilterExcludingWhere<Estacion>
  ): Promise<Estacion> {
    return this.estacionRepository.findById(id, filter);
  }

  @patch('/estacions/{id}')
  @response(204, {
    description: 'Estacion PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estacion, {partial: true}),
        },
      },
    })
    estacion: Estacion,
  ): Promise<void> {
    await this.estacionRepository.updateById(id, estacion);
  }

  @put('/estacions/{id}')
  @response(204, {
    description: 'Estacion PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() estacion: Estacion,
  ): Promise<void> {
    await this.estacionRepository.replaceById(id, estacion);
  }

  @del('/estacions/{id}')
  @response(204, {
    description: 'Estacion DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.estacionRepository.deleteById(id);
  }
}
