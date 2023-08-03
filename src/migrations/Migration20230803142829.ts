import { Migration } from '@mikro-orm/migrations';

export class Migration20230803142829 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `media` drop foreign key `media_mediable_id_foreign`;',
        );

        this.addSql(
            'alter table `media` add `user_id` int unsigned null, add `category_id` int unsigned null;',
        );
        this.addSql(
            'alter table `media` drop index `media_mediable_id_index`;',
        );
        this.addSql(
            'alter table `media` add constraint `media_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `media` add constraint `media_category_id_foreign` foreign key (`category_id`) references `categories` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `media` change `mediable_id` `course_id` int unsigned null;',
        );
        this.addSql(
            'alter table `media` add constraint `media_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `media` add index `media_course_id_index`(`course_id`);',
        );
        this.addSql(
            'alter table `media` add index `media_user_id_index`(`user_id`);',
        );
        this.addSql(
            'alter table `media` add index `media_category_id_index`(`category_id`);',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `media` drop foreign key `media_course_id_foreign`;',
        );
        this.addSql(
            'alter table `media` drop foreign key `media_user_id_foreign`;',
        );
        this.addSql(
            'alter table `media` drop foreign key `media_category_id_foreign`;',
        );

        this.addSql('alter table `media` add `mediable_id` int unsigned null;');
        this.addSql('alter table `media` drop index `media_course_id_index`;');
        this.addSql('alter table `media` drop index `media_user_id_index`;');
        this.addSql(
            'alter table `media` drop index `media_category_id_index`;',
        );
        this.addSql(
            'alter table `media` add constraint `media_mediable_id_foreign` foreign key (`mediable_id`) references `categories` (`id`) on update cascade on delete set null;',
        );
        this.addSql('alter table `media` drop `course_id`;');
        this.addSql('alter table `media` drop `user_id`;');
        this.addSql('alter table `media` drop `category_id`;');
        this.addSql(
            'alter table `media` add index `media_mediable_id_index`(`mediable_id`);',
        );
    }
}
