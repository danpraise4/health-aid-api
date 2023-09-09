import Redis from 'ioredis';

export default class RedisClient {
  private client: Redis;
  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl);
  }

  async set(key: string, value: string): Promise<string> {
    return await this.client.set(key, value);
  }

  async getPatientSocket(patientId: string): Promise<string | null> {
    const socket = await this.client.get(patientId);
    if (socket) {
      return socket;
    }
    return null;
  }

  async delete(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
}
