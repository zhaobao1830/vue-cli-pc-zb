import homeRouter from './home-router'

const Login = () => import('@/views/login/login')
const Home = () => import('@/views/home/home')
const AppMain = () => import('@/components/layout/appMain/AppMain.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/about',
    component: Home,
    children: [
      ...homeRouter
    ]
  },
  {
    path: '/appMain',
    name: 'appMain',
    component: AppMain
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
export default routes
