import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Configuration from 'src/config/Configuration';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext):Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }try{
            console.log(Configuration().jwtConstants.secret);
            const payload = await this.jwtService.verifyAsync(token, {
                secret: Configuration().jwtConstants.secret
            })
        }catch{
            throw new UnauthorizedException();
        }
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
}