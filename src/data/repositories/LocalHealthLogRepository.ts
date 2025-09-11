import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthLog, LogType } from '../../domain/entities';
import { IHealthLogRepository } from '../../domain/usecases/LogHealthDataUseCase';


const HEALTH_LOGS_KEY = 'health_logs';

export class LocalHealthLogRepository implements IHealthLogRepository {
  private async getStoredLogs(): Promise<HealthLog[]> {
    try {
      const stored = await AsyncStorage.getItem(HEALTH_LOGS_KEY);
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      return data.map((item: any) => new HealthLog(
        item.id,
        item.userId,
        item.type,
        item.value,
        item.unit,
        item.notes,
        new Date(item.loggedAt),
        new Date(item.createdAt)
      ));
    } catch (error) {
      console.error('Error loading health logs:', error);
      return [];
    }
  }

  private async saveLogs(logs: HealthLog[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HEALTH_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving health logs:', error);
      throw error;
    }
  }

  async createLog(log: HealthLog): Promise<HealthLog> {
    const logs = await this.getStoredLogs();
    logs.push(log);
    await this.saveLogs(logs);
    return log;
  }

  async getUserLogs(
    userId: number, 
    type?: LogType, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<HealthLog[]> {
    let logs = await this.getStoredLogs();
    
    logs = logs.filter(log => log.userId === userId);
    
    if (type) {
      logs = logs.filter(log => log.type === type);
    }
    
    if (startDate) {
      logs = logs.filter(log => log.loggedAt >= startDate);
    }
    
    if (endDate) {
      logs = logs.filter(log => log.loggedAt <= endDate);
    }
    
    return logs.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }

  async updateLog(updatedLog: HealthLog): Promise<HealthLog> {
    const logs = await this.getStoredLogs();
    const index = logs.findIndex(log => log.id === updatedLog.id);
    
    if (index === -1) {
      throw new Error('Log not found');
    }
    
    logs[index] = updatedLog;
    await this.saveLogs(logs);
    return updatedLog;
  }

  async deleteLog(logId: string): Promise<void> {
    const logs = await this.getStoredLogs();
    const filteredLogs = logs.filter(log => log.id !== logId);
    await this.saveLogs(filteredLogs);
  }
}
