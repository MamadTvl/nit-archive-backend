import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    private matchRoles(
        rolesNeeded: string[],
        userRoles: User['roles'],
    ): boolean {
        if (userRoles.length === 0) {
            return false;
        }
        for (const roleNeeded of rolesNeeded) {
            for (const role of userRoles.getItems()) {
                if (roleNeeded === role.name) {
                    return true;
                }
            }
        }
        return false;
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const handlerRoles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        );
        const classRoles = this.reflector.get<string[]>(
            'roles',
            context.getClass(),
        );
        const roles = [
            ...new Set([
                ...(Array.isArray(classRoles) ? classRoles : []),
                ...(Array.isArray(handlerRoles) ? handlerRoles : []),
            ]),
        ];
        if (roles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.matchRoles(roles, user.roles);
    }
}
