import { Test, TestingModule } from '@nestjs/testing';
import { OrderGateway } from './order.gateway';
import { Server, Socket } from 'socket.io';
import {
  OrderCreatedEventDto,
  OrderUpdatedEventDto,
  OrderCancelledEventDto,
  SubscribeToOrderDto,
} from '../dto/order-event.dto';

describe('OrderGateway', () => {
  let gateway: OrderGateway;
  let mockServer: Partial<Server>;
  let mockClient: Partial<Socket>;

  beforeEach(async () => {
    mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      sockets: {
        size: 5,
      } as any,
    };

    mockClient = {
      id: 'test-client-id',
      join: jest.fn(),
      leave: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderGateway],
    }).compile();

    gateway = module.get<OrderGateway>(OrderGateway);
    gateway.server = mockServer as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('Lifecycle hooks', () => {
    it('should log on afterInit', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.afterInit(mockServer as Server);
      
      expect(logSpy).toHaveBeenCalledWith(
        'WebSocket Gateway inicializado en namespace: /orders',
      );
    });

    it('should log on handleConnection', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.handleConnection(mockClient as Socket);
      
      expect(logSpy).toHaveBeenCalledWith(`Cliente conectado: ${mockClient.id}`);
    });

    it('should log on handleDisconnect', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.handleDisconnect(mockClient as Socket);
      
      expect(logSpy).toHaveBeenCalledWith(`Cliente desconectado: ${mockClient.id}`);
    });
  });

  describe('Subscribe/Unsubscribe', () => {
    it('should subscribe client to order room', () => {
      const subscribeDto: SubscribeToOrderDto = { orderId: 123 };
      
      const result = gateway.handleSubscribeToOrder(
        subscribeDto,
        mockClient as Socket,
      );

      expect(mockClient.join).toHaveBeenCalledWith('order-123');
      expect(result).toEqual({
        event: 'subscribed',
        data: {
          status: 'success',
          orderId: 123,
        },
      });
    });

    it('should unsubscribe client from order room', () => {
      const unsubscribeDto: SubscribeToOrderDto = { orderId: 123 };
      
      const result = gateway.handleUnsubscribeFromOrder(
        unsubscribeDto,
        mockClient as Socket,
      );

      expect(mockClient.leave).toHaveBeenCalledWith('order-123');
      expect(result).toEqual({
        event: 'unsubscribed',
        data: {
          status: 'success',
          orderId: 123,
        },
      });
    });
  });

  describe('Event emissions', () => {
    it('should emit order created event', () => {
      const payload: OrderCreatedEventDto = {
        orderId: 1,
        userId: 10,
        total: 100.0,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      gateway.emitOrderCreated(payload);

      expect(mockServer.emit).toHaveBeenCalledWith('order.created', payload);
      expect(mockServer.to).toHaveBeenCalledWith('order-1');
    });

    it('should emit order updated event', () => {
      const payload: OrderUpdatedEventDto = {
        orderId: 1,
        status: 'CONFIRMED',
        updatedAt: new Date().toISOString(),
      };

      gateway.emitOrderUpdated(payload);

      expect(mockServer.emit).toHaveBeenCalledWith('order.updated', payload);
      expect(mockServer.to).toHaveBeenCalledWith('order-1');
    });

    it('should emit order cancelled event', () => {
      const payload: OrderCancelledEventDto = {
        orderId: 1,
        reason: 'Customer request',
        cancelledAt: new Date().toISOString(),
      };

      gateway.emitOrderCancelled(payload);

      expect(mockServer.emit).toHaveBeenCalledWith('order.canceled', payload);
      expect(mockServer.to).toHaveBeenCalledWith('order-1');
    });

    it('should emit to specific client', () => {
      const clientId = 'client-123';
      const event = 'custom.event';
      const data = { message: 'test' };

      gateway.emitToClient(clientId, event, data);

      expect(mockServer.to).toHaveBeenCalledWith(clientId);
      expect(mockServer.emit).toHaveBeenCalledWith(event, data);
    });
  });

  describe('Utility methods', () => {
    it('should return connected clients count', () => {
      const count = gateway.getConnectedClientsCount();
      expect(count).toBe(5);
    });
  });
});
