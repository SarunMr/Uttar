import { Code } from "lucide-react";
export default function AdminFooter() {
  return (
    <footer className="w-full bg-cyan-700 h-14 flex items-center justify-center text-white text-sm">
      <div className="flex items-center gap-2">
        <Code className="h-4 w-4 mr-1" />
        <span>
          Uttar Admin &copy; {new Date().getFullYear()} — Internal admin panel
        </span>
      </div>
    </footer>
  );
}
