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
    "create-contract",
    "Creates a new smart contract in the project",
    {
      name: z.string().describe("Specifies the name of the contract (Only for display purposes)."),
      chainId: z.number().describe("Specifies the chain ID of the contract. Must be a supported chain."),
      address: z.string().describe("Specifies the address of the contract."),
      abi: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          anonymous: z.boolean().optional(),
          payable: z.boolean().optional(),
          constant: z.boolean().optional(),
          stateMutability: z.string().optional(),
          gas: z.string().optional(),
          inputs: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
            })
          ).optional(),
          outputs: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
            })
          ).optional(),
        })
      ).optional().describe("Specifies the ABI of the contract."),
      publicVerification: z.boolean().optional().describe("Specifies whether to verify the contract publicly.")
    },
    async ({ name, chainId, address, abi, publicVerification }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const contract = await openfort.contracts.create({
          name,
          chainId,
          address,
          abi,
          publicVerification
        });
        return {
          content: [{
            type: 'text',
            text: `Contract created successfully!\n\n` +
                  `Full contract details:\n${JSON.stringify(contract, null, 2)}`
          }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error creating contract: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "get-contract",
    "Get detailed information about a specific contract in the project",
    {
      id: z.string().describe("The unique contract identifier")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const contract = await openfort.contracts.get({ id });
        return {
          content: [{ type: 'text', text: JSON.stringify(contract, null, 2) }]
        };
      } catch (error) {
        console.error('Error getting contract:', error);
        return {
          content: [{ type: 'text', text: `Error getting contract: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "list-contracts",
    "Get the contracts in the project with optional filtering and pagination",
    {
      limit: z.number().optional().describe("The maximum number of contracts to return"),
      skip: z.number().optional().describe("Specifies the offset for the first records to return."),
      order: z.enum(["asc", "desc"]).optional().describe("The order in which to return the contracts"),
      name: z.string().optional().describe("Specifies the name of the contract."),
      deleted: z.boolean().optional().describe("Specifies whether to include deleted contracts."),
      chainId: z.number().optional().describe("The chain ID of the contract."),
      address: z.string().optional().describe("Specifies the address of the contract."),
    },
    async ({ limit, skip, order, name, deleted, chainId, address }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const contracts = await openfort.contracts.list({
          limit,
          skip,
          order,
          name,
          deleted,
          chainId,
          address,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(contracts, null, 2) }]
        };
      } catch (error) {
        console.error('Error listing contracts:', error);
        return {
          content: [{ type: 'text', text: `Error listing contracts: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "update-contract",
    "Update an existing contract's information",
    {
      id: z.string().describe("Specifies the unique contract ID."),
      name: z.string().optional().describe("Specifies the name of the contract (Only for display purposes)."),
      chainId: z.number().optional().describe("Specifies the chain ID of the contract. Must be a supported chain."),
      deleted: z.boolean().optional().describe("Specifies whether to delete the contract."),
      address: z.string().optional().describe("Specifies the address of the contract."),
      abi: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          anonymous: z.boolean().optional(),
          payable: z.boolean().optional(),
          constant: z.boolean().optional(),
          stateMutability: z.string().optional(),
          gas: z.string().optional(),
          inputs: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
            })
          ).optional(),
          outputs: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
            })
          ).optional(),
        })
      ).optional().describe("Specifies the ABI of the contract."),
      publicVerification: z.boolean().optional().describe("Specifies whether to verify the contract publicly."),
    },
    async ({ id, name, chainId, deleted, address, abi, publicVerification }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const contract = await openfort.contracts.update({
          id,
          name,
          chainId,
          deleted,
          address,
          abi,
          publicVerification
        });
        return {
          content: [{
            type: 'text',
            text: `Contract updated successfully!\n\n` +
                  `Full contract details:\n${JSON.stringify(contract, null, 2)}`
          }]
        };
      } catch (error) {
        console.error('Error updating contract:', error);
        return {
          content: [{ type: 'text', text: `Error updating contract: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "delete-contract",
    "Delete a contract from the project",
    {
      id: z.string().describe("The unique contract identifier to delete")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const result = await openfort.contracts.delete(id);
        return {
          content: [{ type: 'text', text: `Contract deleted successfully!\n\n` +
            `Full contract details:\n${JSON.stringify(result, null, 2)}` }]
        };
      } catch (error) {
        console.error('Error deleting contract:', error);
        return {
          content: [{ type: 'text', text: `Error deleting contract: ${error}` }]
        };
      }
    }
  );

  // server.tool(
  //   "read-contract",
  //   "Read on-chain contract repositories.",
  //   {
  //     id: z.string().describe("Specifies the unique contract ID."),
  //     functionName: z.string().describe("The function name of the contract."),
  //     functionArgs: z.array(z.string()).optional().describe("The function arguments of the contract, in string format. Accepts pla_, con_ and acc_ IDs."),
  //   },
  //   async ({ id, functionName, functionArgs }) => {
  //     try {
  //       if (!agent.state.apiSecret) {
  //         return { content: [{ type: 'text', text: 'You must select a project first' }] };
  //       }
  //       const openfort = new Openfort(agent.state.apiSecret);
  //       const result = await openfort.contracts.read({ id, functionName, functionArgs });
  //       return {
  //         content: [{ type: 'text', text: `Contract read successfully!\n\n` +
  //           `Full contract details:\n${JSON.stringify(result, null, 2)}` }]
  //       };
  //     } catch (error) {
  //       console.error('Error reading contract:', error);
  //       return {
  //         content: [{ type: 'text', text: `Error reading contract: ${error}` }]
  //       };
  //     }
  //   }
  // );
}