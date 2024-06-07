FROM node:18.20.3-alpine3.20

WORKDIR /root/frontend

ADD ./src /root/frontend/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
