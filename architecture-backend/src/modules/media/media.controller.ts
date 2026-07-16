import { BadRequestException, Body, Controller, Delete, Param, Patch, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { CreateProjectMediaDto } from './dto/create-project-media.dto';
import { ReorderProjectMediaDto } from './dto/reorder-project-media.dto';
import { SetProjectCoverDto } from './dto/set-project-cover.dto';
import { UpdateProjectMediaDto } from './dto/update-project-media.dto';
import { MediaService } from './media.service';

@ApiTags('Admin Project Media')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService,
  ) {}

  @Post('projects/:projectId/media')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, caption: { type: 'string' }, altText: { type: 'string' }, isCover: { type: 'boolean' } } } })
  @ApiOperation({ summary: 'Upload one project image.' })
  async uploadOne(
    @Param('projectId', CuidValidationPipe) projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProjectMediaDto,
  ) {
    return { success: true, message: 'Project media uploaded successfully', data: await this.mediaService.uploadOne(projectId, file, dto) };
  }

  @Post('projects/:projectId/media/bulk')
  @UseInterceptors(FilesInterceptor('files', 20, { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } }, caption: { type: 'string' }, altText: { type: 'string' }, isCover: { type: 'boolean' } } } })
  async uploadBulk(
    @Param('projectId', CuidValidationPipe) projectId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateProjectMediaDto,
  ) {
    const maxFiles = this.configService.get<number>('UPLOAD_MAX_FILES') || 20;
    if (files.length > maxFiles) {
      throw new BadRequestException(`You can upload up to ${maxFiles} files`);
    }
    return { success: true, message: 'Project media uploaded successfully', data: await this.mediaService.uploadBulk(projectId, files, dto) };
  }

  @Patch('media/:id')
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateProjectMediaDto) {
    return { success: true, message: 'Project media updated successfully', data: await this.mediaService.update(id, dto) };
  }

  @Patch('projects/:projectId/media/reorder')
  async reorder(@Param('projectId', CuidValidationPipe) projectId: string, @Body() dto: ReorderProjectMediaDto) {
    return { success: true, message: 'Project media reordered successfully', data: await this.mediaService.reorder(projectId, dto) };
  }

  @Patch('projects/:projectId/media/:mediaId/cover')
  async setCover(@Param('projectId', CuidValidationPipe) projectId: string, @Param('mediaId', CuidValidationPipe) mediaId: string) {
    return { success: true, message: 'Project cover updated successfully', data: await this.mediaService.setCover(projectId, mediaId) };
  }

  @Patch('projects/:projectId/media/cover')
  async setCoverBody(@Param('projectId', CuidValidationPipe) projectId: string, @Body() dto: SetProjectCoverDto) {
    return { success: true, message: 'Project cover updated successfully', data: await this.mediaService.setCover(projectId, dto.mediaId) };
  }

  @Delete('media/:id')
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Project media deleted successfully', data: await this.mediaService.remove(id) };
  }
}
