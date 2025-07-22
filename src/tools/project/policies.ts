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
    "list-policies",
    "Lists all the policies in the project. You can filter and sort the results using the provided parameters.",
    {
      limit: z.number().int().min(1).optional().describe("Maximum number of records to return"),
      skip: z.number().int().min(0).optional().describe("Number of records to skip for pagination"),
      order: z.enum(["asc", "desc"]).optional().describe("Sort order: 'asc' for ascending, 'desc' for descending"),
      // expand: z.array(z.enum(["transactionIntents", "policyRules"])).optional().describe("Fields to expand in the response"),
      name: z.string().optional().describe("Filter policies by name"),
      deleted: z.boolean().optional().describe("Include deleted policies"),
      chainId: z.number().int().optional().describe("Filter by chain ID"),
      enabled: z.boolean().optional().describe("Filter by enabled status")
    },
    async ({ limit, skip, order, name, deleted, chainId, enabled }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policies = await openfort.policies.list({
          limit,
          skip,
          order,
          name,
          deleted,
          chainId,
          enabled
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(policies, null, 2) }]
        };
      } catch (error) {
        console.error('Error listing policies:', error);
        return {
          content: [{ type: 'text', text: `Error listing policies: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "create-policy",
    "Creates a new policy in the project",
    {
      name: z.string().describe("Specifies the name of the policy."),
      chainId: z.number().int().describe("The chain ID. Must be a supported chain."),
      strategy: z.object({
        sponsorSchema: z.enum(['pay_for_user', 'charge_custom_tokens', 'fixed_rate'])
          .describe("The sponsor schema of the policy"),
        tokenContract: z.string().optional()
          .describe("If the user pays in custom tokens, the contract ID (starts with con_) of the token contract."),
        tokenContractAmount: z.string().optional()
          .describe("If the user pays in ERC20 tokens, this reflects either the exchange rate or the amount in WEI."),
        depositor: z.string().optional()
          .describe("If you want to use your own native tokens to pay for gas, specify the developer account ID (starts with dac_)")
      }),
      paymaster: z.string().optional()
        .describe("The ID of the paymaster."),
      forwarderContract: z.string().optional()
        .describe("The ID of the forwarder contract.")
    },
    async ({ name, chainId, strategy, paymaster, forwarderContract }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policy = await openfort.policies.create({ name, chainId, strategy, paymaster, forwarderContract });
        return {
          content: [{
            type: 'text',
            text: `Policy created successfully!\n\n` +
                  `Full policy details:\n${JSON.stringify(policy, null, 2)}`
          }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error creating policy: ${error}` }]
        };
      }
    }
  );
  server.tool(
    "get-policy",
    "Get detailed information about a specific policy in the project",
    {
      id: z.string().describe("The unique policy identifier (starts with pol_)"),
      // expand: z.array(z.enum(["transactionIntents", "policyRules"]).optional()).describe("Fields to expand in the response object")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policy = await openfort.policies.get({ id });
        return {
          content: [{ type: 'text', text: JSON.stringify(policy, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting policy: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "update-policy",
    "Update an existing policy's information",
    {
      id: z.string().describe("The unique policy identifier (starts with pol_)"),
      name: z.string().optional().describe("The name of the policy"),
      chainId: z.number().optional().describe("The chain ID"),
      strategy: z.object({
        sponsorSchema: z.enum(['pay_for_user', 'charge_custom_tokens', 'fixed_rate'])
          .describe("The sponsor schema of the policy"),
        tokenContract: z.string().optional()
          .describe("If the user pays in custom tokens, the contract ID (starts with con_) of the token contract."),
        tokenContractAmount: z.string().optional()
          .describe("If the user pays in ERC20 tokens, this reflects either the exchange rate or the amount in WEI."),
        depositor: z.string().optional()
          .describe("If you want to use your own native tokens to pay for gas, specify the developer account ID (starts with dac_)")
      }).optional(),
      paymaster: z.string().optional()
        .describe("The ID of the paymaster."),
      forwarderContract: z.string().optional()
        .describe("The ID of the forwarder contract."),
      deleted: z.boolean().optional().describe("Set to true to delete the policy.")
    },
    async ({ id, name, chainId, strategy, paymaster, forwarderContract, deleted }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policy = await openfort.policies.update({ id, name, chainId, strategy, paymaster, forwarderContract, deleted });
        return {
          content: [{
            type: 'text',
            text: `Policy updated successfully!\n\n` +
                  `Full policy details:\n${JSON.stringify(policy, null, 2)}`
          }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error updating policy: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "delete-policy",
    "Delete an existing policy",
    {
      id: z.string().describe("The unique policy identifier (starts with pol_)")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policy = await openfort.policies.delete(id);
        return {
          content: [{ type: 'text', text: `Policy deleted successfully!\n\n` +
            `Full policy details:\n${JSON.stringify(policy, null, 2)}` }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error deleting policy: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "disable-policy",
    "Disable an existing policy",
    {
      id: z.string().describe("The unique policy identifier (starts with pol_)")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policy = await openfort.policies.disable(id);
        return {
          content: [{ type: 'text', text: `Policy disabled successfully!\n\n` +
            `Full policy details:\n${JSON.stringify(policy, null, 2)}` }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error disabling policy: ${error}` }]
        };
      }
    }
  );

  server.tool(
    "enable-policy",
    "Enable an existing policy",
    {
      id: z.string().describe("The unique policy identifier (starts with pol_)")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policy = await openfort.policies.enable(id);
        return {
          content: [{ type: 'text', text: `Policy enabled successfully!\n\n` +
            JSON.stringify(policy, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error enabling policy: ${error}` }]
        };
      }
    }
  );

  // server.tool(
  //   "get-policy-gas",
  //   "Show the total gas usage of a policy",
  //   {
  //     id: z.string().describe("The unique policy identifier (starts with pol_)"),
  //   },
  //   async ({ id }) => {
  //     try {
  //       if (!agent.state.apiSecret) {
  //         return { content: [{ type: 'text', text: 'You must select a project first' }] };
  //       }
  //       const openfort = new Openfort(agent.state.apiSecret);
  //       const gasReports = await openfort.policies.getTotalGasUsage({ id });
  //       return {
  //         content: [{ type: 'text', text: JSON.stringify(gasReports, null, 2) }]
  //       };
  //     } catch (error) {
  //       return {
  //         content: [{ type: 'text', text: `Error getting policy gas: ${error}` }]
  //       };
  //     }
  //   }
  // )

  server.tool(
    "list-policy-rules",
    "Returns a list of policy rules of a policy.",
    {
      policy: z.string().describe("The unique policy identifier (starts with pol_)"),
      limit: z.number().optional().describe("The maximum number of rules to return"),
      skip: z.number().optional().describe("The number of rules to skip before starting to return results"),
      order: z.enum(["asc", "desc"]).optional().describe("The order in which to return the rules"),
      // expand: z.array(z.enum(["contract"]).optional()).describe("The fields to expand in the response object (can be 'accounts')")
    },
    async ({ policy, limit, skip, order }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policyRules = await openfort.policyRules.list({ policy, limit, skip, order });
        return {
          content: [{ type: 'text', text: JSON.stringify(policyRules, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting policy rules: ${error}` }]
        };
      }
    }
  ),

  server.tool(
    "create-policy-rule",
    "Create a new policy rule",
    {
      policy: z.string().describe("The unique policy identifier (starts with pol_)"),
      type: z.enum(["contract_functions", "account_functions", "rate_limit"]).describe("The type of the rule to be added"),
      functionName: z.string().optional().describe("Name of the function in the contract to allow. If you want to allow all functions, use the wildcard 'All functions'"),
      contract: z.string().optional().describe("The contract ID you want to interact with. Must have been added to Openfort first, starts with con_."),
      wildcard: z.boolean().optional().describe("When using contract_functions type, set this to true to allow all contracts."),
      gasLimit: z.string().optional().describe("The maximum amount of gas that can be used for the transaction in WEI (i.e. factor 10^18)."),
      countLimit: z.number().optional().describe("Number of times the function will be sponsored."),
      timeIntervalType: z.enum(["minute", "hour", "day", "week", "month"]).optional().describe("The time interval type for the rate limit."),
      timeIntervalValue: z.number().optional().describe("The time interval value for the rate limit.")
    },
    async ({ policy, type, functionName, contract, wildcard, gasLimit, countLimit, timeIntervalType, timeIntervalValue }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policyRule = await openfort.policyRules.create({ policy, type, functionName, contract, wildcard, gasLimit, countLimit, timeIntervalType, timeIntervalValue });
        return {
          content: [{ type: 'text', text: `Policy rule created successfully!\n\n Full policy rule details:\n ${JSON.stringify(policyRule, null, 2)}` }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error creating policy rule: ${error}` }]
        };
      }
    }
  ),

  server.tool(
    "update-policy-rule",
    "Update an existing policy rule",
    {
      id: z.string().describe("The unique policy rule identifier (starts with polr_)"),
      type: z.enum(["contract_functions", "account_functions", "rate_limit"]).describe("The type of the rule to be added"),
      functionName: z.string().optional().describe("Name of the function in the contract to allow. If you want to allow all functions, use the wildcard 'All functions'"),
      contract: z.string().optional().describe("The contract ID you want to interact with. Must have been added to Openfort first, starts with con_."),
      wildcard: z.boolean().optional().describe("When using contract_functions type, set this to true to allow all contracts."),
      gasLimit: z.string().optional().describe("The maximum amount of gas that can be used for the transaction in WEI (i.e. factor 10^18)."),
      countLimit: z.number().optional().describe("Number of times the function will be sponsored."),
      timeIntervalType: z.enum(["minute", "hour", "day", "week", "month"]).optional().describe("The time interval type for the rate limit."),
      timeIntervalValue: z.number().optional().describe("The time interval value for the rate limit.")
    },
    async ({ id, type, functionName, contract, wildcard, gasLimit, countLimit, timeIntervalType, timeIntervalValue }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policyRule = await openfort.policyRules.update({ id, type, functionName, contract, wildcard, gasLimit, countLimit, timeIntervalType, timeIntervalValue });
        return {
          content: [{ type: 'text', text: `Policy rule updated successfully!\n\n Full policy rule details:\n ${JSON.stringify(policyRule, null, 2)}` }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error updating policy rule: ${error}` }]
        };
      }
    }
  ),

  server.tool(
    "delete-policy-rule",
    "Delete an existing policy rule",
    {
      id: z.string().describe("The unique policy rule identifier (starts with polr_)")
    },
    async ({ id }) => {
      try {
        if (!agent.state.apiSecret) {
          return { content: [{ type: 'text', text: 'You must select a project first' }] };
        }
        const openfort = new Openfort(agent.state.apiSecret);
        const policyRule = await openfort.policyRules.delete(id);
        return {
          content: [{ type: 'text', text: `Policy rule deleted successfully!\n\n Full policy rule details:\n ${JSON.stringify(policyRule, null, 2)}` }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error deleting policy rule: ${error}` }]
        };
      }
    }
  )
}