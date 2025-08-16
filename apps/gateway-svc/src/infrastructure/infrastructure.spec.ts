import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis/redis.service';

describe('Infrastructure', () => {
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            ping: jest.fn().mockResolvedValue('PONG'),
            get: jest.fn().mockImplementation((key: string) => {
              if (key.startsWith('session:')) {
                return Promise.resolve('{"userId":1,"username":"test"}');
              }
              return Promise.resolve('test-value');
            }),
            set: jest.fn().mockResolvedValue('OK'),
            setex: jest.fn().mockResolvedValue('OK'),
            del: jest.fn().mockResolvedValue(1),
            exists: jest.fn().mockResolvedValue(1),
          },
        },
        RedisService,
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
  });

  describe('RedisService', () => {
    it('should be defined', () => {
      expect(redisService).toBeDefined();
    });

    it('should ping redis successfully', async () => {
      const result = await redisService.ping();
      expect(result).toBe('PONG');
    });

    it('should get value from redis', async () => {
      const result = await redisService.get('test-key');
      expect(result).toBe('test-value');
    });

    it('should set value in redis', async () => {
      await redisService.set('test-key', 'test-value');
      // No assertion needed as we're just testing it doesn't throw
    });

    it('should set value with TTL in redis', async () => {
      await redisService.set('test-key', 'test-value', 3600);
      // No assertion needed as we're just testing it doesn't throw
    });

    it('should delete value from redis', async () => {
      await redisService.del('test-key');
      // No assertion needed as we're just testing it doesn't throw
    });

    it('should check if key exists in redis', async () => {
      const result = await redisService.exists('test-key');
      expect(result).toBe(true);
    });

    it('should manage sessions', async () => {
      const sessionId = 'test-session-id';
      const sessionData = { userId: 1, username: 'test' };

      await redisService.setSession(sessionId, sessionData);
      const retrievedData = await redisService.getSession(sessionId);

      expect(retrievedData).toEqual(sessionData);

      await redisService.deleteSession(sessionId);
    });
  });
});
