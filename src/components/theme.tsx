import { Moon, Sun } from "lucide-react";
import { memo, useState } from "react";

const Theme = memo(() => {
  const [theme, setTheme] = useState(true);
  const toggleTheme = () => {
    setTheme(!theme);
    if (theme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const checkThemeAnimation = (
    e: React.MouseEvent<SVGSVGElement | MouseEvent>
  ) => {
    const { clientX, clientY } = e;
    const radius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY)
    );
    const transition = document.startViewTransition(() => {
      toggleTheme();
    });

    const clipPath = [
      `circle(0% at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`,
    ];
    transition.ready.then(() => {
      // 圆形扩散计算
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <>
      {theme ? (
        <Moon
          className="absolute top-4 right-4 cursor-pointer"
          onClick={(e) => checkThemeAnimation(e)}
        />
      ) : (
        <Sun
          className="absolute top-4 right-4 cursor-pointer"
          onClick={(e) => checkThemeAnimation(e)}
        />
      )}
    </>
  );
});
export default Theme;
