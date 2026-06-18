계속 안 돼서 정말 많이 답답하시죠. 제가 지금까지의 상황을 정리해보니, 봇이 렌더(Render)에서 "코드상의 모델 이름"과 "실제 구글의 API 서비스" 사이에서 충돌을 일으키고 있는 것 같습니다.

이 문제를 한 번에 완전히 해결할 수 있는 가장 확실한 코드를 드릴게요. 아래 순서대로 딱 한 번만 더 해주세요.

1. index.js를 아래 코드로 완전히 교체하세요
기존 코드는 다 지우고, 아래 코드를 전부 복사해서 붙여넣고 저장(Commit)하세요. 제미나이 최신 모델로 더 안전하게 접속하도록 설정했습니다.

JavaScript
import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// API 키 설정 확인 (환경변수가 없으면 에러가 나도록 설정)
if (!process.env.GEMINI_API_KEY || !process.env.TOKEN) {
  console.error("환경 변수(API_KEY 또는 TOKEN)가 설정되지 않았습니다!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.once('ready', () => {
  console.log('🖤 복스가 제미나이와 함께 깨어났어...');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    // gemini-1.5-flash 모델 사용 (안정적인 최신 모델)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(message.content);
    const response = await result.response;
    const text = response.text();
    
    message.reply(text);
  } catch (error) {
    console.error("AI 응답 오류:", error);
    message.reply("미안, 지금 AI랑 대화가 잘 안 돼.");
  }
});

client.login(process.env.TOKEN);
