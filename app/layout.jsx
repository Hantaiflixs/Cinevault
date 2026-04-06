export const metadata = {
  title: 'CineVault',
  description: 'Movies & Web Series Download',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
