import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          {/* Force specific style rules */}
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --foreground-rgb: 0, 0, 0;
              --background-start-rgb: 249, 249, 249;
              --background-end-rgb: 255, 255, 255;
            }
            
            @media (prefers-color-scheme: dark) {
              :root {
                --foreground-rgb: 255, 255, 255;
                --background-start-rgb: 28, 28, 30;
                --background-end-rgb: 46, 46, 50;
              }
            }
            
            body {
              color: rgb(var(--foreground-rgb));
              background: linear-gradient(
                to bottom,
                transparent,
                rgb(var(--background-end-rgb))
              ) rgb(var(--background-start-rgb));
              font-family: 'Inter', sans-serif;
            }

            /* HeartGlow specific colors - fallback for tailwind */
            .bg-heartglow-offwhite { background-color: #F9F9F9; }
            .bg-heartglow-charcoal { background-color: #1C1C1E; }
            .bg-heartglow-deepgray { background-color: #2E2E32; }
            .text-heartglow-pink { color: #FF4F81; }
            .text-heartglow-violet { color: #8C30F5; }
            .text-heartglow-indigo { color: #5B37EB; }
            .text-heartglow-offwhite { color: #F9F9F9; }
            .text-heartglow-charcoal { color: #1C1C1E; }

            /* Dark mode overrides */
            .dark .bg-heartglow-offwhite { background-color: #1C1C1E; }
            .dark .bg-heartglow-charcoal { background-color: #1C1C1E; }
            .dark .text-heartglow-charcoal { color: #F9F9F9; }
            .dark .text-heartglow-offwhite { color: #F9F9F9; }
            
            /* Form elements and buttons */
            input, button, select, textarea {
              font-family: 'Inter', sans-serif;
            }
            
            /* Button gradient fallbacks */
            .btn-gradient {
              background: linear-gradient(135deg, #FF4F81, #8C30F5);
            }
            
            /* Ensure login form styling */
            .login-form {
              background-color: white;
              border-radius: 0.5rem;
              padding: 2rem;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .dark .login-form {
              background-color: #2E2E32;
              color: #F9F9F9;
            }
          `}} />
        </Head>
        <body className="bg-heartglow-offwhite dark:bg-heartglow-charcoal">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 