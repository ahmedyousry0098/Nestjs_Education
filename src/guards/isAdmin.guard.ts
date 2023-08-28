import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GENERALROLE } from 'src/users/enums/user.role'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor() {}

    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
        const request = context.switchToHttp().getRequest()
        return request.user?.role.toLowerCase() == GENERALROLE.ADMIN
    }
}