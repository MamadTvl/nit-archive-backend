import { Migration } from '@mikro-orm/migrations';

export class Migration20230803141749 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `media` add `width` int not null, add `height` int not null;',
        );
        this.addSql('alter table `media` drop index `media_media_type_index`;');
        this.addSql('alter table `media` drop `media_width`;');
        this.addSql('alter table `media` drop `media_height`;');
        this.addSql(
            "alter table `media` change `media_type` `type` enum('User', 'Course', 'Category') not null;",
        );
        this.addSql(
            'alter table `media` change `media_uri` `uri` varchar(255) not null;',
        );
        this.addSql(
            "alter table `media` change `media_collection` `collection` enum('featured', 'avatar', 'heading', 'cover') not null;",
        );
        this.addSql(
            'alter table `media` change `media_updated_at` `updated_at` datetime not null;',
        );
        this.addSql(
            'alter table `media` add index `media_type_index`(`type`);',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `media` add `media_width` int not null, add `media_height` int not null;',
        );
        this.addSql('alter table `media` drop index `media_type_index`;');
        this.addSql('alter table `media` drop `width`;');
        this.addSql('alter table `media` drop `height`;');
        this.addSql(
            "alter table `media` change `type` `media_type` enum('User', 'Course', 'Category') not null;",
        );
        this.addSql(
            'alter table `media` change `uri` `media_uri` varchar(255) not null;',
        );
        this.addSql(
            "alter table `media` change `collection` `media_collection` enum('featured', 'avatar', 'heading', 'cover') not null;",
        );
        this.addSql(
            'alter table `media` change `updated_at` `media_updated_at` datetime not null;',
        );
        this.addSql(
            'alter table `media` add index `media_media_type_index`(`media_type`);',
        );
    }
}
