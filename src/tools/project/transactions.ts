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
  // server.tool(
  //   "create-transaction",
  //   "Creates a new transaction intent in the project",
  //   {
  //     chainId: z.number().describe("The chain id for the transaction"),
  //     interactions: z.array(
  //       z.object({
  //         to: z.string().optional().describe(
  //           "The address of the recipient of native tokens. Use only to transfer native tokens. If you provide one of a pla_..., or acc_... it will be converted to the corresponding address."
  //         ),
  //         value: z.string().optional().describe(
  //           "The value intended to be sent with the transaction. Should be a stringified number in WEI (i.e. factor 10^18)."
  //         ),
  //         contract: z.string().optional().describe(
  //           "The contract ID you want to interact with. Must have been added to Openfort first, starts with con_."
  //         ),
  //         functionName: z.string().optional().describe(
  //           "The function name of the contract. Accepts a function signature as well (e.g. mint(address))."
  //         ),
  //         functionArgs: z.array(z.string()).optional().describe(
  //           "The function arguments of the contract, in string format. If you provide one of a pla_..., con_... or acc_... it will be converted to the corresponding address."
  //         ),
  //         dataSuffix: z.string().optional().describe(
  //           "Data to append to the end of the calldata. Useful for adding a 'domain' tag."
  //         ),
  //         data: z.string().optional().describe(
  //           "The encoded calldata of the contract."
  //         ),
  //       })
  //     ).describe("An array of interactions for the transaction."),
  //     player: z.string().optional().describe(
  //       "ID of the Player this TransactionIntent belongs to, if one exists (starts with pla_). If you omit this parameter a new Player will be created."
  //     ),
  //     account: z.string().optional().describe(
  //       "ID of the Account this TransactionIntent is executed with, if one exists (starts with acc_ or dac_). When providing a Player and ChainID, you can omit this parameter."
  //     ),
  //     policy: z.string().optional().describe(
  //       "ID of the Policy that defines the gas sponsorship strategy (starts with pol_). If no Policy is provided, the own Account native token funds will be used to pay for gas."
  //     ),
  //     externalOwnerAddress: z.string().optional().describe(
  //       "Use this parameter to create a new Account for Player with the provided owner address. If you omit this parameter and no Account exists for the Player, a custodial Account will be created."
  //     ),
  //     optimistic: z.boolean().optional().describe(
  //       "Set to true to indicate that the transactionIntent request should be resolved as soon as possible, after the transactionIntent is created and simulated and before it arrives on chain."
  //     ),
  //   },
  //   async ({ chainId, interactions, player, account, policy, externalOwnerAddress, optimistic }) => {
  //     try {
  //       if (!agent.state.apiSecret) {
  //         return { content: [{ type: 'text', text: 'You must select a project first' }] };
  //       }
  //       const openfort = new Openfort(agent.state.apiSecret);
  //       const transaction = await openfort.transactionIntents.create({ chainId, interactions, player, account, policy, externalOwnerAddress, optimistic });
  //       return {
  //         content: [{ type: 'text', text: JSON.stringify(transaction, null, 2) }]
  //       };
  //     } catch (error) {
  //       return {
  //         content: [{ type: 'text', text: `Error creating transaction: ${error}` }]
  //       };
  //     }
  //   }
  // );

   server.tool(
    "simulate-transaction",
    "Simulates a new transaction intent in the project",
    {
      chainId: z.number().describe("The chain id for the transaction"),
      interactions: z.array(
        z.object({
          to: z.string().optional().describe(
            "The address of the recipient of native tokens. Use only to transfer native tokens. If you provide one of a pla_..., or acc_... it will be converted to the corresponding address."
          ),
          value: z.string().optional().describe(
            "The value intended to be sent with the transaction. Should be a stringified number in WEI (i.e. factor 10^18)."
          ),
          contract: z.string().optional().describe(
            "The contract ID you want to interact with. Must have been added to Openfort first, starts with con_."
          ),
          functionName: z.string().optional().describe(
            "The function name of the contract. Accepts a function signature as well (e.g. mint(address))."
          ),
          functionArgs: z.array(z.string()).optional().describe(
            "The function arguments of the contract, in string format. If you provide one of a pla_..., con_... or acc_... it will be converted to the corresponding address."
          ),
          dataSuffix: z.string().optional().describe(
            "Data to append to the end of the calldata. Useful for adding a 'domain' tag."
          ),
          data: z.string().optional().describe(
            "The encoded calldata of the contract."
          ),
        })
      ).describe("An array of interactions for the transaction."),
      player: z.string().optional().describe(
        "ID of the Player this TransactionIntent belongs to, if one exists (starts with pla_). If you omit this parameter a new Player will be created."
      ),
      account: z.string().optional().describe(
        "ID of the Account this TransactionIntent is executed with, if one exists (starts with acc_ or dac_). When providing a Player and ChainID, you can omit this parameter."
      ),
      policy: z.string().optional().describe(
        "ID of the Policy that defines the gas sponsorship strategy (starts with pol_). If no Policy is provided, the own Account native token funds will be used to pay for gas."
      ),
      externalOwnerAddress: z.string().optional().describe(
        "Use this parameter to create a new Account for Player with the provided owner address. If you omit this parameter and no Account exists for the Player, a custodial Account will be created."
      ),
      optimistic: z.boolean().optional().describe(
        "Set to true to indicate that the transactionIntent request should be resolved as soon as possible, after the transactionIntent is created and simulated and before it arrives on chain."
      ),
    },
    async ({ chainId, interactions, player, account, policy, externalOwnerAddress, optimistic }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const transaction = await openfort.transactionIntents.estimateCost({ chainId, interactions, player, account, policy, externalOwnerAddress, optimistic });
        return {
          content: [{ type: 'text', text: JSON.stringify(transaction, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error creating transaction: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "get-transaction",
    "Get detailed information about a specific transaction",
    {
      id: z.string().describe("The unique transaction ID"),
      // expand: z.array(z.enum(["player", "account", "policy"]).optional()).describe("The fields to expand in the response object")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const transaction = await openfort.transactionIntents.get({ id });
        return {
          content: [{ type: 'text', text: JSON.stringify(transaction, null, 2) }]
        };
      } catch (error) {
        console.error('Error getting transaction:', error);
        return {
          content: [{ type: 'text', text: `Error getting transaction: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "list-transactions",
    "Get transactions with optional filtering and pagination",
    {
      limit: z.number().optional().describe("Maximum number of transactions to return"),
      skip: z.number().optional().describe("Number of records to skip"),
      order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
      chainId: z.number().optional().describe("Filter by chain ID"),
      account: z.array(z.string()).optional().describe("Filter by account ID"),
      player: z.array(z.string()).optional().describe("Filter by player ID"),
      status: z.number().optional().describe("Filter by status (1=success, 0=failed)"),
      policy: z.array(z.string()).optional().describe("Filter by policy ID"),
      // expand: z.array(z.enum(["player", "policy", "account"]).optional().describe("The fields to expand in the response object")),
    },
    async ({ limit, skip, order, chainId, account, player, status, policy }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const transactions = await openfort.transactionIntents.list({limit, skip, order, chainId, account, player, status, policy});
        return {
          content: [{ type: 'text', text: JSON.stringify(transactions, null, 2) }]
        };
      } catch (error) {
        console.error('Error listing transactions:', error);
        return {
          content: [{ type: 'text', text: `Error listing transactions: ${error}` }]
        };
      }
    }
  );

  // server.tool(
  //   "broadcast-signed-transaction",
  //   "Broadcast a signed transaction to the network",
  //   {
  //     id: z.string().describe("The transaction intent ID (starts with tin_)"),
  //     signature: z.string().describe("The signature of the transaction")
  //   },
  //   async ({ id, signature }) => {
  //     try {
  //       if (!agent.state.apiSecret) {
  //         return { content: [{ type: 'text', text: 'You must select a project first' }] };
  //       }
  //       const openfort = new Openfort(agent.state.apiSecret);
  //       const result = await openfort.transactionIntents.signature({
  //         id,
  //         signature
  //       });
  //       return {
  //         content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
  //       };
  //     } catch (error) {
  //       console.error('Error broadcasting transaction:', error);
  //       return {
  //         content: [{ type: 'text', text: `Error broadcasting transaction: ${error}` }]
  //       };
  //     }
  //   }
  // );
}