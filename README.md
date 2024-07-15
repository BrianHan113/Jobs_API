# Jobs_API

NESTful JSON Job API made with Express.js and MongoDB/Mongoose that supports all CRUD operations. Allows existing users to add and edit their job prospects by passing through the company name and position, with a status property (set to pending by default). Uses JWT for user authentication (Register/Login), and bcrypt for salt & hashing passwords for secure storage on the database. Includes Swagger documentation.

## Getting Started

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/Jobs_API.git
    cd Jobs_API
    ```

2. Replace `.env_PLACEHOLDER` with `.env`, and fill out relevant variables.

3. Install dependencies:
    ```sh
    npm install
    ```

### Running the API

Start the server:
```sh
npm start
```
