import { usePuterStore } from '~/lib/puter';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export const meta  = () => ([
  {title: 'ResumeWinner | Auth'},
  {name: 'description', content: 'Login to your account' },
])

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1]
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next)

  },[auth.isAuthenticated, next])


  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex justify-center items-center">
      <div className='gradient-border shadow-lg'>
        <section className = 'flex flex-col items-center justify-center gap-8 bg-white rounded-2xl p-10'>
          <div className='text-gradient flex flex-col items-center gap-2 text-center'>
            <h1 >Welcome</h1>
            <h2>Login to your account to continue your journey</h2>
          </div>

          <div>
            {isLoading ?
              (<button className='auth-button animate-pulse'>
                <p>Logging you in</p>
              </button>) :
              (<>
                {auth.isAuthenticated ? (
                  <button className='auth-button' onClick = {auth.signOut}>
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className='auth-button' onClick = {auth.signIn}>
                    <p>Log In</p>
                  </button>
                )}
              </>)}
          </div>

        </section>
      </div>


    </main>
  );
};

export default Auth;