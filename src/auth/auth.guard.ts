// import {
//     Injectable,
//     CanActivate,
//     ExecutionContext,
//     UnauthorizedException,
//   } from '@nestjs/common';
//   import { AuthService } from './auth.service';
  
//   @Injectable()
//   export class AuthGuard implements CanActivate {
//     constructor(private readonly authService: AuthService) {}
  
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const request = context.switchToHttp().getRequest();
//       const token = request.headers['authorization'];
  
//       if (!token) {
//         throw new UnauthorizedException('No token provided');
//       }
  
//       try {
//         const payload = await this.authService.verifyToken(token);
//         request.user = payload; // Pass user payload to the request object
//         return true;
//       } catch (error) {
//         throw new UnauthorizedException('Invalid token');
//       }
//     }
//   }