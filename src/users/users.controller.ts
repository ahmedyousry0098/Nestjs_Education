import { Controller, Post, Body, HttpCode, Res, UseInterceptors, Patch } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { LoginDto, RegisterDto, ForgetPasswordDto, UserResponse } from './DTO/user.dto';
import { Response } from 'express';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@UseInterceptors(new SerializeInterceptor(UserResponse))
@Controller('/')
export class UsersController {
    constructor(
        private _AuthenticationService: AuthenticationService
    ) {}
    
    @Post('/register')
    register(@Body() user: RegisterDto, @Res() response: Response) {
        return this._AuthenticationService.register(user, response)
    }

    @Post('/login')
    login(@Body() user: LoginDto, @Res() response: Response) {
        return this._AuthenticationService.login(user, response)
    }

    @Patch('/forgetpassword')
    forgetPasswordCode(@Body() user: ForgetPasswordDto, @Res() response: Response) {
        return this._AuthenticationService.forgetPassword(user, response)
    }
}
