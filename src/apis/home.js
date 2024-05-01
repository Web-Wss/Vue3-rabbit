import httpInstance from "@/utils/http";

// 获取banner
export function getBannerAPI(params = {}) {
  const { distributionSite = "1" } = params;
  return httpInstance({
    url: "home/banner",
    params: {
      distributionSite,
    },
  });
}

// 新鲜好物
export const findNewAPI = () => {
  return httpInstance({
    url: "/home/new",
  });
};

/**
 * @description: 获取人气推荐
 * @param {*}
 * @return {*}
 */
export const getHotAPI = () => {
  return httpInstance({
    url: "/home/hot",
    methods: "get",
  });
};

/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
  return httpInstance({
    url: "/home/goods",
  });
};
