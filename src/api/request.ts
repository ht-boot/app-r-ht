/**
 * Axios 封装（拦截器逻辑）
 */
import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  retry?: number;
  retryDelay?: number;
  cache?: boolean;
}

type CustomAxiosInstance = AxiosInstance & {
  <T = any>(config: RequestConfig): Promise<T>;
  <T = any>(url: string, config?: RequestConfig): Promise<T>;
};

type CacheEntry = {
  data: any;
  timestamp: number;
  lifetime?: number;
};

const CACHE_TIME = 300000; // 缓存时间，默认5分钟
const MAX_RETRY = 1; // 最大重试次数
const RETRY_DELAY = 1000; // 重试间隔时间
let isRefreshing = false; // 是否正在刷新 token

// Token 刷新队列 单独使用
const tokenRefreshQueue: Array<(token: string) => void> = [];

// 请求队列管理
const pendingRequests = new Map<string, AbortController>();

// 请求缓存
const cache = new Map<string, CacheEntry>();

// 生成请求的唯一key
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
};

const baseURL = "http://localhost:8888";
// 创建 axios 实例
const service: CustomAxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig & RequestConfig) => {
    // 取消重复请求
    const requestKey = generateRequestKey(config);
    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey);
      controller?.abort();
    }

    // 创建新的 AbortController
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller); // 添加到请求队列

    // 检查缓存
    if (config.cache) {
      const cachedEntry = cache.get(requestKey) as any;
      if (cachedEntry) {
        const isExpired =
          Date.now() - cachedEntry.timestamp > (cachedEntry.lifetime || 0);
        if (!isExpired) {
          // 缓存命中且未过期
          return Promise.reject({ __cached: true, data: cachedEntry.data });
        }
        // 如果过期，移除旧缓存
        cache.delete(requestKey);
      }
    }

    // 示例：在请求头中添加 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 请求错误统一处理
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfig &
      RequestConfig;
    const requestKey = generateRequestKey(config);

    // 移除已完成的请求
    pendingRequests.delete(requestKey);

    const res = response.data;
    // 可根据后端定义的 code 判断是否成功
    // if (res.code !== 0) {
    //   console.warn("[Response Warning]", res.message);
    //   return Promise.reject(res.message);
    // }

    // 缓存响应
    if (config.cache) {
      cache.set(requestKey, {
        data: res,
        timestamp: Date.now(),
        lifetime: CACHE_TIME, // 缓存时间，默认5分钟
      });
    }

    return res;
  },
  async (error) => {
    const config = error.config as InternalAxiosRequestConfig & RequestConfig;
    const response = error.response;

    // 如果响应状态码为 401，则表示 token 已过期，需要刷新 token
    if (response && response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem("refresh_token");
        try {
          const { data } = await service.post("/auth/refresh", {
            refresh_token: refreshToken,
          });
          localStorage.setItem("token", data.token);
          // 重新发起请求
          tokenRefreshQueue.forEach((callback) => callback(data.token));
          tokenRefreshQueue.length = 0; // 清空队列
        } catch (e) {
          isRefreshing = false;
          // Refresh Token 也失效，跳转登录
          window.location.href = "/login";
          return Promise.reject(e); // 终止后续操作
        } finally {
          isRefreshing = false;
        }
      }

      // 返回一个 Promise，等 token 刷新完成后再重试
      return new Promise((resolve) => {
        tokenRefreshQueue.push((token) => {
          config.headers["Authorization"] = `Bearer ${token}`;
          resolve(service(config));
        });
      });
    }

    // 处理缓存命中的情况
    if (error.__cached) {
      return error.data;
    }

    // 处理请求重试
    if (config && !config.retry && config.retry !== 0) {
      config.retry = MAX_RETRY;
    }

    const currentRetry = config?.retry ?? 0; // 当前重试次数

    if (config && currentRetry > 0) {
      config.retry = currentRetry - 1;
      await new Promise((resolve) =>
        setTimeout(resolve, config.retryDelay || RETRY_DELAY)
      );
      return service(config);
    }

    // 移除失败的请求
    if (config) {
      const requestKey = generateRequestKey(config);
      pendingRequests.delete(requestKey);
    }

    // 网络或服务器错误统一处理
    if (error.response) {
      const { status, data } = error.response;
      console.error(`[HTTP ${status}]`, data?.message || error.message);
    } else {
      console.error("[Network Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default service;
