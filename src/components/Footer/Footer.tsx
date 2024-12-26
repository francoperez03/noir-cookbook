import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a
          href="https://github.com/francoperez03"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <img
            src="/github-icon.svg"
            alt="GitHub"
            className="footer-icon"
          />
          GitHub
        </a>
        <a
          href="https://x.com/crypto_dev_1"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <img
            src="/x-icon.png"
            alt="X"
            className="footer-icon"
          />
          X
        </a>
      </div>
    </footer>
  );
}

export default Footer;
