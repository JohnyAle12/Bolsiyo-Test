import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Category, CategoryRelations, Products} from '../models';
import {ProductsRepository} from './products.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly products: HasManyRepositoryFactory<Products, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductsRepository') protected productsRepositoryGetter: Getter<ProductsRepository>,
  ) {
    super(Category, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productsRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
