import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { BACKEND_URL } from '../../config/serverConfig.js';

// Recreate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Join path manually — works with glob pattern (*.js)
const pathToRoutesFile = path.join(__dirname, '../../routes/v1/*.js');

const servers = [{ url: BACKEND_URL }];

console.log(servers);

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Messaging-Slack API',
      version: '1.0.0',
      description: `
    Messaging-Slack is a full-featured backend API built with Node.js and Express, inspired by the core functionality of Slack.


Before using the API endpoints, ensure the server is connected to the MongoDB database.  
Visit: \`https://messaging-slack-backend.onrender.com/connect-db\` endpoint to initiate the database connection (only required if not connected automatically).


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
