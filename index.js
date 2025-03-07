import { getPosts, getUserPosts, addPost } from './api.js'
import { renderAddPostPageComponent } from './components/add-post-page-component.js'
import { renderAuthPageComponent } from './components/auth-page-component.js'
import {
    ADD_POSTS_PAGE,
    AUTH_PAGE,
    LOADING_PAGE,
    POSTS_PAGE,
    USER_POSTS_PAGE,
} from './routes.js'
import { renderPostsPageComponent } from './components/posts-page-component.js'
import { renderUserPostsPageComponent } from './components/user-posts-page-component.js'
import { renderLoadingPageComponent } from './components/loading-page-component.js'
import {
    getUserFromLocalStorage,
    removeUserFromLocalStorage,
    saveUserToLocalStorage,
    sanitizeHtml,
} from './helpers.js'

export let user = getUserFromLocalStorage()
export let page = null
export let posts = []
export const setPosts = (newPosts) => {
    posts = newPosts
}

export const getToken = () => {
    // const token = user ? `Bearer ${user.token}` : undefined
    // return token
    return user ? `Bearer ${user.token}` : undefined
}

export const logout = () => {
    user = null
    removeUserFromLocalStorage()
    goToPage(POSTS_PAGE)
}

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
    if (
        [
            POSTS_PAGE,
            AUTH_PAGE,
            ADD_POSTS_PAGE,
            USER_POSTS_PAGE,
            LOADING_PAGE,
        ].includes(newPage)
    ) {
        if (newPage === ADD_POSTS_PAGE) {
            // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
            page = user ? ADD_POSTS_PAGE : AUTH_PAGE
            return renderApp()
        }

        if (newPage === POSTS_PAGE) {
            page = LOADING_PAGE
            renderApp()

            return getPosts({ token: getToken() })
                .then((newPosts) => {
                    page = POSTS_PAGE
                    posts = newPosts
                    // Обновляет страницу
                    renderApp()
                })
                .catch((error) => {
                    console.error(error)
                    alert('Не удалось загрузить посты. Попробуйте позже.')
                    // goToPage(POSTS_PAGE)
                })
        }

        if (newPage === USER_POSTS_PAGE) {
            // TODO: реализовать получение постов юзера из API
            // console.log("Открываю страницу пользователя: ", data.userId);
            // let userId = data.userId;
            page = LOADING_PAGE
            renderApp()
            return getUserPosts({
                userId: data.userId,
                token: getToken(),
            })
                .then((newPosts) => {
                    page = USER_POSTS_PAGE
                    posts = newPosts
                    return renderApp()
                })
                .catch((error) => {
                    console.error(error)
                    alert(
                        'Не удалось загрузить посты пользователя. Попробуйте позже.',
                    )
                })
        }

        page = newPage
        renderApp()
        return
    }

    throw new Error('Cтраницы не существует')
}

export const renderApp = () => {
    // event.stopPropagation()
    const appEl = document.getElementById('app')
    if (page === LOADING_PAGE) {
        return renderLoadingPageComponent({
            appEl,
            user,
            goToPage,
        })
    }

    if (page === AUTH_PAGE) {
        return renderAuthPageComponent({
            appEl,
            setUser: (newUser) => {
                user = newUser
                saveUserToLocalStorage(user)
                goToPage(POSTS_PAGE)
            },
            user,
            goToPage,
        })
    }

    if (page === ADD_POSTS_PAGE) {
        return renderAddPostPageComponent({
            appEl,
            onAddPostClick({ description, imageUrl }) {
                // TODO: реализовать добавление поста в API

                addPost({
                    token: getToken(),
                    description: sanitizeHtml(description),
                    imageUrl,
                }).then((responseData) => {
                    console.log(responseData)
                    goToPage(POSTS_PAGE)
                }).catch((error) => {
                    console.error('Ошибка при добавлении поста:', error);
                    alert('Не удалось добавить пост. Попробуйте позже.');
                });
                console.log('Добавляю пост...', { description, imageUrl })
            },
        })
    }

    if (page === POSTS_PAGE) {
        return renderPostsPageComponent({
            appEl,
        })
    }

    if (page === USER_POSTS_PAGE) {
        // TODO: реализовать страницу фотографию пользвателя
        // appEl.innerHTML = "Здесь будет страница фотографий пользователя";
        return renderUserPostsPageComponent({
            appEl,
        })
    }
}

goToPage(POSTS_PAGE)
