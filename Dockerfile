FROM node:10-alpine as build

COPY . .

RUN apk --no-cache add git && \
    npm install && \
    npm run build:prod

FROM nginx:mainline-alpine

LABEL maintainer="ops@pleroma.social" \
    org.opencontainers.image.title="pleroma-adminfe" \
    org.opencontainers.image.description="Pleroma-adminfe for Docker" \
    org.opencontainers.image.authors="ops@pleroma.social" \
    org.opencontainers.image.vendor="pleroma.social" \
    org.opencontainers.image.documentation="https://git.pleroma.social/pleroma/pleroma-adminfe" \
    org.opencontainers.image.licenses="AGPL-3.0" \
    org.opencontainers.image.url="https://pleroma.social" \
    org.opencontainers.image.revision=$VCS_REF \
    org.opencontainers.image.created=$BUILD_DATE


ARG DATA=/usr/share/nginx/html

COPY --from=build /dist/ ${DATA}

COPY ./docker/docker-entrypoint.sh /usr/local/bin/

COPY ./docker/nginx.conf.tpl /etc/nginx/nginx.conf.tpl

RUN apk add --no-cache gettext

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD exec nginx -g 'daemon off;'

