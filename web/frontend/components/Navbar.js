import Link from 'next/link';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container">
      <a className="navbar-brand" >Purple Model</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav ml-auto justify-content-end">
          
            <Link className="nav-item nav-link" href="/">
             Home</Link>
          
            <Link className="nav-item nav-link" href="/attack">
             Attack</Link>
          
            <Link className="nav-item nav-link" href="/defend">
             Defend</Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
