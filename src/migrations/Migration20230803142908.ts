import { Migration } from '@mikro-orm/migrations';

export class Migration20230803142908 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `ratings` drop foreign key `ratings_ratable_id_foreign`;',
        );

        this.addSql('alter table `ratings` add `course_id` int unsigned null;');
        this.addSql(
            'alter table `ratings` drop index `ratings_ratable_id_index`;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `ratings` change `ratable_id` `video_id` int unsigned null;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_video_id_foreign` foreign key (`video_id`) references `videos` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `ratings` add index `ratings_video_id_index`(`video_id`);',
        );
        this.addSql(
            'alter table `ratings` add index `ratings_course_id_index`(`course_id`);',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `ratings` drop foreign key `ratings_video_id_foreign`;',
        );
        this.addSql(
            'alter table `ratings` drop foreign key `ratings_course_id_foreign`;',
        );

        this.addSql(
            'alter table `ratings` add `ratable_id` int unsigned null;',
        );
        this.addSql(
            'alter table `ratings` drop index `ratings_video_id_index`;',
        );
        this.addSql(
            'alter table `ratings` drop index `ratings_course_id_index`;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_ratable_id_foreign` foreign key (`ratable_id`) references `courses` (`id`) on update cascade on delete set null;',
        );
        this.addSql('alter table `ratings` drop `video_id`;');
        this.addSql('alter table `ratings` drop `course_id`;');
        this.addSql(
            'alter table `ratings` add index `ratings_ratable_id_index`(`ratable_id`);',
        );
    }
}
