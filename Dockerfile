FROM node:20

WORKDIR /api

# This is not ideal, but it works
COPY ./ ./

CMD ["node", "./src/server.js"]
