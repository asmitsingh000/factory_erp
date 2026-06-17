import Navbar from "./components/navbar";
import Footer from "../components/footer";

export default function FactoryLayout({ children }) {
  return (
    // Parent container with strict 100vh height and hidden page scroll
    <div className="flex flex-col h-screen w-full bg-[#060913] overflow-hidden">
      
      {/* 1. Fixed Navbar */}
      <div className="shrink-0 z-50">
        <Navbar  />
      </div>

      {/* 2. Main Workspace (Takes only the remaining height) */}
      <main className="flex-1 w-full overflow-hidden relative">
        {children}
      </main>

      {/* 3. Fixed Footer */}
      <Footer />
      
    </div>
  );
}