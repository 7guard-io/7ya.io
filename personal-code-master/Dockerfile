FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server.js ./
COPY context/ ./context/
COPY scripts/ ./scripts/

USER node

ENTRYPOINT ["node", "server.js"]
