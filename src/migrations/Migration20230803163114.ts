import { Migration } from '@mikro-orm/migrations';

export class Migration20230803163114 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `ratings` drop foreign key `ratings_video_id_foreign`;',
        );
        this.addSql(
            'alter table `ratings` drop foreign key `ratings_course_id_foreign`;',
        );

        this.addSql(
            'alter table `ratings` modify `course_id` int unsigned not null;',
        );
        this.addSql(
            'alter table `ratings` drop index `ratings_video_id_index`;',
        );
        this.addSql(
            'alter table `ratings` drop index `ratings_model_type_index`;',
        );
        this.addSql('alter table `ratings` drop `video_id`;');
        this.addSql('alter table `ratings` drop `model_type`;');
        this.addSql(
            'alter table `ratings` change `model_rating` `rating` int unsigned not null;',
        );
        this.addSql(
            'alter table `ratings` change `model_description` `description` varchar(255) null;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `ratings` drop foreign key `ratings_course_id_foreign`;',
        );

        this.addSql(
            "alter table `ratings` add `video_id` int unsigned null, add `model_type` enum('Course', 'Video') not null;",
        );
        this.addSql(
            'alter table `ratings` modify `course_id` int unsigned null;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_video_id_foreign` foreign key (`video_id`) references `videos` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `ratings` change `rating` `model_rating` int unsigned not null;',
        );
        this.addSql(
            'alter table `ratings` change `description` `model_description` varchar(255) null;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `ratings` add index `ratings_video_id_index`(`video_id`);',
        );
        this.addSql(
            'alter table `ratings` add index `ratings_model_type_index`(`model_type`);',
        );
    }
}
