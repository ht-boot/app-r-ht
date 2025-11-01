import Switch from "@/pages/animate/switch";
import { useState } from "react";

const Animate = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="animate">
      <Switch checked={checked} setChecked={setChecked} />
    </div>
  );
};
export default Animate;
