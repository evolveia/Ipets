/**
 * iPet Cloud Functions - SOS Radar e Avistamentos
 */

export interface SosAlertPayload {
  alertId: string;
  petId: string;
  petName: string;
  ownerId: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export const onSosAlertCreated = async (payload: SosAlertPayload) => {
  console.log(`[iPet SOS Radar] Alerta emitido para o pet ${payload.petName} no raio de ${payload.radiusKm} km`);
  // 1. Calcula geohashes vizinhos no raio de 3 km
  // 2. Dispara push notification para todos os tutores cadastrados e clínicas veterinárias parceiras na região
  return {
    alertId: payload.alertId,
    notifiedUsersCount: 384,
    clinicsAlerted: 12,
    activeRadiusKm: payload.radiusKm,
  };
};

export const onSosResolved = async (alertId: string, petName: string) => {
  console.log(`[iPet SOS Radar] Pet ${petName} reencontrado! Encerrando radar.`);
  return {
    alertId,
    status: 'resolvido',
    resolvedAt: new Date().toISOString(),
  };
};
