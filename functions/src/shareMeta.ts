/**
 * iPet Cloud Functions - Dynamic OpenGraph Meta Tags para compartilhamento social
 */

export const generateSosShareHtml = (petName: string, breed: string, lastSeenAddress: string, photoUrl: string) => {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>URGENTE: Ajude a encontrar ${petName} (${breed}) - iPet SOS</title>
  <meta property="og:title" content="ALERTA SOS: ${petName} está desaparecido!">
  <meta property="og:description" content="Visto por último em ${lastSeenAddress}. Se você tem informações, clique para ver foto e contatar o tutor.">
  <meta property="og:image" content="${photoUrl}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body>
  <h1>Alerta de Pet Desaparecido: ${petName}</h1>
</body>
</html>`;
};
