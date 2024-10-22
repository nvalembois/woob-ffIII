FROM docker.io/library/python:3.13.0-alpine3.20

# Mettre à jour le magasin de certificats CA
COPY leno.crt /usr/local/share/ca-certificates/leno.crt
RUN set -e && \
  apk --no-cache add ca-certificates && \
  update-ca-certificates
ENV SSL_CERT_DIR=/etc/ssl/certs


RUN set -e && \
  install -d -m 0755 /venv /app

WORKDIR /venv

COPY requirements.txt /

RUN set -e && \
  chmod 0644 /requirements.txt && \
  python3 -m venv api

ENV PATH=/venv/api/bin:/usr/local/bin:/bin:/usr/bin
ENV VIRTUAL_ENV=/venv/api
ENV PS1="(venv) \\w \\$"

RUN pip install --no-cache-dir --compile --prefer-binary -r /requirements.txt 

COPY src/app/ /app/

USER 101
