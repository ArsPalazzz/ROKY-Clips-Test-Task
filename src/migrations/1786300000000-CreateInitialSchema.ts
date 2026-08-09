import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1786300000000 implements MigrationInterface {
  name = 'CreateInitialSchema1786300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" SERIAL NOT NULL,
        "payment_id" character varying NOT NULL,
        "user_id" integer NOT NULL,
        "amount" integer NOT NULL,
        "status" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_payments_payment_id" UNIQUE ("payment_id"),
        CONSTRAINT "FK_payments_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_payments_user_id" ON "payments" ("user_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "status" character varying NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_subscriptions_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_subscriptions_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subscriptions_status_expires_at"
      ON "subscriptions" ("status", "expires_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
