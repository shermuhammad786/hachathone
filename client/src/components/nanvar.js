function Navbar() {
    return (
      <nav className="p-4 flex items-center justify-between h-24" >
        <div className="flex items-center">
          <img src="/assets/sayl.png" className="w-36" alt="Company Logo" />
        </div>
        <div className="flex items-center">
          <img className="w-10 h-10 rounded-full mr-3" src="/assets/avatar.png" alt="User Avatar" />
          <span>Sher Muhammad</span>
        </div>
      </nav>
    );
  }

  export default Navbar