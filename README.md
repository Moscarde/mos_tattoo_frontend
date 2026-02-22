# Template-Based BI Distribution | Rendering Layer (Frontend)

Este projeto é a **camada de renderização** do ecossistema [Template-Based BI Distribution](https://github.com/Moscarde/Template-Based-BI-Distribution) — uma interface agnóstica que interpreta payloads de metadados enviados pelo backend e constrói visualizações analíticas em tempo real, sem conhecimento prévio do domínio de dados exibido.

> 🔗 **Repositório Central**: Para entender o contexto completo da arquitetura, acesse o [repositório principal](https://github.com/Moscarde/Template-Based-BI-Distribution).

---

## 🚀 Como Rodar o Projeto

A execução é totalmente containerizada via Docker, garantindo consistência entre ambientes.

### Opção 1: Via Script Facilitador (Recomendado)

```bash
# Dar permissão de execução (caso necessário)
chmod +x manager.sh

# Iniciar a aplicação
./manager.sh start

# Parar a aplicação
./manager.sh stop

# Ver logs
./manager.sh logs
```

### Opção 2: Via Docker Compose

```bash
# Subir os containers
docker compose up -d

# Derrubar os containers
docker compose down
```

Após iniciar, o frontend estará acessível em: `http://localhost:3000`

---

## 🎯 Funcionalidades Principais

- **Renderização Orientada a Metadados**: O frontend não possui lógica de domínio. Os dados, tipos de gráfico e filtros são definidos pelo backend — o cliente apenas interpreta e renderiza.
- **Autenticação Segura**: Login integrado com JWT para proteção das rotas de dados.
- **Perfis de Acesso Diferenciados**: A interface adapta o que é exibido conforme o perfil do usuário autenticado (Admin, Gerente Geral ou Gerente de Unidade).
- **Visualizações Dinâmicas**: Utiliza `Recharts` para construir gráficos a partir dos payloads recebidos, sem configuração estática por dashboard.
- **Filtragem Contextual**: Componentes de filtro (período e outros critérios) operam sobre os parâmetros definidos pelo template de cada instância.
- **Design Responsivo**: Interface adaptada para desktop e mobile.

---

## 📚 Documentação Técnica

Para detalhes aprofundados sobre a implementação, consulte a pasta `docs/`:

- [**Gráficos e Componentes (CHARTS.md)**](docs/CHARTS.md): Tipos de visualizações suportadas e estrutura dos payloads esperada pelo frontend.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| Framework | React (Vite) |
| Visualização de Dados | Recharts |
| Integração API | Axios |
| Infraestrutura | Docker & Nginx |