# 🖋️ Mos Tattoo - Frontend

Sistema de gestão para estúdio de tatuagem - Interface Frontend desenvolvida em React.

## 📋 Sobre o Projeto

Frontend simples e moderno para o sistema de gestão Mos Tattoo, integrado com backend Django REST API. Este projeto contém as páginas iniciais do sistema: landing page, login e área logada básica.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **React Router DOM 6** - Navegação entre páginas
- **Axios** - Cliente HTTP para requisições
- **Docker** - Containerização da aplicação
- **Nginx** - Servidor web para produção

## 🎨 Design

### Paleta de Cores
- **Amarelo**: `#FFD700` (cor principal)
- **Preto**: `#000000` (texto e botões)
- **Branco**: `#FFFFFF` (fundo)

### Emojis Temáticos
🖋️ 💉 🧠 🎨 🖤

## 📁 Estrutura do Projeto

```
mos_tattoo_frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── Navbar.jsx           # Barra de navegação superior
│   │   └── ProtectedRoute.jsx   # Proteção de rotas autenticadas
│   ├── pages/
│   │   ├── Home.jsx              # Página inicial (landing)
│   │   ├── Login.jsx             # Página de login
│   │   └── DashboardHome.jsx     # Área logada inicial
│   ├── services/
│   │   ├── api.js                # Configuração do Axios
│   │   └── auth.js               # Serviço de autenticação
│   ├── styles/
│   │   └── main.css              # Estilos globais
│   ├── App.jsx                   # Componente principal
│   └── index.jsx                 # Ponto de entrada
├── Dockerfile                    # Imagem Docker
├── docker-compose.yml            # Orquestração Docker
├── nginx.conf                    # Configuração Nginx
├── package.json                  # Dependências do projeto
├── .env.example                  # Exemplo de variáveis de ambiente
└── README.md                     # Este arquivo
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_LOGIN_ENDPOINT=/api/auth/login/
```

**Variáveis disponíveis:**
- `REACT_APP_API_URL`: URL base do backend Django
- `REACT_APP_LOGIN_ENDPOINT`: Endpoint de autenticação

### 2. Executar com Docker (Recomendado)

```bash
# Build e iniciar container
docker compose up --build

# Executar em background
docker compose up -d

# Parar containers
docker compose down
```

A aplicação estará disponível em: **http://localhost:3000**

### 3. Executar em Desenvolvimento (Sem Docker)

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

O servidor de desenvolvimento estará em: **http://localhost:3000**

## 🔐 Autenticação

### Fluxo de Autenticação

1. Usuário acessa `/login` e insere credenciais
2. Frontend envia POST para o backend Django
3. Backend retorna token de autenticação e dados do usuário
4. Frontend salva token e user no `localStorage`
5. Usuário é redirecionado para `/app`

### Estrutura de Resposta do Backend

O backend deve retornar no formato:

```json
{
  "token": "seu-token-aqui",
  "user": {
    "id": 1,
    "username": "usuario",
    "name": "Nome do Usuário",
    "email": "usuario@email.com"
  }
}
```

### Proteção de Rotas

O componente `ProtectedRoute` protege rotas que requerem autenticação:

```jsx
<Route 
  path="/app" 
  element={
    <ProtectedRoute>
      <DashboardHome />
    </ProtectedRoute>
  } 
/>
```

Se o usuário não estiver autenticado, será redirecionado para `/login`.

## 📄 Páginas

### Home (`/`)
- Landing page institucional
- Apresentação da empresa com Lorem Ipsum
- Botão de call-to-action para login

### Login (`/login`)
- Formulário de autenticação
- Validação de campos
- Tratamento de erros
- Redirecionamento após login bem-sucedido

### Dashboard Home (`/app`)
- Página inicial da área logada
- Exibe nome do usuário
- Mensagem de boas-vindas
- Botão placeholder para futuros dashboards

## 🔧 Serviços

### `api.js`
- Configuração base do Axios
- Interceptors para adicionar token automaticamente
- Tratamento de erros 401 (token expirado)

### `auth.js`
Funções disponíveis:
- `login(username, password)` - Realizar login
- `logout()` - Limpar sessão
- `isAuthenticated()` - Verificar se está logado
- `getCurrentUser()` - Obter dados do usuário
- `getToken()` - Obter token atual

## 🎯 Próximos Passos

Este projeto está preparado para expansão. Áreas para desenvolvimento futuro:

### Dashboards
- Dashboard de agendamentos
- Dashboard financeiro
- Dashboard de clientes
- Dashboard de artistas

### Funcionalidades
- Gestão de perfil de usuário
- Upload de imagens
- Galeria de trabalhos
- Sistema de notificações

### Páginas Adicionais
- Página de recuperação de senha
- Página de cadastro (se aplicável)
- Página de configurações

## 🐛 Troubleshooting

### Erro de CORS
Se encontrar erros de CORS, configure o backend Django:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Conexão com Backend
Verifique se:
1. Backend Django está rodando
2. URL em `.env` está correta
3. Endpoint de login está acessível

### Docker não inicia
```bash
# Limpar containers e volumes
docker compose down -v

# Rebuild completo
docker compose up --build --force-recreate
```

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia servidor de desenvolvimento
npm run build      # Build de produção
npm test           # Executa testes
npm run eject      # Ejeta configuração do Create React App
```

## 🤝 Integração com Backend

### Requisitos do Backend Django

O backend deve fornecer:

1. **Endpoint de Login**
   - Método: POST
   - URL: `/api/auth/login/`
   - Body: `{ "username": "...", "password": "..." }`
   - Resposta: `{ "token": "...", "user": {...} }`

2. **Autenticação por Token**
   - Header: `Authorization: Bearer {token}`
   - Validação de token em rotas protegidas

3. **CORS habilitado**
   - Permitir origem do frontend

## 📦 Build de Produção

### Com Docker (Recomendado)
```bash
docker compose up --build
```

### Manual
```bash
npm run build
```

Os arquivos otimizados estarão em `/build`.

## 🌐 Deploy

A aplicação está pronta para deploy em:
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**
- **Servidor próprio com Nginx**

Lembre-se de configurar as variáveis de ambiente no serviço de deploy.

## 📄 Licença

Este projeto é privado e de propriedade da Mos Tattoo.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ para modernizar a gestão de estúdios de tatuagem.

---

**Versão:** 1.0.0  
**Data:** Fevereiro 2026
