import './globals.css';

export const metadata = {
  title: 'YT Shorts Downloader',
  description: 'Download video YouTube Shorts jadi MP4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/download">Download YouTube</a>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
