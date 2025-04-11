# MCP Pushbullet

An MCP (Message Control Protocol) service that allows sending notifications via Pushbullet.

## Features

- Send notifications via Pushbullet
- Simple and intuitive REST API
- Support for notifications with custom title and message
- Customizable notification status (success, error, etc.)
- Easy integration with Cursor IDE

## Prerequisites

- Node.js (version 14 or higher)
- A Pushbullet account with an access token

## Installation

### As a global npm package
```bash
npm install -g @oliviermattei/mcp-pushbullet
```

### As a local dependency
```bash
npm install @oliviermattei/mcp-pushbullet
```

### From source
1. Clone the repository:
```bash
git clone https://github.com/oliviermattei/mcp-pushbullet.git
cd mcp-pushbullet
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node index.js --access-token YOUR_PUSHBULLET_TOKEN
```

## Usage

### Command Line
```bash
mcp-pushbullet --access-token YOUR_PUSHBULLET_TOKEN
```

### Cursor Integration
Add the following configuration to your Cursor settings:

```json
"pushbullet": {
  "command": "npx",
  "args": [
    "-y",
    "@oliviermattei/mcp-pushbullet@latest",
    "--access-token",
    "YOUR_PUSHBULLET_TOKEN"
  ]
}
```

### API Endpoints

#### Send a notification
```
POST /notify
```

Request body:
```json
{
  "title": "Notification title",
  "message": "Notification message",
  "status": "success" // Optional, possible values: success, error, warning
}
```

#### Check service status
```
GET /health
```

## Configuration

The server listens on port 9876 by default. You can change this port by setting the `PORT` environment variable.

## Publishing

To publish a new version to npm:

1. Update the version in package.json
2. Commit your changes
3. Run:
```bash
npm publish
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request. 