import { Migration } from '@mikro-orm/migrations';

export class Migration20230803143807 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table `users_roles` (`user_id` int unsigned not null, `role_id` int unsigned not null, primary key (`user_id`, `role_id`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `users_roles` add index `users_roles_user_id_index`(`user_id`);',
        );
        this.addSql(
            'alter table `users_roles` add index `users_roles_role_id_index`(`role_id`);',
        );

        this.addSql(
            'alter table `users_roles` add constraint `users_roles_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `users_roles` add constraint `users_roles_role_id_foreign` foreign key (`role_id`) references `roles` (`id`) on update cascade on delete cascade;',
        );

        this.addSql('drop table if exists `roles_users`;');
    }

    async down(): Promise<void> {
        this.addSql(
            'create table `roles_users` (`role_id` int unsigned not null, `user_id` int unsigned not null, primary key (`role_id`, `user_id`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `roles_users` add index `roles_users_role_id_index`(`role_id`);',
        );
        this.addSql(
            'alter table `roles_users` add index `roles_users_user_id_index`(`user_id`);',
        );

        this.addSql(
            'alter table `roles_users` add constraint `roles_users_role_id_foreign` foreign key (`role_id`) references `roles` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `roles_users` add constraint `roles_users_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete cascade;',
        );

        this.addSql('drop table if exists `users_roles`;');
    }
}
