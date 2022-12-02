import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Company, CompanyRelations, Products} from '../models';
import {ProductsRepository} from './products.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  public readonly products: HasManyRepositoryFactory<Products, typeof Company.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductsRepository') protected productsRepositoryGetter: Getter<ProductsRepository>,
  ) {
    super(Company, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productsRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
