export class CacheOrderKeys{
    static allOrders = 'orders';
    static ORDER = 'order';
    static orderByID(orderId: number){
        return `order-${orderId}`;
    }
    static orderByUser(userUuid: string){
        return `order-by-user-${userUuid}`;
    }
}