import type { Route } from "./+types/home";
import NavBar from '~/components/NavBar';
import { resumes } from '../../constants';
import ResumeCard from '~/components/ResumeCard';
import { usePuterStore } from '~/lib/puter';
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeWinner" },
    { name: "description", content: "Check your own resume" },
  ];
}

export default function Home() {

  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/')

  },[auth.isAuthenticated])

  return <main className="bg-[url('/images/bg-small.svg')] bg-cover">
    <NavBar />

    <section className='main-section'>
      <div className = 'page-heading'>
        <h1>Check Your Resume & Improve Your Chances</h1>
        <h2>Track your submissions and get AI-powered feedback.</h2>
      </div>

      {resumes.length > 0 && (
        <div className='resumes-section'>
          {resumes.map((resume)=> (
            <ResumeCard key = {resume.id} resume = {resume}  />
          ))}
        </div>
      )}
    </section>

  </main>;
}
