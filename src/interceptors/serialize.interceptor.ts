import {NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { map } from 'rxjs'

interface EntityDTO {
    new (...args: any[]): {}
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: EntityDTO) {}

    intercept(context: ExecutionContext, handler: CallHandler) {
        const body = context.switchToHttp().getRequest()
        
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
            })
        }))
    }
}