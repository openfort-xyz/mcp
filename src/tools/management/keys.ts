import { z } from "zod";
import { openfortRequest } from "../../utils/api.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MyMCP } from "../..";
import { v4 as uuidv4 } from "uuid"

export function register(server: McpServer, agent: MyMCP, props: {
  accessToken: string;
  refreshToken: string;
  projectId: string;
  clientId: string;
}) {
  server.tool(
    "get-publishable-keys",
    "Get the publishable keys of the active project",
    {},
    async () => {
      // First check if a project is selected
      if (!agent.state.activeProject) {
        return { content: [{ text: "No project selected", type: "text" }] }
      }
      try {
        const response = await openfortRequest(props, { endpoint: `/projects/${agent.state.activeProject}` })
        const data = JSON.parse(response.content[0].text);
        const pks = (data.apikeys as any[]).filter((key: any) => key.name === "pk")
        if (pks.length === 0) {
          return { content: [{ text: "No publishable keys found", type: "text" }] }
        }
        return { content: pks.map(key => ({ text: `${key.name}: pk_test_${key.token}`, type: "text" })) }
      }
      catch (error) {
        return { content: [{ text: "Failed to get publishable keys: " + error, type: "text" }] }
      }
    }
  );

  server.tool(
    "get-secret-keys",
    "Get the secret keys of the active project",
    {},
    async () => {
      // First check if a project is selected
      if (!agent.state.activeProject) {
        return { content: [{ text: "No project selected", type: "text" }] }
      }
      try {
        const response = await openfortRequest(props, { endpoint: `/projects/${agent.state.activeProject}` })
        const data = JSON.parse(response.content[0].text);
        const sks = (data.apikeys as any[]).filter((key: any) => key.name === "sk")
        if (sks.length === 0) {
          return { content: [{ text: "No secret keys found", type: "text" }] }
        }
        return { content: sks.map(key => ({ text: `${key.name}: sk_test_${key.token}`, type: "text" })) }
      }
      catch (error) {
        return { content: [{ text: "Failed to get secret keys: " + error, type: "text" }] }
      }
    }
  );

  server.tool(
    "get-shield-publishable-key",
    "Get the shield publishable key of the active project",
    {},
    async () => {
      // First check if a project is selected
      if (!agent.state.activeProject) {
        return { content: [{ text: "No project selected", type: "text" }] }
      }
      try {
        const response = await openfortRequest(props, { endpoint: `/projects/${agent.state.activeProject}` })
        const data = JSON.parse(response.content[0].text);
        const pks = (data.apikeys as any[]).filter((key: any) => key.name === "pk_shield")
        if (pks.length === 0) {
          return { content: [{ text: "No shield publishable key found", type: "text" }] }
        }
        return { content: pks.map(key => ({ text: `${key.name}: ${key.token}`, type: "text" })) }
      }
      catch (error) {
        return { content: [{ text: "Failed to get shield publishable key: " + error, type: "text" }] }
      }
    }
  );

  server.tool(
    "get-shield-secret-key",
    "Get the shield secret key of the active project",
    {},
    async () => {
      // First check if a project is selected
      if (!agent.state.activeProject) {
        return { content: [{ text: "No project selected", type: "text" }] }
      }
      try {
        const response = await openfortRequest(props, { endpoint: `/projects/${agent.state.activeProject}` })
        const data = JSON.parse(response.content[0].text);
        const sks = (data.apikeys as any[]).filter((key: any) => key.name === "sk_shield")
        if (sks.length === 0) {
          return { content: [{ text: "No shield secret key found", type: "text" }] }
        }
        return { content: sks.map(key => ({ text: `${key.name}: ${key.token}`, type: "text" })) }
      }
      catch (error) {
        return { content: [{ text: "Failed to get shield secret key: " + error, type: "text" }] }
      }
    }
  );

  server.tool(
    "create-publishable-key",
    "Create a new publishable key for the active project and return all the existing ones",
    {},
    async () => {
      // First check if a project is selected
      if (!agent.state.activeProject) {
        return { content: [{ text: "No project selected", type: "text" }] }
      }
      try {
        const response = await openfortRequest(props, { endpoint: `/project/apikey`, method: "POST", headers: { "project": agent.state.activeProject }, body: { type: "pk" } })
        const data = JSON.parse(response.content[0].text);
        const pks = (data.apikeys as any[]).filter((key: any) => key.name === "pk")
        if (pks.length === 0) {
          return { content: [{ text: "No publishable keys found", type: "text" }] }
        }
        return { content: [{ text: `Created publishable key, here are all the existing keys now: ${pks.map(key => `pk_test_${key.token}`).join(", ")}`, type: "text" }] }
      }
      catch (error) {
        return { content: [{ text: "Failed to create publishable key: " + error, type: "text" }] }
      }
    }
  )

  server.tool(
    "create-secret-key",
    "Create a new secret key for the active project and return all the existing ones",
    {},
    async () => {
      // First check if a project is selected
      if (!agent.state.activeProject) {
        return { content: [{ text: "No project selected", type: "text" }] }
      }
      try {
        const response = await openfortRequest(props, { endpoint: `/project/apikey`, method: "POST", headers: { "project": agent.state.activeProject }, body: { type: "sk" } })
        const data = JSON.parse(response.content[0].text);
        const sks = (data.apikeys as any[]).filter((key: any) => key.name === "sk")
        if (sks.length === 0) {
          return { content: [{ text: "No secret keys found", type: "text" }] }
        }
        return { content: [{ text: `Created secret key, here are all the existing keys: ${sks.map(key => `sk_test_${key.token}`).join(", ")}`, type: "text" }] }
      }
      catch (error) {
        return { content: [{ text: "Failed to create secret key: " + error, type: "text" }] }
      }
    }
  )

  server.tool(
    "create-shield-keys",
    "Create a new shield keys for the active project and return the public, secret and encryption keys, the encryption key is never shown again, force the user to copy it.",
    {},
    async () => {
      // First check if a project is selected
      if (!agent.state.activeProject) {
        return { content: [{ text: "No project selected", type: "text" }] }
      }
      try {
        const response = await openfortRequest(props, {
          endpoint: `https://shield.openfort.io/register`, fullEndpoint: true, method: "POST",
          body:
            { name: agent.state.activeProject, generate_encryption_key: true }
        })
        const data = JSON.parse(response.content[0].text);

        await openfortRequest(props, {
          endpoint: `/project/apikey`, method: "PUT", headers: { "project": agent.state.activeProject },
          body: { type: "pk_shield", uuid: uuidv4() }
        })
        await openfortRequest(props, {
          endpoint: `/project/apikey`, method: "PUT", headers: { "project": agent.state.activeProject },
          body: { type: "sk_shield", uuid: uuidv4() }
        })

        return { content: [{ text: `Created shield keys, here are all the existing keys:\nPublic key: ${data.api_key}, \nSecret key: ${data.api_secret}, \nEncryption key: ${data.encryption_part} \nMake sure to copy the encryption key, it will never be shown again. Also, never store the encryption key on the client side, it is only for the server side.`, type: "text" }] }
      }
      catch (error) {
        return { content: [{ text: "Failed to create shield keys: " + error, type: "text" }] }
      }
    }
  )
}