import {CanActivate, ExecutionContext} from '@nestjs/common'
import { Observable } from 'rxjs'
import { GENERALROLE } from 'src/users/enums/user.role'

export class isInstructor implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()        
        return request.user.role.toLowerCase() == GENERALROLE.INSTRUCTOR
    }
}