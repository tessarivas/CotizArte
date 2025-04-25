import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // Debug: Verifica qué contiene realmente el user
    console.log('USUARIO:', user);
    
    if (!data) return user;
    
    // Cambia esto para mapear 'userId' a 'id' si es necesario
    if (data === 'id' && user.userId) {
      return user.userId; // Devuelve userId como id
    }
    
    return user[data];
  },
);