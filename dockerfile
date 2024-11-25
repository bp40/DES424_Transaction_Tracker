FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .
COPY prisma ./prisma/

EXPOSE 3000
EXPOSE 5432

# For test purposes
ENV NEXT_PUBLIC_SKIP_LINT=true
ENV NEXT_TYPE_CHECK=false

RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "start"]