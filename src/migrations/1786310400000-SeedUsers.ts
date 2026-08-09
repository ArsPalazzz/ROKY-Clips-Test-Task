import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1786310400000 implements MigrationInterface {
  name = 'SeedUsers1786310400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (email)
      VALUES ('user1@example.com'), ('user2@example.com')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users
      WHERE email IN ('user1@example.com', 'user2@example.com')
    `);
  }
}
