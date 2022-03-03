FROM node:16-alpine3.14

ENV DOMAIN=your_domain
ENV APPID=your_appid
ENV TOKEN=your_token

WORKDIR /home/idp
COPY . .

EXPOSE 3000
ENTRYPOINT [ "node", "index.js" ]