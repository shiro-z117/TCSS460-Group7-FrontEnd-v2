import { ReactElement } from 'react';

interface Props {
  children: ReactElement | ReactElement[];
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }: Props) {
  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center p-4"
      style={{
        backgroundColor: '#000000',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div className="w-full max-w-md" style={{ width: '100%', maxWidth: '28rem' }}>
        {children}
      </div>
    </div>
  );
}
