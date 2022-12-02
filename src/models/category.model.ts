import {Entity, hasMany, model, property} from '@loopback/repository';
import {Products, ProductsWithRelations} from './products.model';

@model()
export class Category extends Entity {
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
    jsonSchema: {
      minLength: 2
    }
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @hasMany(() => Products)
  products: Products[];


  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  products?: ProductsWithRelations;
}

export type CategoryWithRelations = Category & CategoryRelations;
