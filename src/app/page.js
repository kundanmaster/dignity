import Footer from "../components/client/common/Footer";
import Header from "../components/client/common/Header";
import Banner from "../components/client/home/Banner";
import Courses from "../components/client/home/Courses";
import Instructor from "../components/client/home/Instructor";
import TrainingCenter from "../components/client/home/TrainingCenter";
import ScheduleUI from "../components/client/home/ScheduleUI";
import Testimonials from "../components/client/home/Testimonials";
import { cookies } from "next/headers";
export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <main className="bg-gradient-to-r from-[#eee] to-[#ca8a0426]">
      <Header token={token}/>
      <Banner />
      <Courses />
      <TrainingCenter />
      <ScheduleUI />
      <Instructor />
      <Testimonials />
      <Footer />
    </main>
  );
}
