import { Injectable } from "@angular/core";
import { io, Socket } from 'socket.io-client';
import { API } from "../constants";
import { Observable } from "rxjs";
import { Order } from "../models";
@Injectable({
  providedIn: 'root'
})
export class OrderWebsocketService{
  private socket: Socket | null = null;
  constructor() {}

  connect(): void {
    this.socket = io(API.ORDER.WEB_SOCKET, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    this.socket.on('connect', () => {
      console.log('Connected to order WebSocket');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from order WebSocket');
    });
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  onNewOrder():Observable<Order>{
    return new Observable<Order>(subscriber => {
      this.socket?.on('order.created', (order: Order) => {
        subscriber.next(order);
      });
      return () => {
        this.socket?.off('order.created');
      };
    });
  }
  onOrderUpdated(): Observable<Order> {
    return new Observable<Order>(subscriber => {
      this.socket?.on('order.updated', (order: Order) => {
        subscriber.next(order);
      });
      return () => {
        this.socket?.off('order.updated');
      };
    });
  }
  onOrderCancelled(): Observable<Order> {
    return new Observable<Order>(subscriber => {
      this.socket?.on('order.cancelled', (order: Order) => {
        subscriber.next(order);
      });
      return () => {
        this.socket?.off('order.cancelled');
      };
    });
  }
}
