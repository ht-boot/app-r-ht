import React, { useEffect, useRef, memo, useCallback } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import "./css/login-left.css";
// 引入本地图片资源
import reactSvg from "@/assets/react.svg";

// 注册 GSAP 插件，移到组件外部，只执行一次
gsap.registerPlugin(InertiaPlugin);

// 将常量数组移到组件外部，避免组件每次渲染时都重新创建
const ICON_URLS = [
  `https://free.picui.cn/free/2025/10/20/68f5da29d8c28.png`,
  `https://free.picui.cn/free/2025/10/20/68f5db5366aed.png`,
  `https://free.picui.cn/free/2025/10/20/68f5db630e9fc.png`,
  `https://free.picui.cn/free/2025/10/20/68f5db703ffe3.png`,
  reactSvg,
  `https://free.picui.cn/free/2025/10/20/68f5de1076e65.png`,
  `https://free.picui.cn/free/2025/10/20/68f5de0d0de5a.png`,
  `https://free.picui.cn/free/2025/10/20/68f5ddf28064b.png`,
  `https://free.picui.cn/free/2025/10/20/68f5ddf25dd5a.png`,
  `https://free.picui.cn/free/2025/10/20/68f5ddf25e772.png`,
  "https://free.picui.cn/free/2025/10/20/68f5ec1ee0660.png",
  "https://free.picui.cn/free/2025/10/20/68f5dfa1c6235.png",
];

// 性能优化：为图片添加 will-change 属性，告知浏览器进行渲染优化
const IMAGE_STYLE: React.CSSProperties = {
  willChange: "transform",
};

const LoginLeft: React.FC = () => {
  // 1. 使用 ref 存储父容器
  const rootRef = useRef<HTMLDivElement>(null);

  // 2. 鼠标速度/位置状态保持不变，因为这是原生事件的最佳实践
  const oldPos = useRef({ x: 0, y: 0 });
  const delta = useRef({ x: 0, y: 0 });

  // 3. 将动画逻辑提取为可复用的函数，并使用 useCallback 缓存
  const animateMedia = useCallback((el: HTMLImageElement, isHover: boolean) => {
    // 确保目标是 img 元素
    if (!el) return;

    // 清理掉之前可能残留的对同一图片的动画
    gsap.killTweensOf(el);

    let xAxis, yAxis, multiple;

    if (isHover) {
      // 鼠标悬停触发 (惯性抛出)
      xAxis = delta.current.x * 30;
      yAxis = delta.current.y * 30;
      multiple = 1.2;
    } else {
      // 初始/非悬停触发 (随机漂浮)
      xAxis = (Math.random() - 0.5) * 20000;
      yAxis = (Math.random() - 0.5) * 10000;
      multiple = 0.8;
    }

    // 使用 timeline 管理惯性和平移的同步
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "elastic.inOut" },
    });

    tl.timeScale(multiple);

    // 惯性平移动画 (使用 x/y 属性而非 left/top，可实现 GPU 加速)
    tl.to(el, {
      inertia: {
        x: { velocity: xAxis, end: 0 },
        y: { velocity: yAxis, end: 0 },
        duration: isHover ? 0.8 : 1.5, // 悬停时更快停止
      },
      ease: isHover ? "power3.out" : "expo.out",
    });

    // 随机旋转摇摆动画 (与惯性动画同时开始: "<")
    tl.fromTo(
      el,
      {},
      {
        duration: 0.6,
        rotate: (Math.random() - 0.5) * 180,
        yoyo: true,
        repeat: 0,
        ease: "power1.inOut",
      },
      "<"
    );

    tl.play(); // 播放动画
  }, []); // 依赖项为空，确保函数引用稳定

  //  定义 React 事件处理函数
  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 目标是 .icon div，但我们需要 img 元素进行动画
      const imgEl = e.currentTarget.querySelector<HTMLImageElement>("img");
      if (imgEl) {
        animateMedia(imgEl, true);
      }
    },
    [animateMedia]
  );

  // useEffect 用于原生事件监听和 GSAP context
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // --- 原生事件监听 (用于获取鼠标速度) ---
    // 优化：使用 requestAnimationFrame 限制更新频率，提高性能
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        delta.current.x = e.clientX - oldPos.current.x;
        delta.current.y = e.clientY - oldPos.current.y;
        oldPos.current.x = e.clientX;
        oldPos.current.y = e.clientY;
      });
    };

    root.addEventListener("mousemove", handleMouseMove);

    // --- GSAP Context (用于动画初始化和自动清理) ---
    const ctx = gsap.context(() => {
      // 选取所有图标中的 img 元素
      const iconImages = gsap.utils.toArray<HTMLImageElement>(".icon .size-25");

      // 初始动画：所有图标进行随机漂浮
      iconImages.forEach((img) => {
        // 由于 animateMedia 依赖 delta/oldPos ref，
        // 且初始 isHover=false 时，delta/oldPos 影响不大，
        // 我们可以直接调用，但更推荐将其重构为独立的初始动画函数，
        // 这里为了简化，我们直接调用 animateMedia(img, false)
        // 确保 animateMedia 在 isHover=false 时能正常运作。
        animateMedia(img, false);
      });
    }, root); // 将动画范围限制在 rootRef 元素内

    // --- 清理函数 ---
    return () => {
      root.removeEventListener("mousemove", handleMouseMove);
      // 使用 GSAP Context 的 revert() 方法来清理所有在它内部创建的动画
      ctx.revert();
    };
  }, [animateMedia]); // 依赖项：animateMedia (来自 useCallback)

  return (
    <section
      className="icons-container border-r-1 border-b-destructive border-dashed"
      ref={rootRef}
    >
      <div className="icons">
        {ICON_URLS.map((src, idx) => (
          // 6. 关键优化：使用 React 的 onMouseEnter 代替手动 DOM 事件监听
          <div className="icon size-25" key={idx} onMouseEnter={onMouseEnter}>
            <img
              className="size-25"
              src={src}
              alt={`icon-${idx + 1}`}
              style={IMAGE_STYLE} // 性能优化属性
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(LoginLeft);
