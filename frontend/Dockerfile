FROM node:lts-alpine

WORKDIR /app

# We only copy package files first
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the code (respecting .dockerignore)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]