import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import SupabaseHandler from "./handlers/supabase-handler";
import * as projectTools from "./tools/management/projects";
import * as keyTools from "./tools/management/keys";
import * as docTools from "./tools/context/documentation";
import * as accountTools from "./tools/project/accounts";
import * as userTools from "./tools/project/users";
import * as contractTools from "./tools/project/contracts";
import * as transactionTools from "./tools/project/transactions";
import * as policyTools from "./tools/project/policies";
import * as initTools from "./tools/context/initialization";

type Props = {
  accessToken: string;
  refreshToken: string;
  projectId: string;
  clientId: string;
};

type State = {
	activeProject: string | null;
	apiSecret: string | null;
};

export class MyMCP extends McpAgent<Env, State, Props> {
	server = new McpServer({
		name: "OpenFortMCP",
		version: "1.0.0",
	});

	initialState: State = {
		activeProject: null,
		apiSecret: null,
	};

	async init() {
		projectTools.register(this.server, this, this.props);
		keyTools.register(this.server, this, this.props);
		docTools.register(this.server);
		accountTools.register(this.server, this, this.props);
		userTools.register(this.server, this, this.props);
		contractTools.register(this.server, this, this.props);
		transactionTools.register(this.server, this, this.props);
		policyTools.register(this.server, this, this.props);
		initTools.register(this.server, this, this.props);
	}
}

export default new OAuthProvider({
	apiHandler: MyMCP.mount("/sse") as any,
	apiRoute: "/sse",
	defaultHandler: SupabaseHandler as any,
	authorizeEndpoint: "/authorize",
	clientRegistrationEndpoint: "/register",
	tokenEndpoint: "/token",
});
