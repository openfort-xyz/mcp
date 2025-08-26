import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

interface Document {
  id: string;
  content: string;
}

// Maximum of 24k tokens (aprox)
const MAX_CHARS = 24000 * 4;

let documents: Document[] = [];
let isDocumentsLoaded = false;

// Load llms-full.txt from the internet and split up into documents
async function loadDocuments(): Promise<void> {
  if (isDocumentsLoaded) return;
  try {
    const response = await fetch('https://www.openfort.io/docs/llms-full.txt');
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    if (!text) {
      throw new Error("Document content is empty");
    }
    const sections = text.split(/\n\s*\n/);
    documents = [];
    sections.forEach((content, index) => {
      const trimmedContent = content.trim();
      if (trimmedContent) {
        documents.push({
          id: `doc-${index}`,
          content: trimmedContent
        });
      }
    });
    isDocumentsLoaded = true;
  } catch (error) {
    isDocumentsLoaded = false;
    throw error;
  }
}

// Search documents for the given terms
function searchDocuments(terms: string[]): Document[] {
  if (terms.length === 0 || documents.length === 0) return [];
  const lowerTerms = terms.map(term => term.trim().toLowerCase()).filter(Boolean);
  if (lowerTerms.length === 0) return [];
  const uniqueDocs = new Map<string, Document>();
  for (const doc of documents) {
    const content = doc.content.toLowerCase();
    // if (lowerTerms.every(term => content.includes(term))) {
    if (lowerTerms.some(term => content.includes(term))) {    // Tweak criteria
      uniqueDocs.set(doc.id, doc);
    }
  }
  return Array.from(uniqueDocs.values());
}

export function register(server: McpServer) {
  server.tool(
    'search-documentation',
    'Searches through the Openfort documentation for the given phrase',
    {
      searchPhrase: z.string().describe("The phrase to search for in the documentation"),
    },
    async ({ searchPhrase }) => {
      try {
        if (!isDocumentsLoaded) {
          await loadDocuments();
        }

        const searchTerms = searchPhrase.toLowerCase().split(/\s+/).filter(Boolean);
        const searchResults = searchDocuments(searchTerms);

        if (searchResults.length === 0) {
          return { content: [{ type: 'text', text: 'No matching sections found.' }] };
        }

        let accumulated = '';
        for (const doc of searchResults) {
          const nextContent = doc.content + '\n\n';
          if ((accumulated.length + nextContent.length) > MAX_CHARS) {
            const remaining = MAX_CHARS - accumulated.length;
            accumulated += nextContent.slice(0, remaining);
            break;
          } else {
            accumulated += nextContent;
          }
        }

        return {
          content: [{ type: 'text', text: accumulated }]
        };

      } catch (error) {
        return {
          content: [{ type: 'text', text: 'An error occurred while searching the documentation: ' + error }]
        };
      }
    }
  );
}
