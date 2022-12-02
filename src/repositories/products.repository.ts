import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {MongoDataSource} from '../datasources';
import {Category, Products, ProductsRelations} from '../models';
import {CategoryRepository} from './category.repository';

export class ProductsRepository extends SoftCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductsRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Products.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Products, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
