import { Test, TestingModule } from '@nestjs/testing';
import { GatewaySvcController } from './gateway-svc.controller';
import { GatewaySvcService } from './gateway-svc.service';

describe('GatewaySvcController', () => {
  let gatewaySvcController: GatewaySvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewaySvcController],
      providers: [GatewaySvcService],
    }).compile();

    gatewaySvcController = app.get<GatewaySvcController>(GatewaySvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gatewaySvcController.getHello()).toBe('Hello World!');
    });
  });
});
