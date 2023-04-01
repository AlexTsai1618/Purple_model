import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div>
    <Navbar />
    <div className="container">{children}</div>
  </div>
);

export default Layout;
