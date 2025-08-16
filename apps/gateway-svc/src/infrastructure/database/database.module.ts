import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nexus/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          migrationsRun: false,
          ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
          extra: {
            max: 10, // Maximum number of connections in the pool
            min: 2, // Minimum number of connections in the pool
            idleTimeoutMillis: 30000, // Close connections after 30 seconds of inactivity
            connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
