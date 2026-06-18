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

client.on('messageCreate', async (message) => {
  // 봇 자신의 메시지면 즉시 종료
  if (message.author.bot) return;
  
  // '!복스'로 시작하지 않으면 즉시 종료 (명령어 필수)
  if (!message.content.startsWith('!복스')) return;

  try {
    const prompt = message.content.substring(3).trim();
    if (!prompt) return; // 내용이 없으면 아무 대답도 안 함

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    message.reply(result.response.text());
  } catch (error) {
    console.error("오류 발생:", error);
    // 오류가 나도 명령어 없이 대답하는 것을 방지
  }
});

client.login(process.env.TOKEN);
