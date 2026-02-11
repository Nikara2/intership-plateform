import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Company } from '../companies/company.entity';
import { Offer } from '../offers/offer.entity';
import { Application } from '../applications/application.entity';
import { Evaluation } from '../evaluations/evaluation.entity';
import { ApplicationStatus } from '../applications/dto/apply.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(Evaluation)
    private evaluationsRepository: Repository<Evaluation>,
  ) {}

  async getDashboardStats() {
    const [
      totalStudents,
      totalCompanies,
      activeOffers,
      ongoingInternships,
    ] = await Promise.all([
      this.studentsRepository.count(),
      this.companiesRepository.count(),
      this.offersRepository.count({ where: { status: 'OPEN' } }),
      this.applicationsRepository.count({
        where: { status: ApplicationStatus.COMPLETED },
      }),
    ]);

    // Calculate growth percentages (mock for now - would need historical data)
    const studentsGrowth = 12; // +12%
    const companiesGrowth = 5; // +5%

    return {
      totalStudents,
      totalCompanies,
      activeOffers,
      ongoingInternships,
      studentsGrowth,
      companiesGrowth,
    };
  }

  async getApplicationsByMonth(months: number = 6) {
    const result = await this.applicationsRepository
      .createQueryBuilder('application')
      .select("TO_CHAR(application.applied_at, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where(
        `application.applied_at >= NOW() - INTERVAL '${months} months'`,
      )
      .groupBy("TO_CHAR(application.applied_at, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    // Format the data for the frontend
    const monthNames = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUI', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentDate = new Date();
    const chartData: Array<{ month: string; count: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      const monthName = monthNames[date.getMonth()];

      const dataPoint = result.find(r => r.month === monthKey);
      chartData.push({
        month: monthName,
        count: dataPoint ? parseInt(dataPoint.count) : 0,
      });
    }

    return chartData;
  }

  async getInternshipsBySector() {
    // Get applications with COMPLETED status and their related offers
    const applications = await this.applicationsRepository.find({
      where: { status: ApplicationStatus.COMPLETED },
      relations: ['offer', 'offer.company'],
    });

    // Group by sector
    const sectorCounts: Record<string, number> = {};
    let total = 0;

    applications.forEach(app => {
      if (app.offer?.company?.sector) {
        const sector = app.offer.company.sector;
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
        total++;
      }
    });

    // Format the data
    const sectors = Object.entries(sectorCounts).map(([name, count]) => ({
      name: this.getSectorLabel(name),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    return {
      sectors,
      total,
    };
  }

  private getSectorLabel(sectorCode: string): string {
    const labels: Record<string, string> = {
      it: 'Technologie',
      finance: 'Finance',
      marketing: 'Marketing',
      health: 'Santé',
      energy: 'Énergie',
    };
    return labels[sectorCode] || sectorCode;
  }

  async getRecentActivities(limit: number = 10) {
    // Get recent applications
    const recentApplications = await this.applicationsRepository.find({
      relations: ['student', 'offer', 'offer.company'],
      order: { applied_at: 'DESC' },
      take: limit,
    });

    // Get recent evaluations
    const recentEvaluations = await this.evaluationsRepository.find({
      relations: ['application', 'application.student'],
      order: { evaluated_at: 'DESC' },
      take: limit,
    });

    // Combine and format activities
    const activities: Array<{
      date: Date;
      type: string;
      description: string;
      user: string;
      status?: string;
      score?: number;
    }> = [];

    recentApplications.forEach(app => {
      activities.push({
        date: app.applied_at,
        type: 'application',
        description: `Nouvelle candidature reçue : ${app.offer?.company?.name || 'Entreprise'}`,
        user: `${app.student?.first_name} ${app.student?.last_name?.charAt(0)}.`,
        status: app.status,
      });
    });

    recentEvaluations.forEach(evaluation => {
      activities.push({
        date: evaluation.evaluated_at,
        type: 'evaluation',
        description: `Évaluation soumise`,
        user: `${evaluation.application?.student?.first_name} ${evaluation.application?.student?.last_name?.charAt(0)}.`,
        score: evaluation.score,
      });
    });

    // Sort by date and limit
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return activities.slice(0, limit);
  }
}
