/**
 * iPet Cloud Functions - Orders Lifecycle
 */

export interface OrderCreationPayload {
  orderId: string;
  userId: string;
  hubId: string;
  items: Array<{ productId: string; qty: number }>;
}

export const onOrderCreated = async (payload: OrderCreationPayload) => {
  console.log(`[iPet Functions] Novo pedido criado: ${payload.orderId} no Hub: ${payload.hubId}`);
  // 1. Reserva estoque no inventário do micro-hub
  // 2. Dispara notificação push para o sistema de picking do lojista
  // 3. Notifica o tutor com código de confirmação
  return {
    success: true,
    reservedItems: payload.items.length,
    status: 'confirmed',
    notifiedHub: true,
  };
};

export const onOrderStatusChange = async (orderId: string, newStatus: string, userId: string) => {
  console.log(`[iPet Functions] Status do pedido ${orderId} atualizado para ${newStatus}`);
  // Dispara FCM push para o tutor do pet
  return {
    orderId,
    newStatus,
    fcmPushed: true,
  };
};
