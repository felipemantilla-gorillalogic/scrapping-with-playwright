# Drive Scanner

## Description
This project is a simple Express-based server that allows users to save and retrieve objects using a unique ID. The data is stored in a JSON file, making it easy to manage and access.

## Features
- Save objects with a unique ID.
- Retrieve objects by their ID.
- Data is stored in a JSON file for easy access and management.
- Simple RESTful API for interaction.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/felipemantilla-gorillalogic/scrapping-with-playwright
   cd scrapping-with-playwright
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the server, run:
```bash
npm run dev:drive-scanner
```

The server will be running at `http://localhost:3001`.

### API Endpoints

- **POST /drive-scanner**
  - Saves an object with a unique ID.
  - **Request Body**: 
    ```json
    {
      "id": "unique_id",
      "data": { ... } // Your object data here
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Object saved successfully",
      "id": "unique_id"
    }
    ```

- **GET /drive-scanner/:id**
  - Retrieves an object by its ID.
  - **Response**:
    ```json
    {
      "itemOnStorage": true,
      "id": "unique_id",
      "data": { ... } // Your object data here
    }
    ```
  - If the object is not found:
    ```json
    {
      "id": "unique_id",
      "itemOnStorage": false
    }
    ```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. Ensure to follow coding standards and include tests for any new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.