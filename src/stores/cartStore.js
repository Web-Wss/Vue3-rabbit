// 封装购物车模块
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./userStore";
import { insertCartAPI, findNewCartListAPI, delCartAPI } from "@/apis/cart";

export const useCartStore = defineStore(
  "cart",
  () => {
    const userStore = useUserStore();
    const isLogin = computed(() => userStore.userInfo.token);

    // 获取最新购物车列表action
    const updateNewList = async () => {
      const res = await findNewCartListAPI();
      cartList.value = res.result;
    };

    // 定义state
    const cartList = ref([]);
    // 定义action
    const addCart = async (goods) => {
      // 添加购物车
      // 已添加过 - count + 1
      // 没有添加过 - 直接push
      // 通过匹配传递过来的商品对象skuId
      if (isLogin.value) {
        // 登录之后加入购物车逻辑
        const { skuId, count } = goods;
        await insertCartAPI({ skuId, count });
        updateNewList();
      } else {
        const item = cartList.value.find((item) => goods.skuId === item.skuId);
        if (item) {
          // 找到了
          item.count++;
        } else {
          cartList.value.push(goods);
        }
      }
    };

    // 删除商品
    const delCart = async (skuId) => {
      if (isLogin.value) {
        // 调用删除接口
        delCartAPI([skuId]);
        updateNewList();
      } else {
        // 思路，找到要删除的下标值 - splice
        // 使用数组的过滤方法  - filter
        const idx = cartList.value.findIndex((item) => skuId === item.skuId);
        cartList.value.splice(idx, 1);
      }
    };

    // 清除购物车
    const clearCart = () => {
      cartList.value = [];
    };

    // 单选功能
    const singleCheck = (skuId, selected) => {
      // 通过skuId找到要修改的一项，修改
      const item = cartList.value.find((item) => item.skuId === skuId);
      item.selected = selected;
    };

    // 全选功能
    const allCheck = (selected) => {
      // 把每一项都为全选状态
      cartList.value.forEach((item) => (item.selected = selected));
    };

    // 总数量：所有项count之和
    const allCount = computed(() =>
      cartList.value.reduce((a, c) => a + c.count, 0)
    );

    // 总价：所有项的count*price之和
    const allPrice = computed(() =>
      cartList.value.reduce((a, c) => a + c.count * c.price, 0)
    );

    // 已选择数量
    const selectedCount = computed(() =>
      cartList.value
        .filter((item) => item.selected)
        .reduce((a, c) => a + c.count, 0)
    );
    // 已选择商品价钱合计
    const selectedPrice = computed(() =>
      cartList.value
        .filter((item) => item.selected)
        .reduce((a, c) => a + c.count * c.price, 0)
    );

    // 是否全选
    const isAll = computed(() => cartList.value.every((item) => item.selected));

    return {
      cartList,
      addCart,
      delCart,
      allCount,
      allPrice,
      singleCheck,
      isAll,
      allCheck,
      selectedCount,
      selectedPrice,
      clearCart,
      updateNewList,
    };
  },
  {
    persist: true,
  }
);
