const year = Number(process.env.NEXT_PUBLIC_WEDDING_YEAR || '2024');
const month = Number(process.env.NEXT_PUBLIC_WEDDING_MONTH || '10');
const day = Number(process.env.NEXT_PUBLIC_WEDDING_DAY || '26');
const hour = Number(process.env.NEXT_PUBLIC_WEDDING_HOUR || '12');
const minute = Number(process.env.NEXT_PUBLIC_WEDDING_MINUTE || '30');
// 요일 계산 (Date 객체 활용)
const dayOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(`${year}-${month}-${day}`).getDay()];
const dayOfWeekKo = ['일', '월', '화', '수', '목', '금', '토'][new Date(`${year}-${month}-${day}`).getDay()];

// AM/PM 및 시간 포맷팅
const ampm = hour >= 12 ? 'PM' : 'AM';
const ampmKo = hour >= 12 ? '오후' : '오전';
const displayHour = hour % 12 || 12; // 0시나 12시는 12로 표시
export const WEDDING_INFO = {
  
  // 신랑측 정보
  groom: {
    lastname: process.env.NEXT_PUBLIC_GROOM_LAST_NAME || '김',
    firstname: process.env.NEXT_PUBLIC_GROOM_FIRST_NAME || '철수',
    nameEn: process.env.NEXT_PUBLIC_GROOM_NAME_EN || 'Groom',
    parents: {
      father: process.env.NEXT_PUBLIC_GROOM_FATHER_NAME,
      mother: process.env.NEXT_PUBLIC_GROOM_MOTHER_NAME,
    },
    // 본인 계좌를 포함한 전체 계좌 리스트
    accounts: [
      {
        type: 'groom',
        holder: `${process.env.NEXT_PUBLIC_GROOM_FIRST_NAME || '신랑'}`,
        bank: process.env.NEXT_PUBLIC_GROOM_BANK,
        number: process.env.NEXT_PUBLIC_GROOM_ACCOUNT || '000-0000-0000'
      },
      {
        type: 'father',
        holder: `부 ${process.env.NEXT_PUBLIC_GROOM_FATHER_NAME || '아버님'}`,
        bank: process.env.NEXT_PUBLIC_GROOM_FATHER_BANK,
        number: process.env.NEXT_PUBLIC_GROOM_FATHER_ACCOUNT || '000-0000-0000'
      },
      {
        type: 'mother',
        holder: `모 ${process.env.NEXT_PUBLIC_GROOM_MOTHER_NAME || '어머님'}`,
        bank: process.env.NEXT_PUBLIC_GROOM_MOTHER_BANK,
        number: process.env.NEXT_PUBLIC_GROOM_MOTHER_ACCOUNT || '000-0000-0000'
      },
    ]
  },

  // 신부측 정보
  bride: {
    lastname: process.env.NEXT_PUBLIC_BRIDE_LAST_NAME || '이',
    firstname: process.env.NEXT_PUBLIC_BRIDE_FIRST_NAME || '영희',
    nameEn: process.env.NEXT_PUBLIC_BRIDE_NAME_EN || 'Bride',
    parents: {
      father: process.env.NEXT_PUBLIC_BRIDE_FATHER_NAME,
      mother: process.env.NEXT_PUBLIC_BRIDE_MOTHER_NAME,
    },
    // 본인 계좌를 포함한 전체 계좌 리스트
    accounts: [
      {
        type: 'bride',
        holder: `${process.env.NEXT_PUBLIC_BRIDE_FIRST_NAME || '신부'}`,
        bank: process.env.NEXT_PUBLIC_BRIDE_BANK,
        number: process.env.NEXT_PUBLIC_BRIDE_ACCOUNT || '000-0000-0000'
      },
      {
        type: 'father',
        holder: `부 ${process.env.NEXT_PUBLIC_BRIDE_FATHER_NAME || '아버님'}`,
        bank: process.env.NEXT_PUBLIC_BRIDE_FATHER_BANK,
        number: process.env.NEXT_PUBLIC_BRIDE_FATHER_ACCOUNT || '000-0000-0000'
      },
      {
        type: 'mother',
        holder: `모 ${process.env.NEXT_PUBLIC_BRIDE_MOTHER_NAME || '어머님'}`,
        bank: process.env.NEXT_PUBLIC_BRIDE_MOTHER_BANK,
        number: process.env.NEXT_PUBLIC_BRIDE_MOTHER_ACCOUNT || '000-0000-0000'
      },
    ]
  },

  // 일시 및 장소 (기존과 동일)
  date: {
    year,
    month,
    day,
    hour,
    minute: minute.toString().padStart(2, '0'), // 0분일 경우 '00'으로 표시
    dayOfWeekEn, // 'Sat'
    dayOfWeekKo, // '토'
    ampm,        // 'PM'
    ampmKo,      // '오후'
  },
  place: {
    location: process.env.NEXT_PUBLIC_WEDDING_LOCATION || '예식장 이름을 입력하세요',
    address: process.env.NEXT_PUBLIC_WEDDING_ADDRESS || '서울특별시 OO구 OO로 123', // 주소도 빼두면 좋습니다.
    lat: parseFloat(process.env.NEXT_PUBLIC_WEDDING_LAT || '37.555146'), // 숫자로 변환
    lng: parseFloat(process.env.NEXT_PUBLIC_WEDDING_LNG || '126.970590'),
  }
};