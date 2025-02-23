import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Routes } from 'routes';
import App from './App';
import './index.css';
import NotFound from './NotFound';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
	{
		path: Routes.SIMULATION,
		element: <App />,
		errorElement: <NotFound />,
	},
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
	<React.StrictMode>
		{/* Theme: https://www.radix-ui.com/themes/docs/theme/overview */}
		<Theme accentColor="iris" grayColor="mauve" radius="full">
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</Theme>
	</React.StrictMode>
);
