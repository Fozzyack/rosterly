# frontend/Dockerfile

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
COPY package.json bun.lock ./
RUN bun install 

COPY . .

# [optional] tests & build
# RUN bun test
 RUN bun run build

# run the app
ENTRYPOINT [ "bun", "run", "start" ]
