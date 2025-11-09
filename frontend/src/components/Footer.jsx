export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="brand">Matcha Dance</div>
        <div className="copy">© {new Date().getFullYear()} Matcha Dance. All rights reserved.</div>
      </div>
    </footer>
  );
}
