import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTEXT_PATH = path.resolve(__dirname, 'context', 'tailwind-rules.md');
const DEFAULT_MODEL = 'gemini-3.5-flash';

function readRequiredFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required context file missing: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

const tailwindRules = readRequiredFile(CONTEXT_PATH);

const MASTER_SYSTEM_INSTRUCTION = `
OPERATING DIRECTIVE: Strict EXECUTION MODE. Output concrete, deployable code only.
STACK: GCP, Azure, Docker, Terraform, Node.js, Python.
UI/UX CONSTRAINTS:
${tailwindRules}
OUTPUT: Markdown code blocks only. No theoretical filler.
`;

export async function executeSupremeMaster(userPrompt) {
  const prompt = String(userPrompt ?? '').trim();
  if (!prompt) {
    throw new Error('A non-empty code-generation prompt is required.');
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'replace_with_your_key') {
    throw new Error('GEMINI_API_KEY is required. Put it in .env or inject it via the runtime environment.');
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        temperature: 0.0,
        topP: 0.95,
        topK: 64,
        candidateCount: 1,
        seed: 7,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }
    return text;
  } catch (error) {
    console.error('CRITICAL FAILURE in Execution Pipeline:', error);
    throw error;
  }
}

async function main() {
  const prompt = process.argv.slice(2).join(' ') || 'Create a Tailwind navigation bar component using the allowed palette.';
  const output = await executeSupremeMaster(prompt);
  console.log(output);
}

const isDirectExecution = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === __filename;
if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
