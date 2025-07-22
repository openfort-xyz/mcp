import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MyMCP } from "../..";
import Openfort from "@openfort/openfort-node";

export function register(server: McpServer, agent: MyMCP, props: {
  accessToken: string;
  refreshToken: string;
  projectId: string;
  clientId: string;
}) {
  server.tool(
    "create-user",
    "Creates a new user in the project",
    {
      name: z.string().optional().describe("The user's name"),
      description: z.string().optional().describe("A description for the user"),
      metadata: z.record(z.any()).optional().describe("Custom metadata to associate with the user")
    },
    async ({ name, description, metadata }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const user = await openfort.players.create({
          name,
          description,
          metadata
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(user, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error creating user: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "get-user",
    "Get detailed information about a specific user in the project",
    {
      id: z.string().describe("The unique user identifier")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const user = await openfort.players.get({ id });
        return {
          content: [{ type: 'text', text: JSON.stringify(user, null, 2) }]
        };
      } catch (error) {
        console.error('Error getting user:', error);
        return {
          content: [{ type: 'text', text: `Error getting user: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "list-users",
    "Get the users in the project with optional filtering and pagination",
    {
      limit: z.number().optional().describe("The maximum number of users to return"),
      skip: z.number().optional().describe("Specifies the offset for the first records to return"),
      order: z.enum(["asc", "desc"]).optional().describe("The order in which to return the users"),
      name: z.string().optional().describe("Filter users by name"),
      // expand: z.array(z.enum(["accounts"])).optional()
        // .describe("The fields to expand in the response object (can be 'accounts')")
    },
    async ({ limit, skip, order, name }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const users = await openfort.players.list({
          limit,
          skip,
          order,
          name,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(users, null, 2) }]
        };
      } catch (error) {
        console.error('Error listing users:', error);
        return {
          content: [{ type: 'text', text: `Error listing users: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "update-user",
    "Update an existing user's information",
    {
      id: z.string().describe("The unique user identifier"),
      name: z.string().optional().describe("The user's new name"),
      description: z.string().optional().describe("A new description for the user"),
      metadata: z.record(z.any()).optional().describe("Custom metadata to update for the user")
    },
    async ({ id, name, description, metadata }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const user = await openfort.players.update({
          id,
          name,
          description,
          metadata
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(user, null, 2) }]
        };
      } catch (error) {
        console.error('Error updating user:', error);
        return {
          content: [{ type: 'text', text: `Error updating user: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "delete-user",
    "Delete a user from the project",
    {
      id: z.string().describe("The unique user identifier to delete")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const result = await openfort.players.delete(id);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        console.error('Error deleting user:', error);
        return {
          content: [{ type: 'text', text: `Error deleting user: ${error}` }]
        };
      }
    }
  );
}