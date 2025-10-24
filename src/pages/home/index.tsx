import { motion } from "motion/react";
import RealTimeClock from "./real-time-clock";
const Home = () => {
  return (
    <div className="home">
      <motion.div
        initial={{ opacity: 1, y: -50 }} // 初始状态
        drag // 开启拖拽
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} // 拖拽约束
        // dragTransition={{
        //   min: 0,
        //   max: 10,
        //   bounceStiffness: 300,
        // }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.5,
            visualDuration: 0.3,
          },
        }}
        className="cursor-grabbing ml-10 mr-10"
      >
        <div className="flex items-start justify-between">
          <div className="">
            <p className="text-4xl font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              Hello, Admin.
            </p>
            <p className="text-neutral-500 text-sm ">
              Welcome back! 这里进行任务跟踪，会是一个很好的选择。
            </p>
          </div>
          {/* 日期与时间 */}
          <div className="gap-2 text-neutral-700 dark:text-neutral-300">
            <RealTimeClock />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }} // 初始状态
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            bounce: 0.5,
          },
        }}
        className="grid mt-4 auto-rows-min gap-4 md:grid-cols-3"
      >
        <div className="bg-muted aspect-video rounded-xl" />
        <div className="bg-muted aspect-video rounded-xl" />
        <div className="bg-muted aspect-video rounded-xl" />
      </motion.div>
    </div>
  );
};

export default Home;
