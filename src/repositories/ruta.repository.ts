import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Ruta, RutaRelations, Estacion} from '../models';
import {EstacionRepository} from './estacion.repository';

export class RutaRepository extends DefaultCrudRepository<
  Ruta,
  typeof Ruta.prototype.id,
  RutaRelations
> {

  public readonly origenFk: BelongsToAccessor<Estacion, typeof Ruta.prototype.id>;

  public readonly destinoFk: BelongsToAccessor<Estacion, typeof Ruta.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('EstacionRepository') protected estacionRepositoryGetter: Getter<EstacionRepository>,
  ) {
    super(Ruta, dataSource);
    this.destinoFk = this.createBelongsToAccessorFor('destinoFk', estacionRepositoryGetter,);
    this.registerInclusionResolver('destinoFk', this.destinoFk.inclusionResolver);
    this.origenFk = this.createBelongsToAccessorFor('origenFk', estacionRepositoryGetter,);
    this.registerInclusionResolver('origenFk', this.origenFk.inclusionResolver);
  }
}
