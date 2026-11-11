import "./globals.css";

export const metadata = {
  title: "Student Management System",
  description: "Minimal CRUD application for managing student records.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
