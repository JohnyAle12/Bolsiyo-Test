import {belongsTo, model, property} from '@loopback/repository';
import {SoftDeleteEntity} from 'loopback4-soft-delete';
import {Category, CategoryWithRelations} from './category.model';
import {Company} from './company.model';

@model()
export class Products extends SoftDeleteEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^[a-zA-z0-9]+$',
    }
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  brand: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;
  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @belongsTo(() => Company)
  companyId: string;

  @belongsTo(() => Category)
  categoryId: string;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
  category?: CategoryWithRelations;
}

export type ProductsWithRelations = Products & ProductsRelations;
