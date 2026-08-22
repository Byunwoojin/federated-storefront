interface NavBarProps {
  children: React.ReactNode;
}

export default function NavBar({ children }: NavBarProps) {
  return (
    <nav className="flex felx-wrap items-center gap-2 border-b border-border p-4">
      {children}
    </nav>
  );
}
