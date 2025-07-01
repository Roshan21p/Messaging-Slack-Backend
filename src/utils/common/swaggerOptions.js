import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { BACKEND_URL, NODE_ENV } from '../../config/serverConfig.js';

// Recreate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Join path manually — works with glob pattern (*.js)
const pathToRoutesFile = path.join(__dirname, '../../routes/v1/*.js');

const servers =
  NODE_ENV === 'production'
    ? [{ url: BACKEND_URL }]
    : [{ url: 'http://localhost:3000/api/v1' }];

console.log(servers);

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Messaging-Slack API',
      version: '1.0.0',
      description: `
    Messaging-Slack is a full-featured backend API built with Node.js and Express, inspired by the core functionality of Slack.

    ### It provides endpoints for::
    -  **User Authentication & Management**: Secure login and registration system.
    -  **Workspace & Channel Creation**: Create and manage workspaces and channels.
    -  **Real-Time Messaging**: Send and receive messages instantly using WebSockets (Socket.IO).
    -  **Direct Messaging (DMs)**: One-to-one private messaging between users.
    -  **Socket Integration**: Real-time typing indicators, message delivery events, and presence tracking.
    
    This API follows REST principles and is documented using Swagger (OpenAPI 3.0), making it easy to test and integrate with frontend applications.
  `
    },
    servers,
    components: {
      securitySchemes: {
        AccessTokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-access-token'
        }
      }
    },
    security: [
      {
        AccessTokenAuth: []
      }
    ]
  },
  apis: [pathToRoutesFile]
};
