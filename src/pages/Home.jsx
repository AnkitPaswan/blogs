// import { blogs } from "../data/posts";
import BlogCard from "../components/BlogCard";
import SocialMedia from "./Socialmedia";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="p-1 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
      <SocialMedia/>
    </div>

    

  );
}
