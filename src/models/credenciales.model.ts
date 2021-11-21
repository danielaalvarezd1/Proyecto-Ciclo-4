import {Model, model, property} from '@loopback/repository';

@model()
export class Credenciales extends Model {
  @property({
    type: 'string',
  })
  usuario?: string;

  @property({
    type: 'string',
  })
  password?: string;


  constructor(data?: Partial<Credenciales>) {
    super(data);
  }
}

export interface CredencialesRelations {
  // describe navigational properties here
}

export type CredencialesWithRelations = Credenciales & CredencialesRelations;
