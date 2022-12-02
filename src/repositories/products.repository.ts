import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {MongoDataSource} from '../datasources';
import {Category, Products, ProductsRelations, Company} from '../models';
import {CategoryRepository} from './category.repository';
import {CompanyRepository} from './company.repository';

export class ProductsRepository extends SoftCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductsRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Products.prototype.id>;

  public readonly company: BelongsToAccessor<Company, typeof Products.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('CompanyRepository') protected companyRepositoryGetter: Getter<CompanyRepository>,
  ) {
    super(Products, dataSource);
    this.company = this.createBelongsToAccessorFor('company', companyRepositoryGetter,);
    this.registerInclusionResolver('company', this.company.inclusionResolver);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
