import 'dotenv/config';
import { ClientEntity, PropertyEntity, TransactionEntity, ContractEntity } from './entities';

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    console.log('Seeding clients...');
    await ClientEntity.ensureSeed();
    console.log('✓ Clients seeded');

    console.log('Seeding properties...');
    await PropertyEntity.ensureSeed();
    console.log('✓ Properties seeded');

    console.log('Seeding transactions...');
    await TransactionEntity.ensureSeed();
    console.log('✓ Transactions seeded');

    console.log('Seeding contracts...');
    await ContractEntity.ensureSeed();
    console.log('✓ Contracts seeded');

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
