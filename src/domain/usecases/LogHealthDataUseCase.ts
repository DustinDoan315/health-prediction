import { HealthLog, LogType } from '../entities';

export interface IHealthLogRepository {
  createLog(log: HealthLog): Promise<HealthLog>;
  getUserLogs(userId: number, type?: LogType, startDate?: Date, endDate?: Date): Promise<HealthLog[]>;
  updateLog(log: HealthLog): Promise<HealthLog>;
  deleteLog(logId: string): Promise<void>;
}

export interface LogHealthDataRequest {
  userId: number;
  type: LogType;
  value: number;
  unit: string;
  notes?: string;
  loggedAt?: Date;
}

export class LogHealthDataUseCase {
  constructor(private readonly logRepository: IHealthLogRepository) {}

  async execute(request: LogHealthDataRequest): Promise<HealthLog> {
    const log = HealthLog.create(
      request.userId,
      request.type,
      request.value,
      request.unit,
      request.notes,
      request.loggedAt
    );

    return await this.logRepository.createLog(log);
  }
}
