import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'common/guard/auth.guard';
import { Request } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('sign-up')
    async register(@Body() data: LoginDto) {
        const token = await this.userService.singUp(data);
        return {
            token,
        };
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() data: LoginDto) {
        const token = await this.userService.login(data);
        return {
            token,
        };
    }

    @Delete('logout')
    @UseGuards(AuthGuard)
    async logout(@Req() req: Request) {
        await this.userService.logout(req.user.id);
        return {
            message: 'Ok',
        };
    }
}
