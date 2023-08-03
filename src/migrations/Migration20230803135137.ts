import { Migration } from '@mikro-orm/migrations';

export class Migration20230803135137 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `courses` add constraint `courses_category_id_foreign` foreign key (`category_id`) references `categories` (`id`) on update cascade on delete set null;',
        );

        this.addSql(
            'alter table `courses_topics` add constraint `courses_topics_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `courses_topics` add constraint `courses_topics_topic_id_foreign` foreign key (`topic_id`) references `topics` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `media` add `mediable_id` int unsigned null, add `media_width` int not null, add `media_height` int not null;',
        );
        this.addSql(
            'alter table `media` drop index `media_model_type_category_id_index`;',
        );
        this.addSql(
            'alter table `media` drop index `media_model_type_course_id_index`;',
        );
        this.addSql(
            'alter table `media` drop index `media_model_type_type_index`;',
        );
        this.addSql(
            'alter table `media` drop index `media_model_type_user_id_index`;',
        );
        this.addSql(
            'alter table `media` add constraint `media_mediable_id_foreign` foreign key (`mediable_id`) references `categories` (`id`) on update cascade on delete set null;',
        );
        this.addSql('alter table `media` drop `model_type_course_id`;');
        this.addSql('alter table `media` drop `model_type_width`;');
        this.addSql('alter table `media` drop `model_type_height`;');
        this.addSql('alter table `media` drop `model_type_user_id`;');
        this.addSql('alter table `media` drop `model_type_category_id`;');
        this.addSql(
            "alter table `media` change `model_type_type` `media_type` enum('User', 'Course', 'Category') not null;",
        );
        this.addSql(
            'alter table `media` change `model_type_uri` `media_uri` varchar(255) not null;',
        );
        this.addSql(
            "alter table `media` change `model_type_collection` `media_collection` enum('featured', 'avatar', 'heading', 'cover') not null;",
        );
        this.addSql(
            'alter table `media` change `model_type_updated_at` `media_updated_at` datetime not null;',
        );
        this.addSql(
            'alter table `media` add index `media_mediable_id_index`(`mediable_id`);',
        );
        this.addSql(
            'alter table `media` add index `media_media_type_index`(`media_type`);',
        );

        this.addSql(
            'alter table `access_tokens` add constraint `access_tokens_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
        );

        this.addSql(
            'alter table `users_contributed_courses` add constraint `users_contributed_courses_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `users_contributed_courses` add constraint `users_contributed_courses_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `users_courses` add constraint `users_courses_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `users_courses` add constraint `users_courses_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `videos` add constraint `videos_topic_id_foreign` foreign key (`topic_id`) references `topics` (`id`) on update cascade;',
        );

        this.addSql(
            'alter table `ratings` add constraint `ratings_ratable_id_foreign` foreign key (`ratable_id`) references `courses` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `access_tokens` drop foreign key `access_tokens_user_id_foreign`;',
        );

        this.addSql(
            'alter table `courses` drop foreign key `courses_category_id_foreign`;',
        );

        this.addSql(
            'alter table `courses_topics` drop foreign key `courses_topics_course_id_foreign`;',
        );
        this.addSql(
            'alter table `courses_topics` drop foreign key `courses_topics_topic_id_foreign`;',
        );

        this.addSql(
            'alter table `media` drop foreign key `media_mediable_id_foreign`;',
        );

        this.addSql(
            'alter table `ratings` drop foreign key `ratings_ratable_id_foreign`;',
        );
        this.addSql(
            'alter table `ratings` drop foreign key `ratings_user_id_foreign`;',
        );

        this.addSql(
            'alter table `users_contributed_courses` drop foreign key `users_contributed_courses_user_id_foreign`;',
        );
        this.addSql(
            'alter table `users_contributed_courses` drop foreign key `users_contributed_courses_course_id_foreign`;',
        );

        this.addSql(
            'alter table `users_courses` drop foreign key `users_courses_user_id_foreign`;',
        );
        this.addSql(
            'alter table `users_courses` drop foreign key `users_courses_course_id_foreign`;',
        );

        this.addSql(
            'alter table `videos` drop foreign key `videos_topic_id_foreign`;',
        );

        this.addSql(
            'alter table `media` add `model_type_width` int not null, add `model_type_height` int not null, add `model_type_user_id` int unsigned null, add `model_type_category_id` int unsigned null;',
        );
        this.addSql(
            'alter table `media` drop index `media_mediable_id_index`;',
        );
        this.addSql('alter table `media` drop index `media_media_type_index`;');
        this.addSql('alter table `media` drop `media_width`;');
        this.addSql('alter table `media` drop `media_height`;');
        this.addSql(
            'alter table `media` change `mediable_id` `model_type_course_id` int unsigned null;',
        );
        this.addSql(
            "alter table `media` change `media_type` `model_type_type` enum('User','Course','Category') not null;",
        );
        this.addSql(
            'alter table `media` change `media_uri` `model_type_uri` varchar(255) not null;',
        );
        this.addSql(
            "alter table `media` change `media_collection` `model_type_collection` enum('featured','avatar','heading','cover') not null;",
        );
        this.addSql(
            'alter table `media` change `media_updated_at` `model_type_updated_at` datetime not null;',
        );
        this.addSql(
            'alter table `media` add index `media_model_type_category_id_index`(`model_type_category_id`);',
        );
        this.addSql(
            'alter table `media` add index `media_model_type_course_id_index`(`model_type_course_id`);',
        );
        this.addSql(
            'alter table `media` add index `media_model_type_type_index`(`model_type_type`);',
        );
        this.addSql(
            'alter table `media` add index `media_model_type_user_id_index`(`model_type_user_id`);',
        );
    }
}
