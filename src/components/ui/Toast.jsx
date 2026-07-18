import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "8px",
          background: "#12182B",
          color: "#C7C9D6",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#0F6E56", secondary: "#E1F5EE" },
        },
        error: {
          iconTheme: { primary: "#A32D2D", secondary: "#FCEBEB" },
        },
      }}
    />
  );
}

export { toast } from "react-hot-toast";
