FROM node:latest
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM node:latest
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
# COPY pm2.config.js ./
COPY views ./views
COPY src ./src
COPY .env ./
COPY data ./data
RUN npm install --only=production
# RUN npm install
# RUN npm run build
COPY --from=0 /usr/build /usr/build
# RUN npm install pm2@latest -g
EXPOSE 4242
# RUN ls -a
# RUN ls -a views
# RUN cat /usr/build/index.js
# CMD ["pm2-runtime", "start", "pm2.config.js"]
CMD ["npm", "start"]