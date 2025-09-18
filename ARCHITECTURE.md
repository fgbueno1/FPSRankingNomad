# 🏗️ Arquitetura do Sistema - FPS Ranking Nomad

## 📋 Visão Geral

O FPS Ranking Nomad é uma aplicação backend desenvolvida em NestJS que gerencia rankings e estatísticas de jogadores de FPS. A arquitetura segue os princípios de Clean Architecture e utiliza padrões de design do NestJS.

## 📁 Estrutura de Módulos

### 1. App Module (Módulo Principal)
- **Arquivo**: `src/app.module.ts`
- **Responsabilidade**: Configuração principal da aplicação
- **Funcionalidades**:
  - Configuração do MongoDB
  - Configuração das variáveis de ambiente
  - Registro do guard de autenticação global
  - Importação de todos os módulos

### 2. Uploader Module
- **Arquivo**: `src/uploader/`
- **Responsabilidade**: Processamento de upload de logs
- **Componentes**:
  - `UploaderController`: Endpoint para upload de arquivos
  - `UploaderService`: Lógica de processamento de logs
  - `UploaderErrors`: Classes de erro customizadas

### 3. Matches Module
- **Arquivo**: `src/matches/`
- **Responsabilidade**: Gerenciamento de partidas
- **Componentes**:
  - `MatchesController`: Endpoints para listar e obter partidas
  - `MatchesService`: Lógica de negócio para partidas

### 4. Match Stats Module
- **Arquivo**: `src/match-stats/`
- **Responsabilidade**: Calculo de estatisticas da partida e armazenamento no banco de dados
- **Componentes**:
  - `MatchStatsService`: Calculo de estatísticas

### 5. Global Ranking Module
- **Arquivo**: `src/global-ranking/`
- **Responsabilidade**: Sistema de ranking global
- **Componentes**:
  - `GlobalRankingController`: Endpoint para rankings
  - `GlobalRankingService`: Cálculo de rankings

### 6. Parser Module
- **Arquivo**: `src/parser/`
- **Responsabilidade**: Parsing dos arquivos de log
- **Componentes**:
  - `ParserService`: Lógica de parsing dos arquivos de logs
  - `ParserErrors`: Classes de erro customizadas
  - `FpsLogsDTO`: DTOs utilizados pelo parser

### 7. Message Queue Module
- **Arquivo**: `src/message-queue/`
- **Responsabilidade**: Processamento assíncrono dos arquivos de log
- **Componentes**:
  - `MessageQueueService`: Envia novos eventos para filas de processamento
  - `LogParserService`: Cria um novo worker utilizando o modulo Parser para processar o arquivo de logs
  - `MarchProcessorService`: Cria um novo worker utilizando o modulo Match Stats para processar estatísticas das partidas

### 8. Mongo Connector Module
- **Arquivo**: `src/mongo-connector/`
- **Responsabilidade**: Conectividade com MongoDB
- **Componentes**:
  - `MongoConnectorService`: Operações CRUD
  - Schemas: Definição dos modelos de dados

### 9. Key Guard Module
- **Arquivo**: `src/key-guard/`
- **Responsabilidade**: Autenticação via API Key
- **Componentes**:
  - `ApiKeyGuard`: Guard de autenticação

## Tipos de Teste
- **Unitários**: Testes de serviços e lógica de negócio

## Health Check
- **Endpoint**: `GET /`
- **Informações**: Status, uptime, timestamp
- **Uso**: Monitoramento de saúde da aplicação