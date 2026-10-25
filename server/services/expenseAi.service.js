import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough } from "@langchain/core/runnables";
import { z } from "zod";

const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

const expenseSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive().max(1_000_000_000),
  category: z.string().trim().min(1).max(50),
  description: z.string().max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const structuredLLM = llm.withStructuredOutput(expenseSchema);

const expensePrompt = ChatPromptTemplate.fromTemplate(`
You extract financial transaction details from user messages.

Today's date is {today}.

Extract:
- type: income or expense
- amount: numeric transaction amount
- category: suitable transaction category
- description: short transaction description
- date: transaction date in YYYY-MM-DD format

Rules:
- Use today's date if the user does not specify a date.
- Resolve yesterday and other relative dates using today's date.
- Never invent an amount.
- Return only structured data matching the required schema.

User message: {message}
`);

const extractionChain = RunnablePassthrough.assign({
  extractedExpense: expensePrompt.pipe(structuredLLM),
});

export async function extractExpense(message) {
  const today = new Date().toISOString().slice(0, 10);

  const result = await extractionChain.invoke({
    message,
    today,
  });

  return result.extractedExpense;
}