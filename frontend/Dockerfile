FROM node:lts-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL

# We only copy package files first
COPY package*.json ./

# Install dependencies inside the container
RUN npm install --frozen-lockfile

# Copy the rest of the code (respecting .dockerignore)
COPY . .

RUN NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL npm run build

EXPOSE 3000

CMD ["npm", "start"]