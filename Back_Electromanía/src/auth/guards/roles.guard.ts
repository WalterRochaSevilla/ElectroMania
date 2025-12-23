import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/enums/UserRole.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserJwtPayloadModel } from '../models/user-jwt-payload.model';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService
    ) {}
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    private tokenToUser(token: string): UserJwtPayloadModel {
        const payload = this.jwtService.decode(token)
        return payload.user as UserJwtPayloadModel
    }
    matchRoles(roles: UserRole[], user: UserJwtPayloadModel) {
        return roles.some(role=>{
            return user.role === role
        })
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredRoles) {
            return true;
        }
        const token = this.extractTokenFromHeader(context.switchToHttp().getRequest());
        const user = this.tokenToUser(token?? '');
        return this.matchRoles(requiredRoles, user);
    }
}
