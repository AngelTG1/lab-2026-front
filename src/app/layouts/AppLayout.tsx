import { Outlet,} from 'react-router-dom';
import Header from '../../shared/components/Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../shared/hooks/useAuth';

export function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='flex'>
      {isAuthenticated && <Sidebar />}

      <div className={`flex-1 transition-all duration-300 ${isAuthenticated ? 'ml-18 md:ml-52' : ''}`}>
        {isAuthenticated && <Header />}
        <div className='px-10 py-5'>
          <Outlet />          
        </div>
      </div>
    </div>
  );
}
