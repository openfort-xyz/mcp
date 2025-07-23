![Group 48095760](https://github.com/user-attachments/assets/ce49cf85-7e38-4ff5-9ff0-05042667a3d8)

--- 

<h1> Openfort Model Context Protocol (MCP) Server</h1>


Openfort is an open source alternative to wallet infrastructure solutions, it supercharges your project with authentication, user management and payments. 

Openfort’s MCP Server is a plug-and-play solution that enhances AI assistants by enabling them to create projects, manage configurations, and query data automatically when building applications on Openfort's infrastructure. Here's a guide on how to set it up

### Features
- **🔨 42 Tools** — A complete set of [tools](https://www.openfort.io/docs/configuration/ai-tooling/mcp-server/tools) to interact with Openfort
- **🔐 Authentication** — Directly authenticate from just plugging in the MCP
- **📄️ Initialize** — Create new Openfort projects from the chat
- **🏗️ Scaffold** — Build new apps from scratch using a single prompt
- **🔎 Context** — Query the latest version of the documentation
- **💳️ Create** — Generate wallets, users, contracts, and policies by just telling the LLM 

### Steps
  1. Install Openfort's MCP server.
  2. Add rules for the LLMs.
  3. Create a new project.
  4. Debug common issues.
  5. Discover all the capabilities.


## 1. Install Openfort's MCP server
This will allow your AI Assistant to interact with Openfort's tools on your behalf to create projects and manage them.

Ensure you have the following prerequisites:
 - `Node.js` - Installation guide [here](https://nodejs.org/en/download)
 - An `Openfort account` - Create one [here](https://dashboard.openfort.io/)

Now, add it to your code editor. Based on your preferred tool, follow the instructions below:

---

### Cursor
To integrate our MCP Server with [Cursor](https://docs.cursor.com/context/mcp) you can either:

#### One-click installation

<AddToCursor />

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=openfort-mcp&config=JTdCJTIyY29tbWFuZCUyMiUzQSUyMm5weCUyMG1jcC1yZW1vdGUlMjBodHRwcyUzQSUyRiUyRm1jcC5vcGVuZm9ydC5pbyUyRnNzZSUyMiU3RA%3D%3D)

#### Edit the `~/.cursor/mcp.json`

You can look it up on your system or find it under the `Tools & Integrations` tab in your `Cursor Settings`. Fill it with the following content:

```json
  {
    "mcpServers": {
      "openfort-mcp": {
        "command": "npx",
        "args": [
          "mcp-remote",
          "https://mcp.openfort.io/sse"
        ]
      }
    }
  }
```

Then you should see the Openfort MCP server listed on your `Tools & Integrations` tab without the need to restart. The authentication will trigger automatically.

--- 

### Windsurf
For integration with [Windsurf](https://docs.windsurf.com/windsurf/cascade/mcp#custom-mcp-server-sse), replace the contents of the `~/.codeium/windsurf/mcp_config.json` file with the following. It can be located at:

`Windsurf Settings > Cascade > Plugins (MCP Servers) > View Raw Config`

**For MacOS/Linux**

```json 
{
  "mcpServers": {
    "openfort-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.openfort.io/sse"
      ],
      "disabled": false
    }
  }
}
```
**For windows**
```json
{
  "mcpServers": {
    "openfort-mcp": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "mcp-remote",
        "https://mcp.openfort.io/sse"
        ],
      "disabled": false
    }
  }
}
```

---

### Visual Studio Code

To integrate an MCP Server into [VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for use with GitHub Copilot, you should edit the `.vscode/mcp.json` file or run the `MCP: Open User Configuration` command which opens the file to add the following content:

```json
{
  "servers": {
    "openfort-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.openfort.io/sse"
      ]
    }
  }
}
```

---

### Claude Desktop

To add our MCP Server to [Claude Desktop](https://modelcontextprotocol.io/quickstart/user), click on `Edit Config` in the `Developer` tab under `Settings` to automatically create a file at:

  - macOS: `~/Library/Application  Support/Claude/claude_desktop_config.json`
  - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Once created, fill it with the following content:

```json
{
  "mcpServers": {
    "openfort-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.openfort.io/sse"
      ]
    }
  }
}
```
You will need to restart Claude Desktop after modifying the configuration file. Also, if you freshly installed Node.js you may need to reboot your computer too.

---

## 2. Add rules for the LLMs
LLMs tend to forget about the availability of tools and can make some pathological mistakes. Therefore, it's a good idea to include rules to remind them about this. Copy the ones [here](https://www.openfort.io/docs/configuration/ai-tooling/mcp-server/examples#rules) and include them in your editor.

## 3. Create a new project
Now create a new project in your editor and type up a prompt to the LLM to scaffold it for you. When needed, the LLM will automatically call the [available tools](https://www.openfort.io/docs/configuration/ai-tooling/mcp-server/tools) on Openfort's MCP Server, enhancing your developer experience. You can find an example of a prompt in the [official documentation](https://www.openfort.io/docs/configuration/ai-tooling/mcp-server/examples#prompts).


## 4. Debug Common Issues
Here are some common issues you might encounter and how to resolve them.

---

<details> <summary>General Errors</summary>
<br>
  
After the agent finishes creating a project, it may still throw errors, even with extended context. This is especially common for complex prompts or large applications.

> Don’t expect the AI to flawlessly generate entire applications in a single prompt without any issues.

To resolve these errors, fix them manually or ask the AI for help. Iteration is normal, review the output, make corrections, and continue prompting as needed.  
</details>

---

<details> <summary>Loop When Creating a Policy</summary>
<br>

Occasionally, the AI agent may get stuck in a loop while creating a policy. The policy is successfully created, but the agent repeatedly attempts to update it with the same values.

> The cause is unknown, and the effect is harmless.

To fix this, simply cancel the generation and prompt the agent to continue with the next step.  
</details>

---

<details> <summary>npm Error: Missing script: "dev"</summary>
<br>

If the AI agent fails to start the project using `npm run dev`, it’s often because it created the project in a subfolder and didn’t change into that directory before running the command.

> Manually navigate to the subfolder and run the project again.
</details>

---

<details> <summary>No Permission to Edit the .env File</summary>
<br>
  
When the AI agent fails to edit or create a `.env` file with your project keys, it’s usually due to insufficient file permissions.

> In Cursor, add a `.cursorignore` file with `!.env` to explicitly allow the AI to edit the `.env` file.  

> For other editors or environments, follow an equivalent approach to ensure the file is not ignored.  
</details>

---

## 5. Discover all the capabilities
For more information on the available tools and how to use them, check out the [MCP Server documentation](https://www.openfort.io/docs/configuration/ai-tooling/mcp-server/tools).
