# Quake3 prometheus exporter

Use like `http://127.0.0.1:3000/probe?target=127.0.0.1:27960`

README TODO

```
metrics:
ping
fraglimit
timelimit
capturelimit
maxclients
gametype
maxplayers
password

player_score
player_ping

tags:
player_name
map
server_name
server_ip / server_port
bot?


{
  "name": "R&D dedicated",
  "map": "q3dm5",
  "password": "0",
  "raw": {
    "sv_allowDownload": "1",
    "dmflags": "0",
    "fraglimit": "50",
    "timelimit": "15",
    "sv_hostname": "R&D dedicated",
    "sv_maxclients": "16",
    "sv_minRate": "0",
    "sv_maxRate": "0",
    "sv_dlRate": "100",
    "sv_minPing": "0",
    "sv_maxPing": "0",
    "sv_floodProtect": "1",
    "g_maxGameClients": "0",
    "capturelimit": "5",
    "g_gametype": "0",
    "version": "ioq3 1.36_GIT_09166ba0-2018-10-17 linux-x86_64 Nov  5 2018",
    "com_gamename": "Quake3Arena",
    "com_protocol": "71",
    "mapname": "q3dm5",
    "sv_privateClients": "0",
    "gamename": "baseq3",
    "g_needpass": "0"
  },
  "maxplayers": "16",
  "players": [],
  "bots": [],
  "connect": "195.12.142.22:35262",
  "ping": 4
}
```
