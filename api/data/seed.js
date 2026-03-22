const bcrypt = require('bcryptjs');
const store = require('./store');

// 初始化範例資料
function seedData() {
  console.log('🌱 初始化展示資料...');
  
  store.reset();
  
  // 建立範例使用者（密碼統一為 demo123）
  const hashedPassword = bcrypt.hashSync('demo123', 10);
  
  store.users = [
    {
      id: store.getNextId('users'),
      username: 'admin',
      password: hashedPassword,
      name: '系統管理員',
      role: 'admin',
      createdAt: new Date('2026-01-01')
    },
    {
      id: store.getNextId('users'),
      username: 'owner1',
      password: hashedPassword,
      name: '王小明',
      role: 'owner',
      createdAt: new Date('2026-01-15')
    },
    {
      id: store.getNextId('users'),
      username: 'owner2',
      password: hashedPassword,
      name: '李美華',
      role: 'owner',
      createdAt: new Date('2026-02-01')
    },
    {
      id: store.getNextId('users'),
      username: 'renter1',
      password: hashedPassword,
      name: '張大維',
      role: 'renter',
      createdAt: new Date('2026-02-10')
    },
    {
      id: store.getNextId('users'),
      username: 'renter2',
      password: hashedPassword,
      name: '陳雅婷',
      role: 'renter',
      createdAt: new Date('2026-03-01')
    }
  ];
  
  // 建立範例器材
  store.equipment = [
    {
      id: store.getNextId('equipment'),
      name: 'Canon EOS R5 相機',
      description: '專業全片幅無反相機，45MP 高畫素，8K 錄影',
      category: '攝影器材',
      ownerId: 2,
      hourlyRate: 500,
      depositAmount: 10000,
      status: 'available',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0OThkYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2Fub24gUjU8L3RleHQ+PC9zdmc+',
      createdAt: new Date('2026-02-01')
    },
    {
      id: store.getNextId('equipment'),
      name: 'DJI Mavic 3 空拍機',
      description: '專業空拍機，4/3 CMOS 感光元件，46 分鐘續航',
      category: '攝影器材',
      ownerId: 2,
      hourlyRate: 800,
      depositAmount: 15000,
      status: 'available',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJlY2M3MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+REpJIE1hdmljIDM8L3RleHQ+PC9zdmc+',
      createdAt: new Date('2026-02-05')
    },
    {
      id: store.getNextId('equipment'),
      name: 'MacBook Pro M3 Max',
      description: '16 吋筆記型電腦，適合影片剪輯、3D 渲染',
      category: '電腦設備',
      ownerId: 3,
      hourlyRate: 300,
      depositAmount: 8000,
      status: 'available',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzk1YTVhNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TWFjQm9vayBQcm88L3RleHQ+PC9zdmc+',
      createdAt: new Date('2026-02-10')
    },
    {
      id: store.getNextId('equipment'),
      name: 'Sony A7S III 相機',
      description: '專業錄影相機，4K 120fps，低光表現優異',
      category: '攝影器材',
      ownerId: 2,
      hourlyRate: 600,
      depositAmount: 12000,
      status: 'available',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U3NGMzYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U29ueSBBN1MgSUlJPC90ZXh0Pjwvc3ZnPg==',
      createdAt: new Date('2026-02-15')
    },
    {
      id: store.getNextId('equipment'),
      name: 'iPad Pro 12.9" (M2)',
      description: '適合設計繪圖、簡報使用，含 Apple Pencil',
      category: '電腦設備',
      ownerId: 3,
      hourlyRate: 200,
      depositAmount: 5000,
      status: 'available',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzk1YTVhNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+aVBhZCBQcm88L3RleHQ+PC9zdmc+',
      createdAt: new Date('2026-02-20')
    },
    {
      id: store.getNextId('equipment'),
      name: 'Rode Wireless Go II 無線麥克風',
      description: '雙通道無線領夾式麥克風，適合訪談、Vlog',
      category: '音訊設備',
      ownerId: 2,
      hourlyRate: 150,
      depositAmount: 3000,
      status: 'available',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzOWM0MiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Um9kZSBXaXJlbGVzczwvdGV4dD48L3N2Zz4=',
      createdAt: new Date('2026-02-25')
    }
  ];
  
  // 建立範例預約
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  store.bookings = [
    {
      id: store.getNextId('bookings'),
      equipmentId: 1,
      userId: 4,
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      totalHours: 4,
      totalAmount: 2000,
      status: 'pending',
      createdAt: new Date()
    },
    {
      id: store.getNextId('bookings'),
      equipmentId: 3,
      userId: 5,
      startTime: new Date(dayAfterTomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(dayAfterTomorrow.setHours(17, 0, 0, 0)),
      totalHours: 8,
      totalAmount: 2400,
      status: 'confirmed',
      createdAt: new Date()
    },
    {
      id: store.getNextId('bookings'),
      equipmentId: 2,
      userId: 4,
      startTime: new Date(yesterday.setHours(10, 0, 0, 0)),
      endTime: new Date(yesterday.setHours(16, 0, 0, 0)),
      totalHours: 6,
      totalAmount: 4800,
      status: 'completed',
      createdAt: new Date(twoDaysAgo)
    },
    {
      id: store.getNextId('bookings'),
      equipmentId: 4,
      userId: 5,
      startTime: new Date(twoDaysAgo.setHours(14, 0, 0, 0)),
      endTime: new Date(twoDaysAgo.setHours(18, 0, 0, 0)),
      totalHours: 4,
      totalAmount: 2400,
      status: 'completed',
      createdAt: new Date(twoDaysAgo)
    }
  ];
  
  console.log('✅ 展示資料初始化完成');
  console.log(`   - ${store.users.length} 位使用者`);
  console.log(`   - ${store.equipment.length} 件器材`);
  console.log(`   - ${store.bookings.length} 筆預約`);
  console.log('📝 預設密碼：demo123');
}

// 立即執行
seedData();

module.exports = { seedData };
