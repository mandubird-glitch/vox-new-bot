import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';

http.createServer((req, res) => {
  res.write("I am alive");
  res.end();
}).listen(process.env.PORT || 3000);

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
  if (!message.content.startsWith('!복스')) return;

  try {
    const prompt = message.content.slice(3).trim();
    if (!prompt) return message.reply("응? 불렀어?");

    // 모델을 gemini-1.0-pro로 명시
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    message.reply(response.text());
  } catch (error) {
    console.error("오류 발생:", error);
    message.reply("미안, 지금 AI 연결에 문제가 있어.");
  }
});

client.login(process.env.TOKEN);
