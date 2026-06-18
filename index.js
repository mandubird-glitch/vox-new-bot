import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';

// 렌더 서버 유지용
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
  // 봇 본인의 메시지 무시
  if (message.author.bot) return;

  // '!복스' 로 시작하는 메시지에만 반응하도록 설정
  if (!message.content.startsWith('!복스')) return;

  try {
    // 명령어 '!복스 ' 뒷부분의 내용만 AI에게 전달
    const prompt = message.content.replace('!복스', '').trim();
    if (!prompt) {
      message.reply("응? 불렀어? 뭐라고 말할까?");
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    message.reply(response.text());
  } catch (error) {
    console.error("AI 응답 오류:", error);
    message.reply("미안, 지금 AI랑 대화가 잘 안 돼.");
  }
});

client.login(process.env.TOKEN);
