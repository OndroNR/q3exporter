'use strict';

const Hapi = require('@hapi/hapi');
const laabr = require('laabr');
const Gamedig = require('gamedig');
const promClient = require('prom-client');

promClient.collectDefaultMetrics();
const m = {};
const quakeRegister = new promClient.Registry();

m.mapGauge = new promClient.Gauge({
  name: 'quake3_map',
  help: 'xxx',
  labelNames: ['server_name', 'map'],
  registers: [quakeRegister],
});

m.pingGauge = new promClient.Gauge({
  name: 'quake3_ping',
  help: 'xxx',
  labelNames: ['server_name'],
  registers: [quakeRegister],
});

m.fragLimitGauge = new promClient.Gauge({
  name: 'quake3_fraglimit',
  help: 'xxx',
  labelNames: ['server_name'],
  registers: [quakeRegister],
});

m.timeLimitGauge = new promClient.Gauge({
  name: 'quake3_timelimit',
  help: 'xxx',
  labelNames: ['server_name'],
  registers: [quakeRegister],
});

m.captureLimitGauge = new promClient.Gauge({
  name: 'quake3_capturelimit',
  help: 'xxx',
  labelNames: ['server_name'],
  registers: [quakeRegister],
});

m.maxPlayersGauge = new promClient.Gauge({
  name: 'quake3_maxplayers',
  help: 'xxx',
  labelNames: ['server_name'],
  registers: [quakeRegister],
});

m.playersGauge = new promClient.Gauge({
  name: 'quake3_player_count',
  help: 'xxx',
  labelNames: ['server_name', 'map', 'bot'],
  registers: [quakeRegister],
});

m.gametypeGauge = new promClient.Gauge({
  name: 'quake3_gametype',
  help: 'xxx',
  labelNames: ['server_name', 'map'],
  registers: [quakeRegister],
});

m.playerScoreGauge = new promClient.Gauge({
  name: 'quake3_player_score',
  help: 'xxx',
  labelNames: ['server_name', 'map', 'bot', 'player_name'],
  registers: [quakeRegister],
});

m.playerPingGauge = new promClient.Gauge({
  name: 'quake3_player_ping',
  help: 'xxx',
  labelNames: ['server_name', 'player_name'],
  registers: [quakeRegister],
});

m.probeSuccessGauge = new promClient.Gauge({
  name: 'probe_success',
  help: 'xxx',
  registers: [quakeRegister],
});

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.register({
    plugin: laabr,
    options: {},
  });

  server.route({
    method: 'GET',
    path: '/healthz',
    handler: (_request, _h) => {
      return 'OK';
    },
  });

  server.route({
    method: 'GET',
    path: '/metrics',
    handler: async (_request, h) => {
      return h.response(promClient.register.metrics()).type('text/plain');
    },
  });

  server.route({
    method: 'GET',
    path: '/probe',
    handler: async (request, h) => {
      const [host, port] = request.query.target.split(':');
      try {
        const res = await Gamedig.query({
          type: 'quake3',
          host,
          port,
        });
        quakeRegister.resetMetrics();
        m.probeSuccessGauge.set(1);
        m.fragLimitGauge.set({server_name: res.name}, parseInt(res.raw.fraglimit));
        m.timeLimitGauge.set({server_name: res.name}, parseInt(res.raw.timelimit));
        m.captureLimitGauge.set({server_name: res.name}, parseInt(res.raw.capturelimit));
        m.gametypeGauge.set({server_name: res.name}, parseInt(res.raw.g_gametype));
        m.maxPlayersGauge.set({server_name: res.name}, parseInt(res.maxplayers));
        m.playersGauge.set({server_name: res.name, map: res.map, bot: 0}, res.players.length);
        m.playersGauge.set({server_name: res.name, map: res.map, bot: 1}, res.bots.length);
        m.mapGauge.set({server_name: res.name, map: res.map}, 1);
        m.pingGauge.set({server_name: res.name}, res.ping);

        res.players.forEach((player) => {
          m.playerScoreGauge.set({server_name: res.name, map: res.map, player_name: player.name, bot: 0}, player.frags);
          m.playerPingGauge.set({server_name: res.name, player_name: player.name}, player.ping);
        });

        res.bots.forEach((player) => {
          m.playerScoreGauge.set({server_name: res.name, map: res.map, player_name: player.name, bot: 1}, player.frags);
        });
      } catch {
        quakeRegister.resetMetrics();
        m.probeSuccessGauge.set(0);
      }

      return h.response(quakeRegister.metrics()).type('text/plain');
    },
  });

  server.route({
    method: 'GET',
    path: '/gamedig',
    handler: async (request, _h) => {
      const [host, port] = request.query.target.split(':');
      return await Gamedig.query({
        type: 'quake3',
        host,
        port,
      });
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
