# Dockerfile Ultra Simple - MiApp Segura React

FROM node:25-alpine AS builder

WORKDIR /app

# Copiar todo
COPY . .

# Instalar solo dependencias de producción primero
RUN npm ci --only=production

# Instalar dependencias de desarrollo necesarias para el build
RUN npm install react-scripts --save-dev

# Build directo con react-scripts (evitando npm scripts)
RUN npx react-scripts build

# Stage de producción
FROM nginx:alpine

# Configuración mínima de nginx
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiar archivos
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]