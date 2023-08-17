import {
    IsEmail,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @Length(3)
    @IsString()
    username?: string;

    @IsOptional()
    @Length(6)
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber('IR')
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}
