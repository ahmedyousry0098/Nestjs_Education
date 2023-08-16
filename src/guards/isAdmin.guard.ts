import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor() {}

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        return request.user?.isAdmin
    }
}