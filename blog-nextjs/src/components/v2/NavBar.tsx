import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className="v2-nav">
      <div className="v2-nav-inner">
        <Link href="/" className="v2-nav-logo">
          <Image
            src="/images/basetube-logo.png"
            alt="Base.Tube"
            width={120}
            height={40}
            priority
            className="v2-nav-logo-img"
          />
        </Link>

        <ul className="v2-nav-links">
          <li>
            <a href="#how-it-works">How it Works</a>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <a href="https://base-tube.gitbook.io/base.tube-documentation" target="_blank" rel="noopener noreferrer">
              Docs
            </a>
          </li>
        </ul>

        <a
          href="https://beta.base.tube/sign-up"
          target="_blank"
          rel="noopener noreferrer"
          className="v2-nav-cta"
        >
          Join Beta →
        </a>
      </div>
    </nav>
  );
}
