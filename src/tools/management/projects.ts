import { z } from "zod";
import { openfortRequest } from "../../utils/api.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MyMCP } from "../..";

export function register(server: McpServer, agent: MyMCP, props: {
  accessToken: string;
  refreshToken: string;
  projectId: string;
  clientId: string;
}) {
  server.tool(
    "list-projects",
    "Lists all the user's projects",
    {},
    async () => openfortRequest(props, { endpoint: "/projects" })
  );

  server.tool(
    "get-project",
    "Get a project by ID",
    { 
      projectId: z.string().describe("The unique identifier of the project to retrieve") 
    },
    async ({ projectId }) => openfortRequest(props, { endpoint: `/projects/${projectId}` })
  )

  server.tool(
    "create-project",
    "Creates a new project",
    { 
      name: z.string().min(1).describe("The name of the new project to create") 
    },
    async ({ name }) => openfortRequest(props, { endpoint: "/projects", method: "POST", body: { name } })
  );

  server.tool(
    "select-project",
    "Selects a project based on its ID, sets it as active and stores its secret API key for further calls.",
    { 
      projectId: z.string().describe("The unique identifier of the project to select and activate") 
    },
    async ({ projectId }) => {
      try{
        const response = await openfortRequest(props, { endpoint: `/projects/${projectId}` })
        const data = JSON.parse(response.content[0].text);
        const apiSecret = data.apikeys.find((key: any) => key.name === "sk")?.token
        if (!apiSecret) {return {content: [{text: "No matching project was found", type: "text"}]}}
        await agent.setState({
          apiSecret: `sk_test_${apiSecret}`,
          activeProject: projectId,
        });
        return {
          content: [{ text: `Selected project ${projectId}`, type: "text" }],
        };
      } catch (error) {
        return {content: [{text: "Failed to select project: " + error, type: "text"}]}
      }
    }
  );

  server.tool(
    "show-selected-project",
    "Displays the agent's currently selected project and stored API secret.",
    {},
    async () => {
      const { activeProject, apiSecret } = agent.state;
      return {
        content: [
          {
            text: JSON.stringify({ activeProject, apiSecret }, null, 2),
            type: "text",
          },
        ],
      };
    }
  );

  server.tool(
    "deselect-project",
    "Clears the active project and associated API secret from the agent state.",
    {},
    async () => {
      await agent.setState({ activeProject: null, apiSecret: null });
      return {
        content: [{ text: "Project deselected", type: "text" }],
      };
    }
  );
}