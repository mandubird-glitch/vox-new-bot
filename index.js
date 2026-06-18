import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';

// 봇이 잠들지 않게 서버 띄우기
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

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message.content);
    const response = await result.response;
    message.reply(response.text());
  } catch (error) {
    console.error("AI 응답 오류:", error);
  }
});

client.login(process.env.TOKEN);
