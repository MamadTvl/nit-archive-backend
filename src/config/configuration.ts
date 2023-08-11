export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    mysql: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
        database: process.env.REDIS_DATABASE,
    },
    s3: {
        accessKeyId: process.env.S3_KEY_ID,
        secretAccessKey: process.env.S3_SECRET,
        endpoint: process.env.S3_ENDPOINT,
        bucketName: process.env.S3_BUCKET_NAME,
    },
});

export interface Config {
    port: number;
    mysql: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    redis: {
        host: string;
        port: number;
        password: string;
        database: string;
    };
    s3: {
        accessKeyId: string;
        secretAccessKey: string;
        endpoint: string;
        bucketName: string;
    };
}
