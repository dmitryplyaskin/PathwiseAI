import { Injectable } from '@nestjs/common';
import { LessonStatus } from '../entities/lesson.entity';

export interface SM2Result {
  status: LessonStatus;
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
  actualInterval?: number; // Фактический интервал в днях от последнего повторения
  repetitions: number; // Количество успешных повторений подряд
}

@Injectable()
export class SM2SpacedRepetitionService {
  private readonly MIN_EASE_FACTOR = 1.3;
  private readonly INITIAL_EASE_FACTOR = 2.5;
  private readonly INITIAL_INTERVAL = 1;
  private readonly SECOND_INTERVAL = 6;

  calculateNextReview(
    currentStatus: LessonStatus,
    currentInterval: number,
    currentEaseFactor: number,
    currentRepetitions: number,
    score: number, // 0-100
    totalQuestions?: number, // 5 или 10 для разных типов тестов
    lastReviewAt?: Date, // Время последнего повторения для учёта времени
    correctAnswers?: number, // если есть — используем как более надёжный сигнал
  ): SM2Result {
    const now = new Date();

    // Нормализуем входы
    const safeTotal =
      typeof totalQuestions === 'number' && totalQuestions > 0
        ? totalQuestions
        : undefined;
    const safeCorrect =
      typeof correctAnswers === 'number' && correctAnswers >= 0
        ? correctAnswers
        : undefined;

    // Определяем качество ответа.
    // Если известны correct/total — используем дискретную шкалу (стабильнее для 5/10 вопросов).
    // Иначе используем score (0..100) по ужесточенной шкале.
    let quality: number;
    if (safeTotal && safeCorrect !== undefined) {
      const c = Math.min(Math.max(safeCorrect, 0), safeTotal);
      // Для 5 вопросов:
      // 5/5 -> 5, 4/5 -> 4, 3/5 -> 3, 2/5 -> 2, 0-1/5 -> 1
      // Для 10 вопросов:
      // 9-10 -> 5, 8 -> 4, 6-7 -> 3, 4-5 -> 2, 0-3 -> 1
      if (safeTotal <= 5) {
        if (c >= safeTotal) quality = 5;
        else if (c >= safeTotal - 1) quality = 4;
        else if (c >= 3) quality = 3;
        else if (c >= 2) quality = 2;
        else quality = 1;
      } else {
        if (c >= safeTotal - 1) quality = 5;
        else if (c >= safeTotal - 2) quality = 4;
        else if (c >= Math.ceil(safeTotal * 0.6)) quality = 3;
        else if (c >= Math.ceil(safeTotal * 0.4)) quality = 2;
        else quality = 1;
      }
    } else {
      const adjustedScore = Math.max(0, Math.min(100, score));
      if (adjustedScore >= 90) quality = 5;
      else if (adjustedScore >= 80) quality = 4;
      else if (adjustedScore >= 60) quality = 3;
      else if (adjustedScore >= 40) quality = 2;
      else quality = 1;
    }

    // Учёт времени: корректируем качество если пользователь повторяет не по расписанию
    if (lastReviewAt && currentInterval > 0) {
      const actualDaysPassed = Math.floor(
        (now.getTime() - lastReviewAt.getTime()) / (24 * 60 * 60 * 1000),
      );
      const plannedDays = currentInterval;

      // Если прошло меньше половины запланированного времени - слишком рано
      if (actualDaysPassed < plannedDays * 0.5) {
        // Раннее повторение проще, чем по расписанию -> немного занижаем качество, чтобы не "накручивать" интервалы
        quality = Math.max(1, quality - 1);
      }
      // Если прошло больше 2х запланированного времени - повторение просрочено (обычно сложнее -> качество снижается)
      else if (actualDaysPassed > plannedDays * 2) {
        const overdueFactor = actualDaysPassed / plannedDays;
        const penalty = overdueFactor >= 4 ? 2 : 1;
        quality = Math.max(1, quality - penalty);
      }
    }

    const baseEase =
      typeof currentEaseFactor === 'number' && currentEaseFactor > 0
        ? currentEaseFactor
        : this.INITIAL_EASE_FACTOR;
    const easeDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    const nextEaseFactor = Math.max(this.MIN_EASE_FACTOR, baseEase + easeDelta);

    let newStatus: LessonStatus;
    let newInterval: number;
    let newEaseFactor: number;
    let newRepetitions: number;

    // Каноническая логика SM-2 (упрощённо):
    // - quality < 3: repetitions сбрасывается в 0, интервал = 1
    // - quality >= 3: repetitions++, первые интервалы 1 и 6 дней, дальше interval *= EF
    const safePrevRepetitions =
      typeof currentRepetitions === 'number' && currentRepetitions > 0
        ? Math.floor(currentRepetitions)
        : 0;
    const safePrevInterval =
      typeof currentInterval === 'number' && currentInterval >= 1
        ? currentInterval
        : this.INITIAL_INTERVAL;

    if (quality < 3) {
      newRepetitions = 0;
      newInterval = this.INITIAL_INTERVAL;
      newEaseFactor = nextEaseFactor;
      newStatus = quality === 1 ? LessonStatus.FAILED : LessonStatus.LEARNING;
    } else {
      newRepetitions = safePrevRepetitions + 1;
      if (newRepetitions === 1) {
        newInterval = this.INITIAL_INTERVAL;
      } else if (newRepetitions === 2) {
        newInterval = this.SECOND_INTERVAL;
      } else {
        newInterval = Math.round(safePrevInterval * nextEaseFactor);
        if (newInterval > 365) {
          newInterval = Math.round(
            safePrevInterval * Math.sqrt(nextEaseFactor),
          );
        }
      }
      newEaseFactor = nextEaseFactor;
      newStatus =
        newRepetitions >= 2 ? LessonStatus.MASTERED : LessonStatus.LEARNING;
    }

    // Гарантируем корректные значения интервала
    if (!Number.isFinite(newInterval) || newInterval < 1) {
      newInterval = this.INITIAL_INTERVAL;
    }

    const nextReviewAt = new Date(
      now.getTime() + newInterval * 24 * 60 * 60 * 1000,
    );

    // Рассчитываем фактический интервал в днях от последнего повторения
    let actualInterval: number | undefined;
    if (lastReviewAt) {
      actualInterval = Math.floor(
        (now.getTime() - lastReviewAt.getTime()) / (24 * 60 * 60 * 1000),
      );
    }

    return {
      status: newStatus,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReviewAt,
      actualInterval,
      repetitions: newRepetitions,
    };
  }
}
