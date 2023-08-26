import {
    Controller,
    Post,
    Body,
    Patch,
    Delete,
    UseGuards,
    Req,
    HttpCode,
    Get,
    Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'common/guard/auth.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getUser(@Req() req: Request) {
        const user = req.user;
        delete user.accessTokens;
        return {
            message: 'Ok',
            user,
        };
    }

    @Get('course-access/:course_id')
    @UseGuards(AuthGuard)
    async checkUserOwnsCourse(
        @Req() req: Request,
        @Param('course_id') courseId: number,
    ) {
        const hasAccess = await this.userService.userOwns(
            courseId,
            req.user.id,
        );
        return {
            hasAccess,
        };
    }

    @Get('video-access/:video_id')
    @UseGuards(AuthGuard)
    async checkUserOwnsVideo(
        @Req() req: Request,
        @Param('video_id') videoId: number,
    ) {
        const hasAccess = await this.userService.userOwnsVideo(
            videoId,
            req.user.id,
        );
        return {
            hasAccess,
        };
    }

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

    @Patch()
    async update(@Body() data: UpdateUserDto, @Req() req: Request) {
        await this.userService.update(req.user.id, data);
        return {
            message: 'Ok',
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
