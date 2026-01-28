# Dynamic API Server

A Node.js backend server using Express that allows dynamic calling of external APIs. This server acts as a proxy to make API requests on behalf of clients, handling different HTTP methods, headers, and payloads.

## Features

- Dynamic API calling via POST endpoint with fixed base URL and headers
- Support for GET, POST, PUT, PATCH, DELETE methods
- Custom headers (merged with defaults) and request bodies
- CORS enabled for cross-origin requests
- Error handling and response forwarding

## Installation

1. Navigate to the backend directory:
   ```bash
   cd f:\ConvertClicks\backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Starting the Server

For production:
```bash
npm start
```

For development (with auto-restart):
```bash
npm run dev
```

The server will run on port 3000 by default, or the port specified in the `PORT` environment variable.

### API Endpoint

**POST /api/call**

Make a request to this endpoint with a JSON body containing the API details. The server uses a fixed base URL (`https://gordiehowesportscomplex.perfectmind.com/api/2.0/B2C/`) and default headers.

#### Request Body Parameters

- `path` (optional): The API endpoint path (e.g., 'Query'). Defaults to 'Query'
- `method` (optional): HTTP method (GET, POST, PUT, PATCH, DELETE). Defaults to POST
- `headers` (optional): Object containing additional request headers (merged with defaults)
- `data` (optional): Request body data (for POST, PUT, PATCH methods)

#### Default Headers

- `X-Access-Key`: VF7qyggCjBShOBrTP4O7nkzyXHVbeY37
- `X-Client-Number`: 39548

#### Response

Returns a JSON object with:
- `status`: HTTP status code
- `statusText`: HTTP status text
- `headers`: Response headers
- `data`: Response data

#### Example Usage

Using curl:

```bash
curl -X POST http://localhost:3000/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "QueryString": "SELECT TOP 10 * FROM Custom.CalendarEvent WHERE StartTime = '\''2026-01-01T00:00:00'\'' ORDER BY StartTime DESC"
    }
  }'
```

Or using JavaScript (fetch):

```javascript
fetch('http://localhost:3000/api/call', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data: {
      QueryString: "SELECT TOP 10 * FROM Custom.CalendarEvent WHERE StartTime = '2026-01-01T00:00:00' ORDER BY StartTime DESC"
    }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Health Check

**GET /health**

Returns server status.

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Security Considerations

- This server acts as a proxy and will make requests to any URL provided. In production, implement authentication and URL whitelisting.
- Be cautious with sensitive headers or data.
- Consider rate limiting to prevent abuse.

## Troubleshooting

- Ensure all dependencies are installed with `npm install`.
- Check that the server is running on the correct port.
- Verify that the external API URL is accessible and correct.
- For CORS issues, ensure the client is making requests to the correct origin.

## Dependencies

- [Express](https://expressjs.com/): Web framework for Node.js
- [Axios](https://axios-http.com/): HTTP client for making requests
- [CORS](https://www.npmjs.com/package/cors): Middleware for enabling CORS# cc_booking_backend
