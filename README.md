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
- Docker (opcional, para containerização)

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
```bash
MONGODB_URI=mongodb://admin:admin@mongo/FpsNomadDB?authSource=admin
API_KEY=mysecretkey123
```

Edite o arquivo `.env` com suas configurações:

```env
MONGODB_URI=mongodb://localhost:27017/fps-ranking
PORT=3000
API_KEY=your-secret-api-key
```

### 4. Execute o projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 🐳 Execução com Docker

### Usando Docker Compose (Recomendado)

```bash
docker-compose up -d
```

### Usando Docker diretamente

```bash
# Build da imagem
docker build -t fpsranking-nomad .

# Execução
docker run -p 3000:3000 fpsranking-nomad
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📁 Estrutura do Projeto

```
src/
├── app.module.ts              # Módulo principal da aplicação
├── main.ts                    # Ponto de entrada da aplicação
├── app.controller.ts          # Controller principal
├── app.service.ts             # Serviço principal
├── key-guard/                 # Sistema de autenticação por chave
├── uploader/                  # Sistema de upload de arquivos
├── global-ranking/            # Sistema de ranking global
├── mongo-connector/           # Conectores do MongoDB
├── matches/                   # Gerenciamento de partidas
└── match-stats/              # Estatísticas de partidas
```

## 🔐 Autenticação

O sistema utiliza autenticação via API Key. Para acessar os endpoints protegidos, inclua o header:

```
Authorization: Bearer YOUR_API_KEY
```

## 📊 Endpoints da API

### Upload de Logs
- `POST /upload` - Upload de arquivos de log de partidas

### Estatísticas
- `GET /match-stats` - Obter estatísticas de partidas
- `POST /match-stats` - Criar novas estatísticas

### Rankings
- `GET /global-ranking` - Obter ranking global
- `POST /global-ranking` - Atualizar rankings

### Partidas
- `GET /matches` - Listar partidas
- `POST /matches` - Criar nova partida

## 🔧 Configuração de Desenvolvimento

### Formatação de Código

```bash
npm run format
```

### Linting

```bash
npm run lint
```

### Debug

```bash
npm run start:debug
```

## 📝 Logs

Os logs da aplicação são armazenados no diretório `fps_logs/`. Certifique-se de que este diretório tenha permissões de escrita.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:

- Abra uma [issue](https://github.com/seu-usuario/fpsranking-nomad/issues)
- Entre em contato através do email: seu-email@exemplo.com

## 🔄 Changelog

### v0.0.1
- Implementação inicial do sistema de ranking
- Sistema de upload de logs
- Integração com MongoDB
- Sistema de autenticação por API key

---

**Desenvolvido com ❤️ usando NestJS**
