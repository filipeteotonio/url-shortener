# Zippia Skill Assessment

## Dependencies

To install the dependencies, run the command: `npm install`

## Starting the app

Use `npm start` to run the application

## APIs

**POST /shorten**

    Request Body:

        longUrl (string): Required. The long URL to be shortened.

    Response:

        shortUrl (string): The shortened URL.

    Errors:
        400: URL is required.

    Example: curl   --location --request POST 'http://localhost:3000/shorten' \
                    --header 'Content-Type: application/json' \
                    --data-raw '{
                        "longUrl": "www.example.com;this-is-a-test"
                     }'

**GET /long**

    Request Parameter:

        shortUrl (string): Required. The short URL to be queried.

    Response:

        longUrl (string): The long URL associated with the given short URL.

    Errors:
        400: URL is required.

    Example: curl --location --request GET 'http://localhost:3000/long?shortUrl=www.us.com/QxCpsGBO88x'

    Obs: You should always encode the query string in order to avoid sending requests with special characters like: '+' or '='

## Configuration

In the `.env` file you can specify the mongo database url by setting the `MONGO_URL` variable, as well as the expiration for the URLs by setting the `SHORT_URL_EXPIRATION_HOURS` variable.

## Comments

In regards to the horizontal scaling of the project, I chose to use PM2 (Process Manager for Node) instead of native Node.js clustering for two main reasons. Firstly, PM2 does not require us to modify our code, whereas using native clustering would require modifications to the codebase. Secondly, PM2 offers a lot of abstractions that would otherwise be manual work with native clustering, such as handling failing workers. Overall, PM2 provides a more convenient and streamlined way of managing our Node.js applications.

The project is started with PM2 and it will spawn as many processes as there are cores in the machine.
