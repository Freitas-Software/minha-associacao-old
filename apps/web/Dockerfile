# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.18.0

FROM node:${NODE_VERSION}-bookworm-slim AS tools
ARG PNPM_VERSION=11.12.0
ARG TURBO_VERSION=2.10.4
ENV PNPM_HOME=/pnpm
ENV PATH=${PNPM_HOME}:${PATH}
WORKDIR /repo
RUN npm install --global "pnpm@${PNPM_VERSION}" "turbo@${TURBO_VERSION}" \
	&& npm cache clean --force

FROM tools AS pruner
COPY . .
RUN turbo prune @minha-associacao/web --docker

FROM tools AS builder
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=${VITE_API_URL}
COPY --from=pruner /repo/out/json/ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=pruner /repo/out/full/ ./
RUN turbo run build --filter=@minha-associacao/web...

FROM node:${NODE_VERSION}-bookworm-slim AS runner
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY --from=builder --chown=node:node /repo/apps/web/.output ./.output
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
	CMD ["node", "-e", "fetch('http://127.0.0.1:' + process.env.PORT + '/').then(response => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"]
CMD ["node", ".output/server/index.mjs"]
