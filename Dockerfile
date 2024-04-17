FROM node@sha256:162d92c5f1467ad877bf6d8a098d9b04d7303879017a2f3644bfb1de1fc88ff0 as base

FROM base as build
WORKDIR /usr/project
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=src/,target=src/ \
    npm run compile

FROM base as deploy
ENV NODE_ENV=production
WORKDIR /usr/project
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
VOLUME /usr/project/build/
COPY --from=build /usr/project/build/ build/
EXPOSE 8080
ENTRYPOINT ["npm"]
CMD ["exec", "http-server", "build"]
