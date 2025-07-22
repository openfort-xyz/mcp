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
    "create-account",
    "Creates a new blockchain account for the provided player. If no player is provided, a new one will be created.",
    {
      chainId: z.number().describe("The chain id for the account"),
      externalOwnerAddress: z.string().optional().describe("To create a new account for a player with the provided owner address"),
      accountType: z.string().optional().describe("The type of smart account that will be created (e.g. ERC6551V1, UpgradeableV6, UpgradeableV5, ZKSyncUpgradeableV2). Defaults to UpgradeableV6"),
      defaultGuardian: z.boolean().optional().describe("For account types that support social recovery, whether to enable Openfort as guardian or not. Defaults to false."),
      tokenContract: z.string().optional().describe("If ERC6551, the address of the NFT contract to use"),
      tokenId: z.number().optional().describe("If ERC6551, the tokenId from the NFT contract that will serve as owner"),
      player: z.string().optional().describe("The player id to associate the account with, if none is provided, a new player will be created"),
    },
    async ({ chainId, externalOwnerAddress, accountType, defaultGuardian, tokenContract, tokenId, player }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const account = await openfort.accounts.create({
          chainId,
          externalOwnerAddress,
          accountType,
          defaultGuardian,
          tokenContract,
          tokenId,
          player,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(account, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error creating account: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "get-account",
    "Get detailed information about a specific account in the project",
    {
      id: z.string().describe("The unique account identifier"),
      // expand: z.array(z.enum(["player", "transactionIntents"])).optional()
      //   .describe("The fields to expand in the response object (can only be 'player', 'transactionIntents', or both)"),
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const account = await openfort.accounts.get({ id });
        return {
          content: [{ type: 'text', text: JSON.stringify(account, null, 2) }]
        };
      } catch (error) {
        console.error('Error getting account:', error);
        return {
          content: [{ type: 'text', text: `Error getting account: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "list-accounts",
    "Get the accounts in the project with optional filtering and pagination",
    {
      limit: z.number().optional().describe("The maximum number of accounts to return"),
      skip: z.number().optional().describe("Specifies the offset for the first records to return."),
      order: z.enum(["asc", "desc"]).optional().describe("The order in which to return the accounts"),
      player: z.string().optional().describe("The player id to filter accounts by"),
      address: z.string().optional().describe("The specific address of the account"),
      // expand: z.array(z.enum(["player", "transactionIntents"])).optional()
      //   .describe("The fields to expand in the response object (can only be 'player', 'transactionIntents', or both)"),
    },
    async ({ player, limit, skip, order, address }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const accounts = await openfort.accounts.list({
          player,
          limit,
          skip,
          order,
          address
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(accounts, null, 2) }]
        };
      } catch (error) {
        console.error('Error listing accounts:', error);
        return {
          content: [{ type: 'text', text: `Error listing accounts: ${error}` }]
        };
      }
    }
  );

  // server.tool(
  //   "sync-account",
  //   "Synchronize the account state with the blockchain. Specifically, it updates the account owner and whether it's deployed or not.",
  //   {
  //     id: z.string().describe("The unique account identifier"),
  //   },
  //   async ({ id }) => {
  //     try {
  //       if (!agent.state.apiSecret) {
  //         return { content: [{ type: 'text', text: 'You must select a project first' }] };
  //       }
  //       const openfort = new Openfort(agent.state.apiSecret);
  //       const account = await openfort.accounts.sync(id);
  //       return {
  //         content: [{ type: 'text', text: JSON.stringify(account, null, 2) }]
  //       };
  //     } catch (error) {
  //       console.error('Error syncing account:', error);
  //       return {
  //         content: [{ type: 'text', text: `Error syncing account: ${error}` }]
  //       };
  //     }
  //   }
  // );
}
