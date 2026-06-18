import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';

// 1. 서버 유지용 (포트 3000)
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
  // 1. 봇 자신의 메시지이거나, '!복스'로 시작하지 않으면 즉시 종료 (핵심!)
  if (message.author.bot) return;
  if (!message.content.startsWith('!복스')) return;

  try {
    // 2. 명령어(!복스) 제거 후 질문만 추출
    const prompt = message.content.slice(3).trim(); 
    
    if (!prompt) {
      return message.reply("응? 불렀어? 뭐라고 말할까?");
    }

    // 3. AI 모델 호출
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // 4. 대답
    message.reply(response.text());
  } catch (error) {
    console.error("AI 응답 오류:", error);
    message.reply("미안, 지금 AI랑 대화가 잘 안 돼.");
  }
});

client.login(process.env.TOKEN);
