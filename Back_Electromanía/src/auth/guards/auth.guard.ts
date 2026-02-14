import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Configuration from '../../config/Configuration';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext):Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException("Debe Iniciar Sesion");
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: Configuration().jwtConstants.secret
            });
            request['user'] = payload.user;
            return true;
        } catch (error) {
            throw new UnauthorizedException("Token Invalido");
        }
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const token = request.cookies?.access_token || "";
        return token;
      }
}