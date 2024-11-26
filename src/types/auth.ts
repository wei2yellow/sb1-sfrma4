// 使用者角色定義
export type UserRole = 
  | 'SUPER_ADMIN'     // 超級管理者 - 最高權限
  | 'ADMIN'           // 總管理者
  | 'MANAGER'         // 管理者
  | 'SERVICE_LEADER'  // 外場幹部
  | 'BAR_LEADER'     // 內場幹部
  | 'SERVICE'        // 外場人員
  | 'BAR'            // 吧檯人員
  | 'NEW_SERVICE'    // 外場新進人員
  | 'NEW_BAR';       // 吧檯新進人員

// 使用者資料介面
export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  createdAt: string;
  lastLogin?: string;
}

// 登入憑證介面
export interface LoginCredentials {
  username: string;
  password: string;
}