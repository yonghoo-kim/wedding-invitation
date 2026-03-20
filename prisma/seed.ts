// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 더미 데이터 입력을 시작합니다...');

  // 1. 임시 고객(User) 계정 생성
  const user = await prisma.user.create({
    data: {
      email: 'aabbcc@wedding.com',
      password: 'hel@oworld', // 나중에는 실제 암호화 로직이 들어갑니다
      name: '김하마'
    },
  });

  // 2. 청첩장(Invitation) 데이터 생성
  const invitation = await prisma.invitation.create({
    data: {
      userId: user.id, // 방금 만든 유저의 ID를 연결 (외래키)
      urlSlug: 'kim-lee-0613',
      theme: 'spring',
      bgmFilename: 'bg.mp3',
      mainImage: 'gallery-1.jpg',
      closingImage: 'gallery-10.jpg',
      
      groomLastName: '김',
      groomFirstName: '사무엘',
      brideLastName: '이',
      brideFirstName: '에스더',
      
      // 날짜는 자바스크립트 Date 객체로 변환해서 넣습니다 (2026년 4월 18일 12시 30분)
      weddingDate: new Date('2026-04-18T12:30:00+09:00'),
      weddingLocation: '조선 팰리스 서울 강남',
      weddingAddress: '서울특별시 강남구 231 테헤란로',
      weddingLat: 37.502998,
      weddingLng: 127.041346,

      // 대망의 JSON 데이터!
      groomAccountInfo: {
        bank: '카카오뱅크',
        account: '3333-01-1234567',
        father: { name: '김아버지', bank: '국민은행', account: '123-4567-890' },
        mother: { name: '강어머니', bank: '신한은행', account: '098-7654-321' }
      },
      brideAccountInfo: {
        bank: '토스뱅크',
        account: '1000-1234-5678',
        father: { name: '이아버지', bank: '우리은행', account: '111-222-333333' },
        mother: { name: '최어머니', bank: '기업은행', account: '444-555-666666' }
      }
    },
  });

  console.log('✅ 데이터 입력 성공!');
  console.log('🌟 생성된 청첩장 ID (이 주소로 접속하게 됩니다):', invitation.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });