import React from 'react';
import './Footer.css';

const footerLinks = [
    {
        name: "Twitter",
        url: "https://twitter.com/",
        svg: (
            <svg viewBox="0 0 24 24" className="footer-icon">
                <path fill="currentColor" d="M24 4.557a9.828 9.828 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.737 0-4.946 2.229-4.946 4.978 0 .39.045.765.128 1.125C7.728 8.935 4.1 6.961 1.67 3.691c-.427.747-.671 1.617-.671 2.545 0 1.757.891 3.302 2.248 4.21a4.902 4.902 0 0 1-2.241-.62c-.053 2.28 1.581 4.415 3.949 4.89-.386.109-.792.17-1.21.17-.297 0-.583-.029-.862-.082.584 1.84 2.279 3.176 4.294 3.212A9.874 9.874 0 0 1 0 20.407 13.925 13.925 0 0 0 7.548 22.5c9.142 0 14.307-7.721 14.307-14.421 0-.219-.004-.438-.015-.655a10.23 10.23 0 0 0 2.511-2.626z" />
            </svg>
        ),
        hover: "twitter"
    },
    {
        name: "GitHub",
        url: "https://github.com/",
        svg: (
            <svg viewBox="0 0 24 24" className="footer-icon">
                <path fill="currentColor" d="M12 .297c-6.6 0-12 5.4-12 12.067 0 5.334 3.438 9.849 8.205 11.441.6.111.82-.264.82-.586v-2.173c-3.338.728-4.042-1.644-4.042-1.644-.546-1.406-1.332-1.782-1.332-1.782-1.089-.761.082-.746.082-.746 1.205.086 1.839 1.256 1.839 1.256 1.07 1.858 2.807 1.321 3.492 1.011.107-.783.42-1.323.764-1.626-2.665-.31-5.467-1.349-5.467-6.006 0-1.326.465-2.409 1.235-3.24-.123-.312-.535-1.563.117-3.258 0 0 1.008-.324 3.301 1.23.957-.268 1.983-.402 3.003-.407 1.02.005 2.047.139 3.006.407 2.289-1.554 3.295-1.23 3.295-1.23.653 1.695.241 2.946.118 3.258.77.831 1.233 1.914 1.233 3.24 0 4.669-2.806 5.692-5.479 5.997.427.368.814 1.096.814 2.21v3.277c0 .325.218.703.825.584C20.565 22.208 24 17.694 24 12.364c0-6.667-5.4-12.067-12-12.067z" />
            </svg>
        ),
        hover: "github"
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com/",
        svg: (
            <svg viewBox="0 0 24 24" className="footer-icon">
                <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.85-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.413v1.561h.048c.476-.9 1.637-1.85 3.369-1.85 3.601 0 4.265 2.371 4.265 5.455v6.286zM5.337 7.433a2.073 2.073 0 1 1 0-4.145 2.073 2.073 0 0 1 0 4.145zm1.778 13.019H3.56V9h3.555v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.23.792 24 1.771 24h20.451C23.2 24 24 23.23 24 22.272V1.723C24 .771 23.2 0 22.225 0z" />
            </svg>
        ),
        hover: "linkedin"
    }
];

export default function Footer({ theme }) {
    return (
        <footer className={`footer ${theme}`}>
            <div className="footer-content">
                <span className="footer-logo">
                    <span className="footer-logo-text">🎥 Movie Galaxy</span>
                </span>
                <div className="footer-social">
                    {footerLinks.map(({ name, url, svg, hover }) => (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`footer-link ${hover}`}
                            title={name}
                        >
                            {svg}
                        </a>
                    ))}
                </div>
            </div>
            <div className={`footer-copyright ${theme}`}>
                &copy; {new Date().getFullYear()} Movie Galaxy. All Rights Reserved.
            </div>
        </footer>
    );
}
