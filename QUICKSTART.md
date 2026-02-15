# 🚀 Início Rápido

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (apenas para desenvolvimento local)

## Executar o Projeto

### Opção 1: Docker (Recomendado)

```bash
# 1. Configure as variáveis de ambiente
cp .env.example .env

# 2. Edite o arquivo .env com a URL do seu backend
# REACT_APP_API_URL=http://localhost:8000

# 3. Inicie o container
docker compose up --build

# A aplicação estará disponível em http://localhost:3000
```

### Opção 2: Desenvolvimento Local

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Inicie o servidor de desenvolvimento
npm start

# A aplicação estará disponível em http://localhost:3000
```

## Primeiro Acesso

1. Acesse http://localhost:3000
2. Clique em "Acessar Sistema"
3. Faça login com suas credenciais do backend Django
4. Você será redirecionado para a área logada

## Problemas Comuns

### Backend não conecta
- Verifique se o backend Django está rodando
- Confirme a URL em `.env`

### Erro de CORS
- Configure CORS no backend Django para permitir `http://localhost:3000`

### Docker não inicia
```bash
docker compose down -v
docker compose up --build --force-recreate
```

## Estrutura de URLs

- `/` - Página inicial
- `/login` - Login
- `/app` - Área logada (requer autenticação)

---

Para mais detalhes, consulte o [README.md](README.md) completo.
