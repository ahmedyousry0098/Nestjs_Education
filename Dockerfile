FROM node:18.13.0

WORKDIR /app

COPY package.json .

COPY tsconfig*.json .

RUN npm install 

COPY . .

RUN npm install -g @nestjs/cli

EXPOSE 3000

CMD ["nest", "start"]