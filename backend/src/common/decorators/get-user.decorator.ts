import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    console.log('USUARIO:', user);
    
    if (!data) return user;
    
    if (data === 'id' && user.userId) {
      return user.userId; 
    }
    
    return user[data];
  },
);