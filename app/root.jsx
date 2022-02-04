import { Link, LiveReload, Outlet, Links, Meta, useLoaderData } from "remix";
import styles from "~/styles/globals.css";
import { getUser } from '~/utils/session.server';
export const links = () => [{
  rel: "stylesheet",
  href: styles
},
{
  rel: "icon",
  href: "https://i.ibb.co/Vt9YZRD/crayon.png"
}]
export const meta = () => {
  const description = 'Kids Write is a blogging platform for kids , where kids can share their knowledge with the world .'
  const keywords = 'kids , blogging , knowledge'
  return {
    description,
    keywords,
  }
}
export const loader = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user,
  }
  return data
}
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}
function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>{title ? title : 'Kids Write'}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  )
}
function Layout({ children }) {
  const { user } = useLoaderData()
  return (
    <>
      <nav className="navbar">
        <Link to="/">Kids Write</Link>
        <ul className="nav">
          <li><Link to="/posts">Posts</Link></li>
          {user ? (
            <li>
              <form action='/auth/logout' method='POST'>
                <button type='submit' className='btn'>
                  Logout
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to='/auth/login'>Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="container">
        {children}
      </div>
    </>
  )
}
export function ErrorBoundary({ error }) {
  console.log(error)
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  )
}
