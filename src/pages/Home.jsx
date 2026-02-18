import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "../assets/hero.jpg";
import logoround from "../assets/logo-round.png";
import logo from "../assets/logo.png";



const Home = () => {
  const navigate = useNavigate();

  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ================= SCROLL DETECTION ================= */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      const sections = ["home", "about", "tutorial"];
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const offset = element.offsetTop - 120;
          if (scrollY >= offset) {
            setActive(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkStyle = (id) =>
    `relative cursor-pointer transition duration-300 ${
      active === id ? "text-green-400" : "text-gray-200"
    } after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-green-400 after:transition-all after:duration-300 ${
      active === id ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <div className="relative w-full font-sans text-white">

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0B1C2D]/95 via-[#0B1C2D]/90 to-[#07111B]/95" />

      {/* ================= NAVBAR ================= */}
      <nav
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${

          scrolled
            ? "bg-[#0B1C2D]/90 h-16 shadow-xl"
: "bg-[#0B1C2D]/70 h-16"



        } backdrop-blur-md border-b border-white/10`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-6 md:px-10 overflow-visible">


          {/* Logo */}
         <div
  className="cursor-pointer"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
  <img
    src={logo}
    alt="Logo"
    className="h-12 object-contain scale-150 origin-left"

  />
</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#home" className={navLinkStyle("home")}>Home</a>
            <a href="#about" className={navLinkStyle("about")}>About</a>
            <a href="#tutorial" className={navLinkStyle("tutorial")}>Tutorial</a>

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-md text-sm"
            >
              Login
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="text-white text-2xl focus:outline-none"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>

        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-72 bg-[#0B1C2D] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col items-center pt-20 gap-6 text-lg">



              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-sm shadow-lg">
                  <img src={logoround} alt="Logo" className="w-full h-full object-cover rounded-full" />

                </div>

              <a
                href="#home"
                onClick={() => setMobileOpen(false)}
                className="text-gray-200 hover:text-green-400 transition"
              >
                Home
              </a>

              <a
                href="#about"
                onClick={() => setMobileOpen(false)}
                className="text-gray-200 hover:text-green-400 transition"
              >
                About
              </a>

              <a
                href="#tutorial"
                onClick={() => setMobileOpen(false)}
                className="text-gray-200 hover:text-green-400 transition"
              >
                Tutorial
              </a>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="w-3/4 py-3 bg-green-500 rounded-full font-medium hover:bg-green-600 transition"
              >
                Login
              </button>

            </div>
          </div>
        </>
      )}

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center text-center px-6"
      >
        <div className="max-w-4xl mt-24">
          <p className="uppercase tracking-[0.25em] text-green-400 mb-4 text-xs md:text-sm">
            Civic Issue Reporting Platform
          </p>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            See It. Report It. Transform It.
            <br />
            <span className="text-green-400 block mt-2">
              Improve Your Community.
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            FixItNow transforms everyday complaints into real civic action — from potholes and broken streetlights to sanitation breakdowns — with full visibility from report to resolution.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-green-500 text-white rounded-full text-base font-semibold hover:bg-green-600 transition shadow-lg"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 bg-[#0B1C2D]/70 backdrop-blur-sm"
      >
        <div className="max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-semibold mb-6 text-green-400">
            About FixItNow
          </h3>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed text-left">
            FixItNow strengthens accountability in local governance by giving citizens a secure and structured way to report civic issues. Whether it’s damaged roads, sanitation breakdowns, malfunctioning streetlights, or other public infrastructure concerns, users can submit detailed reports with ease.
            <br /> Each submission is tracked through a transparent system that provides real-time status updates, ensuring visibility from initial report to final resolution.
            <br /> By connecting residents directly with responsible authorities and enabling continuous progress monitoring, FixItNow promotes responsiveness, builds public trust, and drives measurable improvements within communities.
          </p>
        </div>
      </section>

      {/* ================= TUTORIAL ================= */}
      <section
  id="tutorial"
  className="min-h-screen px-6 py-20 bg-[#07111B]/70 backdrop-blur-sm"
>
  <div className="max-w-6xl mx-auto">

    {/* Title */}
    <h3 className="text-3xl md:text-4xl font-semibold mb-12 text-green-400 text-center">
      How It Works
    </h3>

    {/* Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

      {/* Text Section */}
      <div className="text-base md:text-lg text-gray-300 leading-relaxed space-y-6 text-left">

        <div>
          <strong>1. Submit a Report:</strong> Citizens identify an issue in their community and submit a detailed report through the platform. Reports can include descriptions, locations, and supporting images to ensure clarity.
        </div>

        <div>
          <strong>2. Administrative Review:</strong> The submitted report is securely reviewed by an administrator to verify authenticity, categorize the issue, and assign it to the appropriate department.
        </div>

        <div>
          <strong>3. Department Resolution:</strong> The responsible department receives the verified report and initiates corrective action. Progress updates are recorded within the system to maintain transparency.
        </div>

        <div>
          <strong>4. Track Progress Transparently:</strong> Citizens can monitor the status of their report in real time — from verification to completion — ensuring accountability at every stage.
        </div>

      </div>

      {/* Video Placeholder */}
      <div className="w-full h-64 md:h-80 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
        <p className="text-gray-400 text-sm">
          Tutorial Video Coming Soon
        </p>
      </div>

    </div>
  </div>
</section>



      <footer className="bg-[#07111B] border-t border-gray-800 py-2">
  <div className="text-center text-gray-500 text-xs">
    © {new Date().getFullYear()} FixItNow. All rights reserved.
  </div>
</footer>




    </div>
  );
};

export default Home;
