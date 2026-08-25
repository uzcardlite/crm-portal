import { Toaster } from "react-hot-toast";
import tailwindConfig from "../../../tailwind.config.js";

const colors = tailwindConfig.theme.extend.colors;

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "8px",
          background: colors.surface[2],
          color: colors.ink.DEFAULT,
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: colors.teal, secondary: colors.surface[2] },
        },
        error: {
          iconTheme: { primary: colors.rose, secondary: colors.surface[2] },
        },
      }}
    />
  );
}

export { toast } from "react-hot-toast";
