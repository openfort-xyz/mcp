import { set, z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MyMCP } from "../..";

export function register(server: McpServer) {
  server.tool(
    "create-embedded-wallet-app",
    "Create an embedded wallet app using either the React or React Native SDK",
    {
      SDK: z.string().describe("The SDK to use for the app. Either React or React Native"),
    },
    async ({ SDK }) => {
      if (SDK === "React") {
        return {
          content: [{
            text:
              ` 
              Simply run the following command to get started:

              \`\`\`sh Terminal
              yarn create openfort
              \`\`\`

              \`\`\`sh Terminal
              pnpm create openfort
              \`\`\`

              \`\`\`sh Terminal
              npm create openfort
              \`\`\`

              The **Openfort CLI** is a command line tool that helps you quickly set up a new Openfort project with all the necessary dependencies and configurations. It allows you to customize your project by selecting different options during the setup process. You can select across:

              - Framework: (Vite or Next.js)
              - Auth providers: (email, socials, etc.)
              - Wallet recovery method
              - Theming

              ## Manual installation

              ::::steps

              ### 1. Install

              Start by installing [@openfort/react](https://www.npmjs.com/package/@openfort/react) and its peer dependencies using your package manager of choice:

              **npm:**
              \`\`\`bash
              npm install @openfort/react wagmi viem@^2.22.0 @tanstack/react-query
              \`\`\`

              **yarn:**
              \`\`\`bash
              yarn add @openfort/react wagmi viem@^2.22.0 @tanstack/react-query
              \`\`\`

              **pnpm:**
              \`\`\`bash
              pnpm install @openfort/react wagmi viem@^2.22.0 @tanstack/react-query
              \`\`\`

              :::

              ### 2. Get your API keys

              In the [API keys](https://dashboard.openfort.io/developers/configuration/api-keys) section of [Openfort dashboard](https://dashboard.openfort.io), you will find:

              - **Publishable Key**: Safe to expose in client-side environment
              - **Secret Key**: Must be kept secure and used only server-side

              To generate non-custodial wallets:

              1. Scroll to the Shield section and click **Create Shield keys**
              2. **Store the encryption share** safely when it appears (you'll only see it once)
              3. You'll receive:
                - **Shield Publishable Key**: Safe for client-side use
                - **Shield Secret Key**: Keep secure, server-side only

              You will also need a walletConnect project ID. You can get one by creating a project on the [WalletConnect dashboard](https://cloud.reown.com/sign-in).

              ### 3. Set up providers.

              Set up providers for Wagmi, TanStack Query, and Openfort.

              To set up a config for Wagmi, we will use Wagmi's \`createConfig\` function with \`@openfort/react\`'s \`getDefaultConfig\` function. This automatically sets up the Wagmi instance to support all chains and transports supported by Openfort. If you need more configuration, go to the [Wagmi configuration guide](/docs/products/embedded-wallet/react/setup/wagmi).

              To set up \`OpenfortProvider\` we will need the publishable key from the Openfort dashboard, and the wallet configuration. More information on the wallet configuration can be found [here](/docs/products/embedded-wallet/react).

              **Providers.tsx:**
              \`\`\`tsx
              import React from "react";
              import {
                AuthProvider,
                OpenfortProvider,
                getDefaultConfig,
                RecoveryMethod,
              } from "@openfort/react";
              import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
              import { WagmiProvider, createConfig } from "wagmi";
              import { polygonAmoy } from "viem/chains";

              const config = createConfig(
                getDefaultConfig({
                  appName: "Openfort demo",
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
                      <OpenfortProvider
                        // Set the publishable key of your Openfort account. This field is required.
                        publishableKey={"YOUR_PUBLISHABLE_KEY"}
                        // Set the wallet configuration. In this example, we will be using the embedded wallet.
                        walletConfig={{
                          shieldPublishableKey: "YOUR_SHIELD_PUBLISHABLE_KEY",

                          // Set the recovery method you want to use, in this case we will use the password recovery method
                          recoveryMethod: RecoveryMethod.PASSWORD,

                          // With password recovery we can set the encryption key to encrypt the recovery data
                          // This way we don't have a backend to store the recovery data
                          shieldEncryptionKey: "YOUR_SHIELD_ENCRYPTION_SHARE",
                        }}
                      >
                        {children}
                      </OpenfortProvider>
                    </QueryClientProvider>
                  </WagmiProvider>
                );
              }
              \`\`\`

              \`\`\`tsx [App.tsx]
              import React from "react";
              import { Providers } from "./Providers";

              export default function App() {
                return <Providers>{/* Your app content */}</Providers>;
              }
              \`\`\`

              :::

              Wrap your app in the \`Providers\` component as shown above.

              ### 4. You're good to go!

              Once you've configured your app, you can now use \`OpenfortButton\` to onboard your users.

              \`\`\`tsx page.tsx
              import { OpenfortButton } from "@openfort/react";

              function App() {
                return (
                  <div>
                    <OpenfortButton />
                  </div>
                );
              }

              export default App;
              \`\`\`
              ::::

              ## Next steps

              Now that you've set up Openfort, you can explore more features and customization options:
              - [UI Configuration](https://www.openfort.io/docs/products/embedded-wallet/react/ui)
              - [Hooks](https://www.openfort.io/docs/products/embedded-wallet/react/hooks)
              - [Authentication](https://www.openfort.io/docs/products/embedded-wallet/react/authent)
              `,
            type: "text"
          }]
        }
      }
      else if (SDK === "React Native") {
        return {
          content: [{
            text:
              `
              ## Install Required Dependencies

              Install the latest version of the [Openfort React Native SDK](https://www.npmjs.com/package/@openfort/react-native) and its required dependencies:

              \`\`\`sh [terminal]
              # Install Openfort React Native SDK
              yarn add @openfort/react-native

              # Install required dependencies
              yarn add expo-apple-authentication expo-application expo-crypto expo-secure-store react-native-get-random-values
              \`\`\`

              ## Configure Metro

              Create or update your \`metro.config.js\` to include the necessary Node.js module shims:

              \`\`\`tsx
              // metro.config.js
              const { getDefaultConfig } = require("expo/metro-config");

              /** @type {import('expo/metro-config').MetroConfig} */
              const config = getDefaultConfig(__dirname);

              const resolveRequestWithPackageExports = (context, moduleName, platform) => {
                // Package exports in \`jose\` are incorrect, so we need to force the browser version
                if (moduleName === "jose") {
                  const ctx = {
                    ...context,
                    unstable_conditionNames: ["browser"],
                  };
                  return ctx.resolveRequest(ctx, moduleName, platform);
                }

                return context.resolveRequest(context, moduleName, platform);
              };

              config.resolver.resolveRequest = resolveRequestWithPackageExports;

              module.exports = config;
              \`\`\`

              ## Set up entry point

              Create an \`entrypoint.js\` file in your project root. This file is crucial for initializing the Openfort SDK and ensuring proper polyfill loading:

              \`\`\`javascript
              // entrypoint.js

              // Import required polyfills first
              // IMPORTANT: These polyfills must be installed in this order
              import "react-native-get-random-values";
              // Then import the expo router
              import "expo-router/entry";
              \`\`\`

              Also, update your \`package.json\` to use this entry point:

              \`\`\`json
              {
                "main": "entrypoint.js",
              }
              \`\`\`

              ## Set up auth providers

              Navigate to the **auth providers** page on the [Openfort dashboard](https://dashboard.openfort.io) by selecting your project and clicking Auth Providers Methods in the side bar in the [users page](https://dashboard.openfort.io/players). Select the account types you'd like users to be able to login with.

              ## Get your Openfort keys

              From the [Openfort Dashboard](https://dashboard.openfort.io), select your desired app and navigate to the [developers page](https://dashboard.openfort.io/developers/configuration/api-keys). You'll need:

              - **Publishable Key**: Safe to expose in client-side environment
              - **Secret Key**: Must be kept secure and used only server-side
              - **Shield Keys**: Required for non-custodial wallets
                - Create Shield keys in the Shield section
                - Securely store the encryption share shown in the one-time popup
                - You'll get both a Publishable and Secret Shield key

              ## Configure your app

              Add the Safe area provider and hooks to your app's root layout:

              \`\`\`tsx
              // app/_layout.tsx

              import { OpenfortProvider } from "@openfort/react-native";

              export default function RootLayout() {

                return (
                  {/* Your other providers */}
                    <OpenfortProvider
                      publishableKey="YOUR_OPENFORT_PUBLISHABLE_KEY"
                    >
                      {/* Your app content */}
                    </OpenfortProvider>
                  {/* Your other providers */}
                );
              }
              \`\`\`

              ## Next Steps

              Now that you've configured your app, you can use \`openfort\` throughout to access the Openfort SDK.

              - [React Native Sample](https://github.com/openfort-xyz/react-native-auth-sample)
              - [Authentication](https://www.openfort.io/docs/products/embedded-wallet/react-native/auth)
              - [Hooks](https://www.openfort.io/docs/products/embedded-wallet/react-native/hooks)
              `,
            type: "text"
          }]
        }
      } 
      else {
        return {
          content: [{
            text: "No quickstart available for this SDK",
            type: "text"
          }]
        }
      }
    }
  );
}