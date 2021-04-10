# Per Diem - Shopping flow experience


## Subscription never been easier


### Configurations
- All configurations are set in Terraform config under `github.com/PerDiemInc/terraform-production`

### Database
- Make sure docker is installed.
- Create postgresql as a docker container `npm run docker:db`
- Run Migrations `npm run db:migrate`
- Seed the database `npm run db:seed`


### Code
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


## Docker Compose
- `npm run docker-compose up -d`
- Make sure to run migration. You can do it by running `docker ps -a` and get get the container id.
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
9fa13df078e1        postgres:11.5       "docker-entrypoint.s…"   9 minutes ago       Up 9 minutes        0.0.0.0:5432->5432/tcp   db
54f4fd1d0c87        shop_web            "docker-entrypoint.s…"   9 minutes ago       Up 9
minutes        0.0.0.0:3000->3000/tcp   shop_web_1

** In this example the container id `54f4fd1d0c87`
```
- "SSH" to the container `docker exec -it <container id> sh
- Run migration `/opt/app # NODE_ENV=production PG_URL=postgres://postgres:pass123@db:5432/perdiem npm run db:migrate`
- Run the seed files: `/opt/app # NODE_ENV=production PG_URL=postgres://postgres:pass123@db:5432/perdiem npm run db:seed`
- You're good to go, checkout localhost:3000

