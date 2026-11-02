# iPet API & Cloud Functions Spec

## Endpoints e Funções Serverless
- `POST /api/orders/create` -> `onOrderCreated`: Validação de inventário e emissão de push de entrega.
- `PATCH /api/orders/:id/status` -> `onOrderStatusChange`: Notificação ao tutor e tracking no mapa.
- `POST /api/sos/alerts` -> `onSosAlertCreated`: Disparo de alerta em raio de 3 km.
- `POST /api/sos/sightings` -> Registro de avistamento por membro da comunidade.
- `GET /share/sos/:alertId` -> Renderização dinâmica de OpenGraph cards para WhatsApp.
- `GET /share/pet/:petId` -> Passaporte digital público para leitura de veterinário credenciado.
