import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MovieDetailsView from '../views/MovieDetailsView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/filme/:id',
        name: 'detalhes',
        component: MovieDetailsView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router