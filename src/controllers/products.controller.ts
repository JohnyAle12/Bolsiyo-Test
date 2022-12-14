import {authenticate} from '@loopback/authentication';
import {
  Filter, repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, requestBody,
  response
} from '@loopback/rest';
import {Products, ProductsRelations} from '../models';
import {ProductsRepository} from '../repositories';

@authenticate('jwt')
export class ProductsController {
  constructor(
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository,
  ) { }

  @post('/products')
  @response(200, {
    description: 'Products model instance',
    content: {'application/json': {schema: getModelSchemaRef(Products)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {
            title: 'NewProducts',
            exclude: ['id'],
          }),
        },
      },
    })
    products: Omit<Products, 'id'>,
  ): Promise<Products> {
    return this.productsRepository.create(products);
  }

  @patch('/products/{id}')
  @response(204, {
    description: 'Products PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    products: Products,
  ): Promise<void> {
    await this.productsRepository.updateById(id, products);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Products DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productsRepository.deleteById(id);
  }

  @get('/products/company/{companyId}')
  @response(200, {
    description: 'Products from a specific company',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Products, {includeRelations: true}),
      },
    },
  })
  async findByCompanyId(
    @param.path.string('companyId') companyId: string,
    @param.query.number('page') page?: number,
    @param.query.number('pageSize') pageSize?: number,
    @param.filter(Products) filter?: Filter<Products>,
  ): Promise<(Products & ProductsRelations)[]> {
    const limit = pageSize || 10;
    const query = {
      ...filter,
      where: {companyId},
      include: [
        {
          relation: 'category',
          scope: {
            where: {isActive: true},
          },
        },
      ],
      limit,
      skip: (page || 0) * limit
    };

    return this.productsRepository.findAll(query);
  }

  @get('/products-company')
  @response(200, {
    description: 'Array of Products with its company',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Products, {includeRelations: true})
      },
    },
  })
  async find(
    @param.filter(Products) filter?: Filter<Products>,
  ): Promise<(Products & ProductsRelations)[]> {
    const query = {
      ...filter,
      include: [
        {
          relation: 'company',
        }
      ],
      limit: 30
    };
    return this.productsRepository.findAll(query);
  }
}
