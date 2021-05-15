import React from "react";
import Preloader from "./preloader";
import Navbar from "./navbar";
import Banner from "./banner";
import HowItWorks from "./howitworks";
import MeetTheTeam from "./MeetTheTeam";
import Pricing from "./Pricing";
import Screenshots from "./Screenshots";
import ResearchAndTestimonials from "./ResearchAndTestimonials";
import Contact from "./contact";

function Home() {
  return (
    <div>
      <Preloader />
      <Navbar />
      <Banner />
      <HowItWorks />
      <Pricing />
      <MeetTheTeam />
      <Screenshots />
      <ResearchAndTestimonials />
	    <Contact />
    </div>
  );
}

export default Home;
