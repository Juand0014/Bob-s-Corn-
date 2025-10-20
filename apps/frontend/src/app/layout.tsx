export const metadata = {
  title: "Bob's Corn",
  description: 'Fresh corn for everyone!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
