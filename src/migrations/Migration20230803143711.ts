import { Migration } from '@mikro-orm/migrations';

export class Migration20230803143711 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table `roles` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `roles` add unique `roles_name_unique`(`name`);',
        );

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
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `roles_users` drop foreign key `roles_users_role_id_foreign`;',
        );

        this.addSql('drop table if exists `roles`;');

        this.addSql('drop table if exists `roles_users`;');
    }
}
