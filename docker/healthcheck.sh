#!/bin/sh
# ===============================================
# Health Check Script - MiApp Segura
# Script para verificar el estado de la aplicación
# ===============================================

set -e

# Configuración
HOST="localhost"
PORT="8080"
TIMEOUT="5"
HEALTH_ENDPOINT="/health"
APP_ENDPOINT="/"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - HEALTHCHECK: $1"
}

# Función para verificar si el puerto está abierto
check_port() {
    if nc -z $HOST $PORT 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Función para verificar el endpoint de salud
check_health_endpoint() {
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time $TIMEOUT \
        --connect-timeout $TIMEOUT \
        http://$HOST:$PORT$HEALTH_ENDPOINT 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        return 0
    else
        log "Health endpoint returned status: $response"
        return 1
    fi
}

# Función para verificar la aplicación principal
check_app_endpoint() {
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time $TIMEOUT \
        --connect-timeout $TIMEOUT \
        http://$HOST:$PORT$APP_ENDPOINT 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        return 0
    else
        log "App endpoint returned status: $response"
        return 1
    fi
}

# Función para verificar el proceso nginx
check_nginx_process() {
    if pgrep nginx > /dev/null; then
        return 0
    else
        log "Nginx process not found"
        return 1
    fi
}

# Función principal de health check
main() {
    log "Starting health check..."
    
    # Verificar proceso nginx
    if ! check_nginx_process; then
        log "${RED}FAIL: Nginx process not running${NC}"
        exit 1
    fi
    
    # Verificar puerto
    if ! check_port; then
        log "${RED}FAIL: Port $PORT is not accessible${NC}"
        exit 1
    fi
    
    # Verificar endpoint de salud
    if ! check_health_endpoint; then
        log "${YELLOW}WARN: Health endpoint not responding properly${NC}"
        # Continuar con la verificación de la app principal
    fi
    
    # Verificar aplicación principal
    if ! check_app_endpoint; then
        log "${RED}FAIL: Application endpoint not responding${NC}"
        exit 1
    fi
    
    log "${GREEN}SUCCESS: All health checks passed${NC}"
    exit 0
}

# Manejo de señales
trap 'log "Health check interrupted"; exit 1' INT TERM

# Ejecutar función principal
main "$@"