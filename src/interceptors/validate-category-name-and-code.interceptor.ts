import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CategoryRepository} from '../repositories/category.repository';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: ValidateCategoryNameAndCodeInterceptor.BINDING_KEY}})
export class ValidateCategoryNameAndCodeInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ValidateCategoryNameAndCodeInterceptor.name}`;

  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {

      if (invocationCtx.methodName === 'create') {
        console.log(invocationCtx.args);

        const {code, name} = invocationCtx.args[0];
        const alreadyExist = await this.categoryRepository.find({where: {or: [{name}, {code}]}});
        console.log(name, code, alreadyExist);

        if (alreadyExist.length) {
          throw new HttpErrors.UnprocessableEntity(
            'Name or Corde already exist',
          );
        }
      }

      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
