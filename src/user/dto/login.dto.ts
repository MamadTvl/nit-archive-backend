import { IsString, Length } from 'class-validator';

export class LoginDto {
    @Length(3)
    @IsString()
    username: string;

    @Length(6)
    @IsString()
    password: string;
}
