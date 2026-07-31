import { useEffect } from "react"; // Import useEffect
import AOS from "aos";
import "aos/dist/aos.css";

import Banner from "../../components/home/Banner";
import FAQ from "../../components/home/FAQ";
import Features from "../../components/home/features/Features";
import NavBar from "../layouts/NavBar";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);
  return (
    <>
      <NavBar />
      <Banner />
      <Features />
      <FAQ />
    </>
  );
};

export default Home;
