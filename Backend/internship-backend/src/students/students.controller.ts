import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import type { File as MulterFile } from 'multer';
import type { Response } from 'express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // Création du profil par l'étudiant connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post()
  async create(@Req() req, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto, req.user.id);
  }

  // Profil du student connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('me')
  async getMyProfile(@Req() req) {
    return this.studentsService.findByUserId(req.user.id);
  }

  // Mise à jour du profil du student connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Patch('me')
  async updateMyProfile(@Req() req, @Body() dto: UpdateStudentDto) {
    return this.studentsService.updateByUserId(req.user.id, dto);
  }

  // ✅ Ajouter une compétence au profil connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post('me/skills')
  async addSkill(@Req() req, @Body() dto: AddSkillDto) {
    return this.studentsService.addSkill(req.user.id, dto.skill);
  }

  // ✅ Supprimer une compétence du profil connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Delete('me/skills/:skill')
  async removeSkill(@Req() req, @Param('skill') skill: string) {
    return this.studentsService.removeSkill(req.user.id, decodeURIComponent(skill));
  }

  // ✅ Upload CV pour le profil connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post('me/cv')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: './cvs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return cb(new Error('Seuls les fichiers PDF/DOC/DOCX sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadMyCv(@Req() req, @UploadedFile() file: MulterFile) {
    if (!file) throw new Error('CV file is required');

    // Delete old CV if exists
    const student = await this.studentsService.findByUserId(req.user.id);
    if (student.cv_url && existsSync(student.cv_url)) {
      unlinkSync(student.cv_url);
    }

    return this.studentsService.updateCvByUserId(req.user.id, file.path);
  }

  // ✅ Télécharger le CV du profil connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('me/cv')
  async downloadMyCv(@Req() req, @Res() res: Response) {
    const student = await this.studentsService.findByUserId(req.user.id);

    if (!student.cv_url) {
      throw new NotFoundException('Aucun CV trouvé');
    }

    if (!existsSync(student.cv_url)) {
      throw new NotFoundException('Fichier CV introuvable');
    }

    const file = createReadStream(student.cv_url);
    const filename = student.cv_url.split('/').pop() || 'cv.pdf';

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    file.pipe(res);
  }

  // ✅ Supprimer le CV du profil connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Delete('me/cv')
  async deleteMyCv(@Req() req) {
    const student = await this.studentsService.findByUserId(req.user.id);

    if (student.cv_url && existsSync(student.cv_url)) {
      unlinkSync(student.cv_url);
    }

    return this.studentsService.deleteCvByUserId(req.user.id);
  }

  // Liste de tous les profils (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Get()
  async findAll() {
    return this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.studentsService.findById(id);
  }

  // Get detailed student information (for admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Get(':id/details')
  async findDetailedById(@Param('id') id: string) {
    return this.studentsService.findDetailedById(id);
  }

  // Upload d’un CV pour le profil étudiant
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post(':id/upload-cv')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: './cvs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return cb(new Error('Seuls les fichiers PDF/DOC/DOCX sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadCv(@Param('id') id: string, @UploadedFile() file: MulterFile) {
    if (!file) throw new Error('CV file is required');
    return this.studentsService.updateCv(id, file.path);
  }

  // Suppression (admin uniquement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(id);
    return { message: 'Student deleted successfully' };
  }

  // Mise à jour d’un profil étudiant par ID (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }
}
