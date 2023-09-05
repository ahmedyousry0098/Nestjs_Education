import { 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Put,
    Body, 
    HttpCode, 
    Res, 
    Req, 
    UseInterceptors, 
    Query, 
    UseGuards,
    ExecutionContext,
    UnauthorizedException,
    Param
} from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { LoginDto, RegisterDto, ForgetPasswordDto, UserResponse, ConfirmEmailDto, ResetPasswordDto, UpdateProfileDto, UpdatePasswordDto, ChangeRoleDto } from './DTO/user.dto';
import { Response, Request } from 'express';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { AuthGuard } from 'src/guards/isAuth.guard';
import { ProfileService } from './services/profile.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './Schemas/user.model';
import { UsersService } from './services/users.service';
import { FindDTO } from 'src/utils/apiFeatures';
import { AdminGuard } from 'src/guards/isAdmin.guard';
import { ObjectIdPipe } from 'src/pipes/objectId.pipe';
import mongoose from 'mongoose';

@UseInterceptors(new SerializeInterceptor(UserResponse))
@Controller('/')
export class UsersController {
    constructor(
        private _AuthenticationService: AuthenticationService,
        private _ProfileService: ProfileService,
        private _UsersService: UsersService
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

    @Get('/me')
    whoIam(@CurrentUser() user: User) {
        if (!user) throw new UnauthorizedException('Please Login First')
        return user
    }

    @Get('/logout')
    logOut(@Req() request: Request, @Res() response: Response) {
        return this._AuthenticationService.logOut(request, response)
    }

    @UseGuards(AuthGuard)
    @Put('/:profileId/update-profile')
    updateProfile(
        @Req() request: Request, 
        @Res() response: Response, 
        @Body() body: UpdateProfileDto, 
        @Param('profileId', ObjectIdPipe) profileId: mongoose.Types.ObjectId,
        @CurrentUser() user: UserResponse
    ) {
        return this._ProfileService.updateProfile(request, response, body, profileId, user)
    }

    @UseGuards(AuthGuard)
    @Patch('/:profileId/update-password')
    updatePassword(
        @Res() response: Response,
        @Param('profileId', ObjectIdPipe) profileId: mongoose.Types.ObjectId,
        @Body() {newPassword, oldPassword}: UpdatePasswordDto,
        @CurrentUser() user: UserResponse
    ) {
        return this._ProfileService.changePassword(
            response, 
            profileId, 
            newPassword, 
            oldPassword, 
            user
        )
    }

    @UseGuards(AuthGuard)
    @Patch('/:profileId/delete-profile')
    deleteProfile(
        @Req() request: Request, 
        @Res() response: Response, 
        @Param('profileId', ObjectIdPipe) profileId: mongoose.Types.ObjectId,
        @CurrentUser() user: UserResponse
    ) {
        return this._ProfileService.deleteProfile(request, response, profileId, user)
    }

    @UseGuards(AdminGuard)
    @Patch('/make-admin/:userId')
    changeUserRole(@Param('userId', ObjectIdPipe) userId: mongoose.Types.ObjectId, @Query() query: ChangeRoleDto) {
        return this._ProfileService.changeUserRole(userId, query)
    }

    @Get('/user/:id')
    getUser (@Param('profileId', ObjectIdPipe) profileId: mongoose.Types.ObjectId,) {
        return this._UsersService.findUser(profileId)
    }

    @Get('/users')
    findAllUsers(queryData: FindDTO) {
        return this._UsersService.getAllUsers(queryData)
    }
}
