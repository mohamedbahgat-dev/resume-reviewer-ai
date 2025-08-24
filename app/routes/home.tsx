import type { Route } from "./+types/home";
import NavBar from '~/components/NavBar';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeWinner" },
    { name: "description", content: "Check your own resume" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <NavBar />

    <section className='main-section'>
      <div className = 'page-heading'>
        <h1>Check Your Resume & Improve Your Chances</h1>
        <h2>Track your submissions and get AI-powered feedback.</h2>
      </div>
    </section>



  </main>;
}
