import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const requset = context.switchToHttp().getRequest()
        return requset.user
    }
}