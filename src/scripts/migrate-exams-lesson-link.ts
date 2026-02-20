import { mkdirSync, cpSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { PGliteDriver } from 'typeorm-pglite';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { User } from '../modules/users/entities/user.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Unit } from '../modules/courses/entities/unit.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { Exam } from '../modules/exams/entities/exam.entity';
import { ExamResult } from '../modules/exams/entities/exam-result.entity';
import { Question } from '../modules/questions/entities/question.entity';
import { UserAnswer } from '../modules/questions/entities/user-answer.entity';
import { Chat } from '../modules/chat/entities/chat.entity';
import { ChatMessage } from '../modules/chat/entities/chat-message.entity';
import { ClarificationMessage } from '../modules/chat/entities/clarification-message.entity';

interface AmbiguousExamRecord {
  examId: string;
  title: string;
  userId?: string;
  courseId?: string;
  reason: string;
  matchedLessonIds?: string[];
}

const TITLE_PREFIX = 'Тест по уроку: ';

function getTimestampSlug(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backupPgliteData(timestamp: string): string {
  const sourceDir = join(process.cwd(), 'pglite-data');
  const backupsRoot = join(process.cwd(), 'pglite-backups');
  const backupDir = join(backupsRoot, timestamp);

  mkdirSync(backupsRoot, { recursive: true });
  cpSync(sourceDir, backupDir, { recursive: true, force: true });

  return backupDir;
}

function parseLessonTitle(examTitle: string): string | null {
  if (!examTitle.startsWith(TITLE_PREFIX)) {
    return null;
  }

  const title = examTitle.slice(TITLE_PREFIX.length).trim();
  return title.length > 0 ? title : null;
}

async function runMigration(): Promise<void> {
  const timestamp = getTimestampSlug();
  const backupPath = backupPgliteData(timestamp);

  const reportDir = join(process.cwd(), 'reports', 'migrations');
  mkdirSync(reportDir, { recursive: true });

  const dataSource = new DataSource({
    type: 'postgres',
    driver: new PGliteDriver({
      dataDir: './pglite-data',
      extensions: { uuid_ossp },
    }).driver,
    database: 'pathwiseai',
    entities: [
      User,
      Course,
      Unit,
      Lesson,
      Exam,
      ExamResult,
      Question,
      UserAnswer,
      Chat,
      ChatMessage,
      ClarificationMessage,
    ],
    synchronize: false,
  });

  const ambiguousRecords: AmbiguousExamRecord[] = [];
  let alreadyLinked = 0;
  let migrated = 0;

  await dataSource.initialize();

  try {
    await dataSource.query(
      'ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "lesson_id" uuid',
    );

    const examRepository = dataSource.getRepository(Exam);
    const lessonRepository = dataSource.getRepository(Lesson);

    const exams = await examRepository.find({
      relations: ['user', 'course', 'lesson'],
    });

    for (const exam of exams) {
      if (exam.lessonId) {
        alreadyLinked++;
        continue;
      }

      const parsedTitle = parseLessonTitle(exam.title);
      if (!parsedTitle) {
        ambiguousRecords.push({
          examId: exam.id,
          title: exam.title,
          userId: exam.user?.id,
          courseId: exam.course?.id,
          reason: 'title_not_migratable',
        });
        continue;
      }

      const matchedLessons = await lessonRepository.find({
        where: {
          title: parsedTitle,
          user: { id: exam.user?.id },
          unit: { course: { id: exam.course?.id } },
        },
        relations: ['unit', 'unit.course', 'user'],
      });

      if (matchedLessons.length !== 1) {
        ambiguousRecords.push({
          examId: exam.id,
          title: exam.title,
          userId: exam.user?.id,
          courseId: exam.course?.id,
          reason:
            matchedLessons.length === 0
              ? 'no_lesson_match'
              : 'multiple_lesson_matches',
          matchedLessonIds: matchedLessons.map((lesson) => lesson.id),
        });
        continue;
      }

      exam.lesson = matchedLessons[0];
      exam.lessonId = matchedLessons[0].id;
      await examRepository.save(exam);
      migrated++;
    }

    await dataSource.query(
      'CREATE INDEX IF NOT EXISTS "idx_exams_lesson_id" ON "exams" ("lesson_id")',
    );

    const report = {
      timestamp,
      backupPath,
      totals: {
        totalExams: exams.length,
        migrated,
        alreadyLinked,
        ambiguous: ambiguousRecords.length,
      },
      ambiguousRecords,
    };

    const reportPath = join(
      reportDir,
      `exams-lesson-link-report-${timestamp}.json`,
    );

    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    // eslint-disable-next-line no-console
    console.log(`Migration completed. Report: ${reportPath}`);
    // eslint-disable-next-line no-console
    console.log(`Backup created: ${backupPath}`);
  } finally {
    await dataSource.destroy();
  }
}

runMigration().catch((error: unknown) => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  // eslint-disable-next-line no-console
  console.error('Migration failed:', errorObj.message);
  process.exit(1);
});