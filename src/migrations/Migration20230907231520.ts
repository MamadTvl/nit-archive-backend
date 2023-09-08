import { Migration } from '@mikro-orm/migrations';

export class Migration20230907231520 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `videos` modify `aparat_iframe` mediumtext;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `videos` modify `aparat_iframe` varchar(255);');
  }

}
