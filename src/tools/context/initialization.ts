import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MyMCP } from "../..";

export function register(server: McpServer, agent: MyMCP, props: {
  accessToken: string;
  refreshToken: string;
  projectId: string;
  clientId: string;
}) {
  server.tool(
    "create-openfortkit-app",
    "Create React App with Openfort Kit",
    {},
    async () => {
      return {
        content: [{
          text:
            ` 
        1.Install
        Start by installing Openfort Kit and its peer dependencies using your package manager of choice:
          - yarn add @openfort/openfort-kit wagmi viem@^2.22.0 @tanstack/react-query

        2. Get API keys
        At this point, make sure you have access to all API keys, including the publishable and secret keys, as well as the shield publishable and secret keys and the encryption share.

        3. Set up providers
        Set up providers for Wagmi, TanStack Query, and OpenfortKit.
        To set up a config for Wagmi, we will use Wagmi's createConfig function with @openfort/openfort-kit's getDefaultConfig function. This automatically sets up the Wagmi instance to support all chains and transports supported by Openfort. If you need more configuration go to the Wagmi configuration guide at: https://www.openfort.io/docs/products/embedded-wallet/react/kit/setup/wagmi. To set up OpenfortKitProvider we will need the publishable key.

        ----------
        Providers.tsx
        ----------
        "use client";
 
        import React from "react";
        import {
          AuthProvider,
          OpenfortKitProvider,
          getDefaultConfig,
          RecoveryMethod,
        } from "@openfort/openfort-kit";
        import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
        import { WagmiProvider, createConfig } from "wagmi";
        import { polygonAmoy } from "viem/chains";
        
        const config = createConfig(
          getDefaultConfig({
            appName: "OpenfortKit demo",
            walletConnectProjectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
            chains: [polygonAmoy],
            ssr: true, // Enable server-side rendering if needed
          })
        );
        
        const queryClient = new QueryClient();
        
        export function Providers({ children }: { children: React.ReactNode }) {
          return (
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <OpenfortKitProvider
                  // Set the publishable key of your OpenfortKit account. This field is required.
                  publishableKey={"YOUR_PUBLISHABLE_KEY"}
                  // Set the wallet configuration. In this example, we will be using the embedded wallet.
                  walletConfig={{
                    createEmbeddedSigner: true,
        
                    embeddedSignerConfiguration: {
                      shieldPublishableKey: "YOUR_SHIELD_PUBLISHABLE_KEY",
        
                      // Set the recovery method you want to use, in this case we will use the password recovery method
                      recoveryMethod: RecoveryMethod.PASSWORD,
        
                      // With password recovery we can set the encryption key to encrypt the recovery data
                      // This way we don't have a backend to store the recovery data
                      shieldEncryptionKey: "YOUR_SHIELD_ENCRYPTION_SHARE",
                    },
                  }}
                >
                  {children}
                </OpenfortKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          );
        } 

        ----------
        App.tsx
        ----------
        import React from "react";
        import { Providers } from "./Providers";
        
        export default function App() {
          return <Providers>{/* Your app content */}</Providers>;
        }

        Wrap your app in the Providers component as shown above.

        4. You're good to go!
        Once you've configured your app, you can now use OpenfortKitButton to onboard your users.

        import { OpenfortKitButton } from "@openfort/openfort-kit";
 
        function App() {
          return (
            <div>
              <OpenfortKitButton />
            </div>
          );
        }
        
        export default App;`, type: "text"
        }]
      }
    }
  );
}