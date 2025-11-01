import service from "@/api/request";
import type { RequestConfig } from "@/api/request";
export const demo = () => {
  return service({
    url: "/",
    method: "get",
    cache: true,
  } as RequestConfig);
};
