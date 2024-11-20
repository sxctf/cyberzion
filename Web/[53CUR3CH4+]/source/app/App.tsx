import './theme-checker';
import { LoginPage } from './pages/login';
import { ChatPage } from './pages/chat';
import './index.css';

const uuid = localStorage.getItem('uuid');

export const App = () => {
    if (!uuid) return <LoginPage />;

    return <ChatPage />;
};
