import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Estacion} from './estacion.model';

@model()
export class Ruta extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  @property({
    type: 'number',
    required: true,
  })
  tiempo_estimado: number;

  @belongsTo(() => Estacion, {name: 'origenFk'})
  origen: string;

  @belongsTo(() => Estacion, {name: 'destinoFk'})
  destino: string;

  constructor(data?: Partial<Ruta>) {
    super(data);
  }
}

export interface RutaRelations {
  // describe navigational properties here
}

export type RutaWithRelations = Ruta & RutaRelations;
