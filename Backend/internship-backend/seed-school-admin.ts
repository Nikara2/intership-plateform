import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './src/users/user.entity';
import { UserRole } from './src/common/enums/user-role.enum';
import { typeOrmConfig } from './src/config/database.config';

async function seedSchoolAdmin() {
  const dataSource = new DataSource(typeOrmConfig as any);
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);

  const adminExists = await userRepo.findOne({
    where: { role: UserRole.SCHOOL_ADMIN },
  });

  if (!adminExists) {
    const admin = userRepo.create({
      email: 'admin@school.com',
      password: await bcrypt.hash('Admin123!', 10),
      role: UserRole.SCHOOL_ADMIN,
    });

    await userRepo.save(admin);
    console.log('✅ SCHOOL_ADMIN created');
  } else {
    console.log('ℹ️ SCHOOL_ADMIN already exists');
  }

  await dataSource.destroy();
}

seedSchoolAdmin();
