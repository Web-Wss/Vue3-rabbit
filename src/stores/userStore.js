// 管理用户数据
import { defineStore } from "pinia";
import { ref } from "vue";
import { LoginAPI } from "@/apis/user";
import { useCartStore } from "./cartStore";
import { mergeCartAPI } from "@/apis/cart";

export const useUserStore = defineStore(
  "user",
  () => {
    const cartStore = useCartStore();
    // 定义管理用户数据的state
    const userInfo = ref([]);
    // 定义获取接口数据的action函数
    const getUserInfo = async ({ account, password }) => {
      const res = await LoginAPI({ account, password });
      userInfo.value = res.result;
      // 合并购物车
      mergeCartAPI(
        cartStore.cartList.map((item) => {
          return {
            skuId: item.skuId,
            selected: item.selected,
            count: item.count,
          };
        })
      );
      cartStore.updateNewList();
    };

    // 退出时清除用户信息
    const clearUserInfo = () => {
      userInfo.value = {};
      // 执行清楚购物车action
      cartStore.clearCart();
      console.log("清除了");
    };

    // 以对象的形式把state和action return出去
    return {
      userInfo,
      getUserInfo,
      clearUserInfo,
    };
  },
  {
    persist: true,
  }
);
