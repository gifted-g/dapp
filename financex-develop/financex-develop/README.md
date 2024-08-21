# FinanceX 🚀

## Description

This project is a Node.js application built with NestJS framework. It utilizes Docker to build the application and to orchestrate containers for MongoDB, PostgreSQL, and Redis.

## Setup

Follow these steps to set up and run the project:

1. Clone the repository:

   ```bash
   git clone https://github.com/Ethical-Ralph/financex.git
   cd financex
   ```

2. Create a `.docker-compose.env` file in the root directory of the project:

   ```bash
   touch .docker-compose.env
   ```

3. Populate the `.docker-compose.env` file with the following environment variables:

   ```plaintext
   POSTGRES_DB=desired_default_db
   POSTGRES_USER=desired_default_user
   POSTGRES_PASSWORD=desired_default_password
   MONGODB_ROOT_USER=desired_default_user
   MONGODB_ROOT_PASSWORD=desired_default_password
   MONGODB_DATABASE_NAME=desired_default_db
   SERVER_PORT=desired_server_port
   ```

4. Build and run the containers using Docker Compose:
   ```bash
   docker compose --env-file .docker-compose.env up --build
   ```

## Dependencies

The project dependencies are managed through Docker, eliminating the need for manual installation. The following dependencies are included:

- Node.js
- NestJS
- Docker
- MongoDB
- PostgreSQL
- Redis

## Usage

- Once the containers are up and running, you can access the application at `http://{ip}:{SERVER_PORT}`.

## API Documentation

You can find the detailed API documentation using Postman [here](https://documenter.getpostman.com/view/25518294/2sA35Bc55Z).

## Test

Unit test were written to cover only critical logic
Intall [yarn](https://classic.yarnpkg.com/lang/en/docs/install) on machine

```bash
# install packages to local machine
$ yarn install

# unit tests
$ yarn test


# test coverage
$ yarn test:cov
```

## Implementation Details:

- The order curation process, documented [here](https://documenter.getpostman.com/view/25518294/2sA35Bc55Z#5fe7718b-9c4c-4dab-a7ab-9f1cf40dff30), implements logging transactions to mongodb and sending order tax information using a queue that supports retries in case of failure.

#### Endpoints of interest:

- **1:** Get a business's credit score. ([Documentation](https://documenter.getpostman.com/view/25518294/2sA35Bc55Z#987dc5d6-1c96-4cce-9a25-e1a23817b7e8))
- **2:** Retrieve order details for a business, including total number and amount of orders, both overall and for today. ([Order details](https://documenter.getpostman.com/view/25518294/2sA35Bc55Z#39bef76d-251c-47ad-bb75-18a05f9db2d8)) ([Business order stats](https://documenter.getpostman.com/view/25518294/2sA35Bc55Z#e71cbceb-b567-4727-9118-2b4084a67444))

#### Implementation Overview:

- **Credit Score Calculation:**

  - The credit score calculation process employs a dual approach, utilizing both a cron and a queue. At midnight, a cron fetches businesses in batches, employing efficient memory management techniques, and dispatches them to a queue for further processing. The queue retrieves the business transactions in batches, handles the score computation and update business record accordingly.
  - Additionally, to prevent redundant processing when multiple instance of the server is deployed, a distributed lock mechanism using Redis is employed by the cron. Using a queue based system complements the cron and enables the system to scale efficiently to handle computations for a greater number of businesses in a timely manner. This scalability can be achieved by adding more workers to the system.

    <br>

- **Get Business Order:**
  Pagination is implemented to improve response time, allowing `page` and `limit` to be passed as request queries

  <br>

- **Get Business Stats:**
  This endpoint computes order information (total number and amount of orders, both overall and for today) and stores it in the cache. proper cache invalidation technique was implemented to remove stale data.

## Monitoring

You can monitor the queues by visiting the URL `http://{ip}:{SERVER_PORT}/admin/queues`. This provides real-time tracking of the status and performance of the jobs in the queues.

Please note that you will be prompted to enter the username: "admin" and the password: "password" to access the monitoring interface.
