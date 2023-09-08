import { Migration } from '@mikro-orm/migrations';

export class Migration20230907231337 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `courses` modify `is_active` tinyint not null default true;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `courses` modify `is_active` tinyint not null default 1;');
  }

}
