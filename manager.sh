#!/bin/bash
set -e

CONTAINER_NAME="mos_tattoo_frontend"
SERVICE_NAME="frontend"

usage() {
    echo "Uso: ./manage.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  up      - Inicia os containers (build + detach)"
    echo "  down    - Para e remove os containers"
    echo "  logs    - Acompanha os logs em tempo real"
    echo "  sh      - Acessa o shell do container (Alpine)"
    echo "  restart - Reinicia o serviço"
    echo "  clean   - Remove containers, volumes e imagens órfãs"
    echo ""
}

case "$1" in
    up)
        # Verifica se existe .env, senão cria a partir do exemplo (se houver)
        if [ ! -f .env ] && [ -f .env.example ]; then
            cp .env.example .env
            echo "✓ Arquivo .env criado a partir de .env.example"
        fi
        
        echo "Calculando build e subindo containers..."
        docker compose up -d --build
        echo ""
        echo "✓ Frontend disponível em: http://localhost:3000"
        ;;
    down)
        echo "Parando containers..."
        docker compose down
        ;;
    logs)
        docker compose logs -f
        ;;
    sh)
        # Nginx Alpine usa sh, não bash
        docker compose exec $SERVICE_NAME sh
        ;;
    restart)
        docker compose restart $SERVICE_NAME
        ;;
    clean)
        echo -n "ATENÇÃO: Isso removerá containers e volumes. Continuar? (y/N): "
        read -r confirm
        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            docker compose down -v --remove-orphans
            echo "✓ Limpeza concluída."
        else
            echo "Operação cancelada."
        fi
        ;;
    *)
        usage
        exit 1
        ;;
esac
