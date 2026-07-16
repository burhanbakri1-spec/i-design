import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password.' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(@Body() dto: LoginDto) {
    return {
      success: true,
      message: 'Login successful',
      data: await this.authService.login(dto),
    };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate a valid refresh token.' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: await this.authService.refresh(dto),
    };
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout and invalidate the active refresh token.' })
  async logout(@CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      message: 'Logout successful',
      data: await this.authService.logout(user),
    };
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the current authenticated profile.' })
  async profile(@CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: await this.authService.getProfile(user),
    };
  }

  @Patch('change-password')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Change password and invalidate previous sessions.' })
  async changePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChangePasswordDto) {
    return {
      success: true,
      message: 'Password changed successfully',
      data: await this.authService.changePassword(user, dto),
    };
  }
}
