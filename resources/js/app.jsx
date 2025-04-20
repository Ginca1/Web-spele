import '../css/app.css';
import '../css/css.css';
import '../css/icon.css';
import '../css/modal.css';
import '../css/Leaderboard.css';
import '../css/History.css';
import '../css/Lobby.css';
import './bootstrap';
import '../../public/images/back.jpg';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react'; 
import GlobalCursor from '@/Components/GlobalCursor'; 

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Wrapper component that
function AppWrapper({ children }) {
  return (
    <>
      <GlobalCursor />
      {children}
    </>
  );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        root.render(
          <AppWrapper>
            <App {...props} />
          </AppWrapper>
        );
    },
    progress: {
        color: '#4B5563',
    },
});