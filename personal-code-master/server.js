import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTEXT_PATH = path.resolve(__dirname, 'context', 'tailwind-rules.md');

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
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required. Put it in .env or inject it via the runtime environment.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    systemInstruction: MASTER_SYSTEM_INSTRUCTION,
  });

  const generationConfig = {
    temperature: 0.0,
    topP: 0.95,
    topK: 64,
  };

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig,
    });

    return result.response.text();
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
