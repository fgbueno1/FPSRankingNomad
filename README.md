# FPS Ranking Nomad

## 📋 Descrição

FPS Ranking Nomad é uma aplicação backend desenvolvida em NestJS para gerenciar rankings e estatísticas de jogadores de FPS (First Person Shooter). O sistema permite o upload de logs de partidas, processamento de estatísticas e geração de rankings globais.

## 🚀 Funcionalidades

- **Upload de Logs**: Sistema para upload e processamento de logs de partidas
- **Estatísticas de Partidas**: Análise e armazenamento de estatísticas detalhadas e ranking da partida
- **Ranking Global**: Sistema de ranking baseado no desempenho dos jogadores, o ranking favorece jogadores consistentes em multiplas partidas, enquanto ainda recompensa altas perfomaces em uma única partida
- **Autenticação por Chave**: Sistema de autenticação via API keys
- **Integração MongoDB**: Armazenamento persistente de dados

## 🛠️ Tecnologias Utilizadas

- **Backend**: NestJS (Node.js + TypeScript)
- **Banco de Dados**: MongoDB com Mongoose
- **Upload de Arquivos**: Multer
- **Configuração**: @nestjs/config
- **Containerização**: Docker

## 📦 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- MongoDB
- Docker e docker-compose

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd fpsranking-nomad
```

### 2. Crie arquivos de varáveis de ambiente

```bash
touch dev.env
touch .env
```

### 3. Configure as variáveis de ambiente com valores similares a:

dev.env
```env
MONGODB_URI=mongodb://admin:admin@mongo/FpsNomadDB?authSource=admin
API_KEY=mysecretkey123
```

.env
```env
MONGO_USER=admin
MONGO_PASSWORD=admin
```

### 4. Execute o projeto

```bash
sudo docker-compose up -d
```

## 📁 Estrutura do Projeto

```
src/
├── app.module.ts              # Módulo principal da aplicação
├── main.ts                    # Ponto de entrada da aplicação
├── app.controller.ts          # Controller principal
├── app.service.ts             # Serviço principal
├── key-guard/                 # Sistema de autenticação por api key
├── uploader/                  # Sistema de upload de arquivos
├── global-ranking/            # Sistema de ranking global
├── mongo-connector/           # Conectores do MongoDB
├── matches/                   # Listagem de partidas e estatísticas
└── match-stats/               # Calculo de estatísticas de partidas
```

## 🔐 Autenticação

O sistema utiliza autenticação via API Key. Para acessar os endpoints protegidos, inclua o header:

```
x-api-key: YOUR_API_KEY
```

## 📊 Endpoints da API

### Upload de Logs
- `POST /upload` - Upload de arquivos de log de partidas


### Ranking Global
- `GET /global-ranking` - Obter ranking global

### Partidas
- `GET /matches` - Listar partidas
- `GET /matches/:id` - visualizar estatísticas da partida e ranking dos jogadores participantes

## 📝 Logs

Os logs para testes estão armazenados no diretório `fps_logs/`. Utilize-os de base caso queira criar novos logs para teste.

**Desenvolvido com ❤️ usando NestJS**
