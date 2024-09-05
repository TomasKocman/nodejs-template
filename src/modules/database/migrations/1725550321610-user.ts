import { MigrationInterface, QueryRunner } from "typeorm";

export class User1725550321610 implements MigrationInterface {
    name = 'User1725550321610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "authId" text NOT NULL, "displayName" text, "email" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6" UNIQUE ("authId"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
