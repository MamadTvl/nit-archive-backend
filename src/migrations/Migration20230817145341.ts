import { Migration } from '@mikro-orm/migrations';

export class Migration20230817145341 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `ratings` add unique `ratings_user_id_course_id_unique`(`user_id`, `course_id`);',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `ratings` drop index `ratings_user_id_course_id_unique`;',
        );
    }
}
