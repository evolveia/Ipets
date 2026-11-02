# Arquitetura de Banco de Dados (Cloud Firestore)

## Coleções Principais
- `users`: Tutores, parceiros de hubs e entregadores.
- `pets`: Perfis de múltiplos pets vinculados a cada tutor.
  - Subcoleção `pets/{id}/health_records`: Histórico vacinal, exames e consultas.
- `products`: Catálogo dos Top 100 SKUs de alta rotatividade.
- `hubs`: Micro-hubs de bairro, pet shops credenciados e atacarejos parceiros.
  - Subcoleção `hubs/{id}/inventory`: Estoque em tempo real e rank local.
- `orders`: Pedidos de entrega expressa 24/7 com geolocalização.
  - Subcoleção `orders/{id}/events`: Linha do tempo dos estados do pedido.
- `sos_alerts`: Rede comunitária de pets desaparecidos com raio de 3km.
  - Subcoleção `sos_alerts/{id}/sightings`: Avistamentos reportados pela comunidade.
- `subscriptions`: Planos iPet Prime e iPet Protect.
- `microchips`: Registro centralizado de microchips ISO implantados.
