import {UserRepository} from '@loopback/authentication-jwt';
import {
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: ValidateUserEmailInterceptor.BINDING_KEY}})
export class ValidateUserEmailInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ValidateUserEmailInterceptor.name}`;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
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
      if (invocationCtx.methodName === 'signUp') {
        const {email} = invocationCtx.args[0];
        const alreadyExist = await this.userRepository.find({where: {email}});

        if (alreadyExist.length) {
          throw new HttpErrors.UnprocessableEntity(
            'User email already exist',
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
