import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.once('ready', () => {
  console.log('🖤 복스가 제미나이와 함께 깨어났어...');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message.content);
    const response = await result.response;
    message.reply(response.text());
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.TOKEN);
