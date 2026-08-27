import Brand from '../components/Brand'
import ThemeToggle from '../components/ThemeToggle'

function PublicLayout({ children }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container site-header__content">
          <Brand />
          <ThemeToggle />
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__content">
          <Brand />
          <p>Tu estilo, tu tiempo.</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
