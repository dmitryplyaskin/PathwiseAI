import { Injectable } from '@nestjs/common';
import { LessonStatus } from '../entities/lesson.entity';

export interface SM2Result {
  status: LessonStatus;
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
}

@Injectable()
export class SM2SpacedRepetitionService {
  private readonly MIN_EASE_FACTOR = 1.3;
  private readonly INITIAL_EASE_FACTOR = 2.5;
  private readonly INITIAL_INTERVAL = 1;

  calculateNextReview(
    currentStatus: LessonStatus,
    currentInterval: number,
    currentEaseFactor: number,
    score: number, // 0-100
  ): SM2Result {
    const now = new Date();

    // Определяем качество ответа по баллу
    let quality: number;
    if (score >= 85) {
      quality = 5; // Отлично
    } else if (score >= 70) {
      quality = 4; // Хорошо
    } else if (score >= 50) {
      quality = 3; // Удовлетворительно
    } else if (score >= 30) {
      quality = 2; // Плохо
    } else {
      quality = 1; // Очень плохо
    }

    let newStatus: LessonStatus;
    let newInterval: number;
    let newEaseFactor: number;

    if (quality >= 3) {
      // Правильный ответ
      if (currentStatus === LessonStatus.NOT_STARTED) {
        newStatus = LessonStatus.LEARNING;
        newInterval = this.INITIAL_INTERVAL;
        newEaseFactor = this.INITIAL_EASE_FACTOR;
      } else if (currentStatus === LessonStatus.LEARNING) {
        newStatus = LessonStatus.MASTERED;
        newInterval = Math.round(currentInterval * currentEaseFactor);
        newEaseFactor = Math.max(
          this.MIN_EASE_FACTOR,
          currentEaseFactor +
            0.1 -
            (5 - quality) * (0.08 + (5 - quality) * 0.02),
        );
      } else {
        // MASTERED
        newStatus = LessonStatus.MASTERED;
        newInterval = Math.round(currentInterval * currentEaseFactor);
        newEaseFactor = Math.max(
          this.MIN_EASE_FACTOR,
          currentEaseFactor +
            0.1 -
            (5 - quality) * (0.08 + (5 - quality) * 0.02),
        );
      }
    } else {
      // Неправильный ответ
      newStatus = LessonStatus.LEARNING;
      newInterval = this.INITIAL_INTERVAL;
      newEaseFactor = Math.max(this.MIN_EASE_FACTOR, currentEaseFactor - 0.2);
    }

    const nextReviewAt = new Date(
      now.getTime() + newInterval * 24 * 60 * 60 * 1000,
    );

    return {
      status: newStatus,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReviewAt,
    };
  }
}
