# 📚 Documentação da API - FPS Ranking Nomad

## 🔐 Autenticação

Todas as requisições para a API devem incluir um header de autenticação:

```
x-api-key: YOUR_API_KEY
```

**Exemplo:**
```bash
curl -H "x-api-key: your-secret-key" http://localhost:3000/matches
```

## 📊 Endpoints

### 1. Health Check

#### `GET /`
Verifica o status de saúde da aplicação.

**Resposta:**
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Upload de Logs

#### `POST /upload/log`
Faz upload de um arquivo de log de partida.

**Headers:**
```
Content-Type: multipart/form-data
x-api-key: YOUR_API_KEY
```

**Body:**
- `file`: Arquivo de log (formato suportado: .log, .txt)

**Exemplo:**
```bash
curl -X POST \
  -H "x-api-key: your-secret-key" \
  -F "file=@match_log.txt" \
  http://localhost:3000/upload/log
```

**Resposta de Sucesso (201):**
```json
{
  "status": "created",
  "code": 201,
  "message": "File parsed and stats saved successfully"
}
```

**Possíveis Erros (400):**
- `No file provided`: Nenhum arquivo foi enviado
- `Invalid file format`: Formato de arquivo não suportado
- `Invalid log format`: Formato do log é inválido

---

### 3. Partidas

#### `GET /matches`
Lista todas as partidas disponíveis.

**Headers:**
```
x-api-key: YOUR_API_KEY
```

**Resposta:**
```json
{
  "count": 3,
  "urls": [
    "http://localhost:3000/matches/match_001",
    "http://localhost:3000/matches/match_002",
    "http://localhost:3000/matches/match_003"
  ]
}
```

#### `GET /matches/:id`
Obtém detalhes de uma partida específica.

**Parâmetros:**
- `id` (string): ID da partida

**Headers:**
```
x-api-key: YOUR_API_KEY
```

**Resposta:**
```json
{
  "matchId": "match_001",
  "start": "2024-01-15T10:00:00.000Z",
  "end": "2024-01-15T10:15:30.000Z",
  "winningTeam": "RED_TEAM",
  "score": {
    "RED_TEAM": 15,
    "BLUE_TEAM": 12
  },
  "MatchMvp": {
    "playerName": "Player1",
    "mostUsedWeapon": "AK47"
  },
  "longestKillingStreak": {
    "playerName": "Player2",
    "killsNumber": 8
  },
  "ranking": [
    {
      "name": "Player1",
      "team": "RED_TEAM",
      "kills": 25,
      "assists": 5,
      "deaths": 8,
      "worldDeaths": 2,
      "friendlyFire": 1,
      "KDA": 3.75,
      "mostUsedWeapon": "AK47",
      "awards": [
        "SpeedKiller",
        "FirstBlood"
      ]
    }
  ]
}
```

**Erro (404):**
```json
{
  "statusCode": 404,
  "message": "Match with ID match_999 not found",
  "error": "Not Found"
}
```

---

### 4. Ranking Global

#### `GET /global-ranking`
Obtém o ranking global dos jogadores.

**Headers:**
```
x-api-key: YOUR_API_KEY
```

**Query Parameters:**
- `limit` (opcional, number): Número máximo de jogadores a retornar (padrão: 10)

**Exemplo:**
```bash
curl -H "x-api-key: your-secret-key" \
  "http://localhost:3000/global-ranking?limit=3"
```

**Resposta:**
```json
{
    "count": 3,
    "players": [
        {
            "playerName": "Ava",
            "assists": 0,
            "deaths": 0,
            "kills": 12,
            "matchesPlayed": 1,
            "kda": 3.67
        },
        {
            "playerName": "Noah",
            "assists": 1,
            "deaths": 1,
            "kills": 7,
            "matchesPlayed": 1,
            "kda": 2.92
        },
        {
            "playerName": "Alice",
            "assists": 0,
            "deaths": 2,
            "kills": 11,
            "matchesPlayed": 1,
            "kda": 2.58
        }
    ]
}
```

---

## 📋 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - API key inválida ou ausente |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno do servidor |

---

## 🔧 Exemplos de Uso

### Exemplo 1: Upload de Log
```bash
curl -X POST \
  -H "x-api-key: your-secret-key" \
  -F "file=@/path/to/match_log.txt" \
  http://localhost:3000/upload/log
```

### Exemplo 2: Listar Partidas
```bash

curl -H "x-api-key: your-secret-key" \
  http://localhost:3000/matches
```

### Exemplo 3: Detalhes de uma Partida
```bash
curl -H "x-api-key: your-secret-key" \
  http://localhost:3000/matches/match_001
```

### Exemplo 4: Ranking Global
```bash
curl -H "x-api-key: your-secret-key" \
  "http://localhost:3000/global-ranking?limit=20"
```
