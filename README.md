# Inspect'em Cars

Exploration of an express api-gateway that fronts multiple gRPC services + nats server

## Getting Started

### Development

This assumes you have `docker` and `docker-compose` installed.

First and foremost, from the project root:
```
docker-compose up
```

This should provide you the 2 postgres instances and a nats server

#### Environment Variables

On the environment variables, I used `direnv` to automate the loading and unloading of the project environment variables.

With `direnv`, create a `.envrc` at each services:

```
set -a
...
...
set +a
```

#### API-Gateway

Api-gateway is the gateway to the grpc services.

Required environment variables and sample values:

```
GRPC_SERVER_IP=0.0.0.0
LOCATION_PORT=50051
INSPECTION_PORT=50052
```

From project root
```shell
cd /api-gateway
npm i
npm run dev
```

#### Inspection

Inspection service is responsible for handling all the appointments. As of writing, only creation is implemented.

Required environment variables and sample values:

```
SERVER_IP=0.0.0.0
SERVER_PORT=50052
LOCATION_PORT=50051
INSPECTION_DB_URL=postgres://postgres@0.0.0.0:5433/postgres
NATS_SERVER_URL=localhost:4222
```

From project root
```shell
cd /api-gateway
npm i
npx db-migrate up
npm run dev
```

#### Location

Location service is responsible for handling the available locations and their respective availability.

The availability a inspection centre is represented with an array of timeslots:
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2] for weekdays
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4] for saturday

The first index refers to 9am on the day, and subsequent indeces are an increment of 30minutes up to 6pm on the same day.

The values in the array represent the number of availability within the same time.

Therefore, an array as the following represents that at 9am that day, there are 4 availabilities, up to 4 appointments can be created with inspection service, and no availabilities at 9.30am, 1 availability at 10am and so on.

[4,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2]

Required environment variables and sample values:

```
SERVER_IP=0.0.0.0
SERVER_PORT=50051
LOCATION_DB_URL=postgres://postgres@0.0.0.0:5432/postgres
NATS_SERVER_URL=localhost:4222
```

From project root
```shell
cd /api-gateway
npm i
npx db-migrate up
npm run dev
```