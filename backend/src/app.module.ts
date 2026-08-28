import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Announcement,
  Leave,
  Workflow,
  ErpItem,
  ErpOrder,
  KnowledgeArticle,
  CompanyDocument,
  Employee
} from './entities';

// Determine Database settings dynamically
const dbType = process.env.DATABASE_URL || process.env.POSTGRES_HOST ? 'postgres' : 'sqlite';

const typeOrmConfig = dbType === 'postgres'
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'portal',
      entities: [Announcement, Leave, Workflow, ErpItem, ErpOrder, KnowledgeArticle, CompanyDocument, Employee],
      synchronize: true,
    }
  : {
      type: 'sqlite' as const,
      database: 'data.sqlite',
      entities: [Announcement, Leave, Workflow, ErpItem, ErpOrder, KnowledgeArticle, CompanyDocument, Employee],
      synchronize: true,
    };

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      Announcement,
      Leave,
      Workflow,
      ErpItem,
      ErpOrder,
      KnowledgeArticle,
      CompanyDocument,
      Employee
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
