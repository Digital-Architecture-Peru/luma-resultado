const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'cards-query-mfe',

  // Rutas expuestas al shell (H1, H3): el shell las monta en /tarjetas.
  exposes: {
    './routes': './src/app/cards/cards.routes.ts',
  },

  // Angular compartido como singleton; versiones estrictas para evitar incompatibilidades con el shell.
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
