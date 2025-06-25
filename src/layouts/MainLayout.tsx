import Sidebar from "../components/Sidebar.tsx";
import type {ReactNode} from "react";
import Header from "../components/Header.tsx";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-4 overflow-y-auto">{children}</main>
        </div>
      </div>
  );
}