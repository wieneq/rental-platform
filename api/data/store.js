// 記憶體儲存 - 展示版本
// 重啟後資料會清空，可透過 seed.js 重新初始化

const store = {
  users: [],
  equipment: [],
  bookings: [],
  contracts: [],
  deposits: [],
  repairs: [],
  
  // 自增 ID 計數器
  counters: {
    users: 1,
    equipment: 1,
    bookings: 1,
    contracts: 1,
    deposits: 1,
    repairs: 1
  },
  
  // 取得下一個 ID
  getNextId(type) {
    return this.counters[type]++;
  },
  
  // 重置所有資料
  reset() {
    this.users = [];
    this.equipment = [];
    this.bookings = [];
    this.contracts = [];
    this.deposits = [];
    this.repairs = [];
    
    this.counters = {
      users: 1,
      equipment: 1,
      bookings: 1,
      contracts: 1,
      deposits: 1,
      repairs: 1
    };
  }
};

module.exports = store;
