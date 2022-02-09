FROM node:current
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM node:current
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY views ./views
COPY src ./src
COPY .env ./
COPY data ./data
RUN npm install --only=production
COPY --from=0 /usr/build /usr/build
EXPOSE 4242
CMD ["npm", "start"]