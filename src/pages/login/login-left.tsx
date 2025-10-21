import React, { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin"; // 引入 InertiaPlugin 惯性动画效果
import "./css/login-left.css";
import reactSvg from "@/assets/react.svg";

gsap.registerPlugin(InertiaPlugin);

const iconArr = [
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

const LoginLeft: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const oldPos = useRef({ x: 0, y: 0 });
  const delta = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleMouseMove = (e: MouseEvent) => {
      delta.current.x = e.clientX - oldPos.current.x;
      delta.current.y = e.clientY - oldPos.current.y;
      oldPos.current.x = e.clientX;
      oldPos.current.y = e.clientY;
    };

    root.addEventListener("mousemove", handleMouseMove);

    const iconEls = root.querySelectorAll<HTMLDivElement>(".icon");

    iconEls.forEach((el) => {
      animateMedia(el, false);
      el.addEventListener("mouseenter", () => animateMedia(el, true));
    });

    /**
     * 使用 GSAP 动画库为指定元素内的图片添加惯性平移和随机旋转效果。
     * 此函数常用于拖拽操作后，模拟物体被“抛出”然后平滑停止的动态效果。
     * * @param el 包含要动画处理的图片的 HTML Div 元素。
     * * @param tag 标记值，用于区分不同的动画效果。
     */
    function animateMedia(el: HTMLDivElement, tag: boolean = true) {
      let xAxis = delta.current.x * 30;
      let yAxis = delta.current.y * 30;
      let multiple = 1.2;
      if (!tag) {
        xAxis = (Math.random() - 0.5) * 20000;
        yAxis = (Math.random() - 0.5) * 10000;
        multiple = 0.5;
      }

      // 1. 元素查找与检查
      const image = el.querySelector<HTMLImageElement>("img");
      // 如果没有找到图片元素，则立即退出函数，避免运行时错误。
      if (!image) return;
      // 2. 创建 GSAP 时间线
      const tl = gsap.timeline({
        // 配置时间线完成后的回调函数
        onComplete: () => {
          // 在动画播放完毕后，立即终止 (kill) 时间线，
          // 释放内存资源，防止在 DOM 中留下不必要的活动动画实例。
          tl.kill();
        },
      });

      // 3. 速度调整

      tl.timeScale(multiple);

      // 4. 惯性平移动画 (需要 GSAP InertiaPlugin)
      tl.to(image, {
        // 使用 InertiaPlugin 实现惯性效果，常用于模拟拖拽释放后的平滑减速。
        inertia: {
          // X 轴惯性：初始速度为 delta.current.x * 30 (放大速度)，最终位置为 0 (停下)。
          x: { velocity: xAxis, end: 0 },
          // Y 轴惯性：初始速度为 delta.current.y * 30 (放大速度)，最终位置为 0 (停下)。
          y: { velocity: yAxis, end: 0 },
        },
      });

      // 5. 随机旋转摇摆动画
      tl.fromTo(
        image,
        {}, // 从 0 度开始
        {
          duration: 0.6, // 动画时长为 0.4 秒
          // 目标旋转角度：计算一个 -15 到 +15 度之间的随机角度。
          rotate: (Math.random() - 0.5) * 180,
          yoyo: true, // 启用“往返”模式，动画会反向播放。
          repeat: 0, // 往返一次，即：0 -> 随机角度 -> 0。
          ease: "power1.inOut",
        },
        // 相对位置参数：
        // "<" 表示该动画与时间线中上一个动画（惯性平移）**同时开始**。
        "<"
      );
    }

    return () => {
      root.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      className="icons-container border-r-1 border-b-destructive border-dashed"
      ref={rootRef}
    >
      <div className="icons">
        {iconArr.map((src, idx) => (
          <div className="icon size-25" key={idx}>
            <img className="size-25" src={src} alt={`icon-${idx + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(LoginLeft);
