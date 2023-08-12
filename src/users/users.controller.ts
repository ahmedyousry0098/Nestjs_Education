import { Controller, Post, Get, Body, HttpCode, Res, Request as Req, UseInterceptors, Patch, Query } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { LoginDto, RegisterDto, ForgetPasswordDto, UserResponse, ConfirmEmailDto, ResetPasswordDto } from './DTO/user.dto';
import { Response, Request } from 'express';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@UseInterceptors(new SerializeInterceptor(UserResponse))
@Controller('/')
export class UsersController {
    constructor(
        private _AuthenticationService: AuthenticationService
    ) {}
    
    @Post('/register')
    register(@Body() user: RegisterDto, @Req() request: Request, @Res() response: Response) {
        return this._AuthenticationService.register(user, request, response)
    }

    @Post('/login')
    login(@Body() user: LoginDto, @Req() request: Request, @Res() response: Response) {
        return this._AuthenticationService.login(user, request, response)
    }

    @Get('/confirm-email') 
    confirmEmail(@Query() token: ConfirmEmailDto, @Res() response: Response) {
        return this._AuthenticationService.confirmEmail(token, response)
    }

    @Patch('/forget-password')
    forgetPasswordCode(@Body() user: ForgetPasswordDto, @Req() request: Request,  @Res() response: Response) {
        return this._AuthenticationService.forgetPassword(user, request, response)
    } 

    @Patch('/reset-password')
    resetPassword(@Body() credintials: ResetPasswordDto, @Res() response: Response) {
        return this._AuthenticationService.resetPassword(credintials, response)
    }
}
