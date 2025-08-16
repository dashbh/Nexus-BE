import { Test, TestingModule } from '@nestjs/testing';
import { GatewaySvcController } from './gateway-svc.controller';
import { GatewaySvcService } from './gateway-svc.service';

describe('GatewaySvcController', () => {
  let gatewaySvcController: GatewaySvcController;
  let gatewaySvcService: GatewaySvcService;

  const mockGatewaySvcService = {
    getHello: jest.fn().mockResolvedValue('Hello from Gateway Service! Environment: test'),
    getStatus: jest.fn().mockReturnValue({
      service: 'gateway-svc',
      environment: 'test',
      port: 3000,
      timestamp: '2025-01-16T10:00:00.000Z',
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewaySvcController],
      providers: [
        {
          provide: GatewaySvcService,
          useValue: mockGatewaySvcService,
        },
      ],
    }).compile();

    gatewaySvcController = app.get<GatewaySvcController>(GatewaySvcController);
    gatewaySvcService = app.get<GatewaySvcService>(GatewaySvcService);
  });

  describe('getHello', () => {
    it('should return hello message', async () => {
      const result = await gatewaySvcController.getHello();
      expect(result).toBe('Hello from Gateway Service! Environment: test');
      expect(gatewaySvcService.getHello).toHaveBeenCalled();
    });
  });

  describe('getStatus', () => {
    it('should return service status', () => {
      const result = gatewaySvcController.getStatus();
      expect(result).toEqual({
        service: 'gateway-svc',
        environment: 'test',
        port: 3000,
        timestamp: '2025-01-16T10:00:00.000Z',
      });
      expect(gatewaySvcService.getStatus).toHaveBeenCalled();
    });
  });
});
