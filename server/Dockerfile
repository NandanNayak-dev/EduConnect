# Use Node.js base image with Debian (which has apt-get)
FROM node:18-bullseye

# Install Java, Python, and GCC for the code execution playground
RUN apt-get update && \
    apt-get install -y default-jdk python3 gcc g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Link python3 to python just in case
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "start" ]
