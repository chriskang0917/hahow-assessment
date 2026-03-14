/**
 *  @description 只攔截 mockConfig 中定義的 endpoints，其他一律通過
 *               請根據 features 的結構調整 mockConfig
 *               暫時不需要的可以直接註解
 *  @example
 *  {
 *    auth: {
 *      me: "/api/user/me",
 *    },
 *  }
 */

const mockConfig = {
  scheduler: {},
};

export default mockConfig;
