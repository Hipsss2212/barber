import { createBrowserRouter } from 'react-router-dom';
import routes from '../config/routesConfig';
import PrivateRoute from './privateRouters/PrivateRoute';
import PublicRoute from './publicRouters/PublicRoute';
import VerifyEmail from '../components/VerifyEmail';

const router = createBrowserRouter(
    routes.map((route) => {
        if (route.private) {
            return {
                path: route.path,
                element: <PrivateRoute>{route.element}</PrivateRoute>,
            };
        }
        return {
            path: route.path,
            element: <PublicRoute>{route.element}</PublicRoute>,
        };
    })
);

export default router;