// MCP SDK tool response shape
export interface ToolResponse {
  content: Array<{ type: "text"; text: string }>;
  _meta?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface OpenfortCallProps {
  accessToken: string;
  refreshToken: string;
  projectId: string;
  clientId: string;
}

// Openfort API request options
export interface RequestOptions<TBody = unknown> {
  endpoint: string;
  fullEndpoint?: boolean; // If true, the request is made to endpoint, if false, the request is made to BASE_URL + endpoint 
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: TBody;
}

const BASE_URL = "https://api.openfort.io/v1";

// Openfort API request function
export async function openfortRequest<TBody = unknown>(
  props: OpenfortCallProps,
  { endpoint, fullEndpoint = false, method = "GET", headers, body }: RequestOptions<TBody>
): Promise<ToolResponse> {

  // Helper to refresh access token using the stored refresh token
  async function refreshAccessToken(): Promise<boolean> {
    try {
      const refreshUrl = `https://${props.projectId}.supabase.co/auth/v1/token?grant_type=refresh_token`;
      const res = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: props.clientId,
          ...headers,
        } as Record<string, string>,
        body: JSON.stringify({ refresh_token: props.refreshToken }),
      });
      if (!res.ok) {
        return false;
      }
      const json = (await res.json()) as {
        access_token?: string;
        refresh_token?: string;
      };
      if (!json.access_token) {
        return false;
      }
      // Update the props reference for future calls
      props.accessToken = json.access_token;
      if (json.refresh_token) {
        props.refreshToken = json.refresh_token;
      }
      return true;
    } catch {
      return false;
    }
  }

  try {
    // Helper to overwrite headers
    const createHeaders = (accessToken: string, customHeaders: Record<string, string> = {}) => {
      const defaultHeaders: Record<string, string> = {
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        ...(body !== undefined && { 'content-type': 'application/json' }),
      };
      return { ...defaultHeaders, ...customHeaders };
    };

    // Build initial request
    const init: RequestInit = {
      method,
      headers: createHeaders(props.accessToken, headers),
      body: body ? JSON.stringify(body) : undefined,
    };

    // Make request
    const response = await fetch(`${fullEndpoint ? endpoint : `${BASE_URL}${endpoint}`}`, init);

    // Attempt to renew token automatically on auth errors
    if (response.status === 401 || response.status === 403) {
      const renewed = await refreshAccessToken();
      if (renewed) {
        // Create new request with updated token
        const retryInit: RequestInit = {
          ...init,
          headers: createHeaders(props.accessToken, headers),
        };
        // Retry request 
        const retryRes = await fetch(`${fullEndpoint ? endpoint : `${BASE_URL}${endpoint}`}`, retryInit);
        if (retryRes.ok) {
          const data = await retryRes.json();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data),
              },
            ],
          };
        }
      }
    }

    // Handle errors
    if (!response.ok) {
      let text = "";
      try {
        text = `: ${await response.text()}`;
      } catch { }
      throw new Error(`Failed to perform operation: ${text}`);
    }

    // Read and return response
    const data = await response.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data),
        },
      ],
    };
  } catch (err: any) {
    throw new Error(`Failed to perform operation: ${err?.message ?? err}`);
  }
}
