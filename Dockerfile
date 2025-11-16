FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set a dummy DATABASE_URL for Prisma generation during build
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medical_referral?schema=public
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]