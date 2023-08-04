import { Migration } from '@mikro-orm/migrations';

export class Migration20230804175817 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `courses` drop foreign key `courses_status_id_foreign`;',
        );

        this.addSql(
            'alter table `courses` modify `status_id` int unsigned null;',
        );
        this.addSql(
            'alter table `courses` add constraint `courses_status_id_foreign` foreign key (`status_id`) references `course_statuses` (`id`) on update cascade on delete set null;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `courses` drop foreign key `courses_status_id_foreign`;',
        );

        this.addSql(
            'alter table `courses` modify `status_id` int unsigned not null;',
        );
        this.addSql(
            'alter table `courses` add constraint `courses_status_id_foreign` foreign key (`status_id`) references `course_statuses` (`id`) on update cascade;',
        );
    }
}
