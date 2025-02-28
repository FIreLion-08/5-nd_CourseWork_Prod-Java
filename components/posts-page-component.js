import { USER_POSTS_PAGE } from '../routes'
import { renderHeaderComponent } from './header-component'
import { posts, goToPage, getToken, renderApp, setPosts } from '../index'
import { formatDistanceToNow } from '../node_modules/date-fns'
import { ru } from '../node_modules/date-fns/locale'
import { setLike, removeLike, getPosts } from '../api'
import { sanitizeHtml } from '../helpers'

import { deleteEventListener } from './delete-component' // Импортируем удаление

export function renderPostsPageComponent({ appEl }) {
    console.log('Актуальный список постов:', posts)

    const appPosts = posts.map((post) => {
        return {
            userImageUrl: post.user.imageUrl,
            userName: sanitizeHtml(post.user.name),
            userId: post.user.id,
            imageUrl: post.imageUrl,
            description: sanitizeHtml(post.description),
            userLogin: sanitizeHtml(post.user.login),
            date: formatDistanceToNow(new Date(post.createdAt), { locale: ru }),
            likes: post.likes,
            isLiked: post.isLiked,
            id: post.id,
        }
    })

    const appHtml = appPosts
        .map((element, index) => {
            return `
        <div class="page-container">
            <div class="header-container"></div>
            <ul class="posts">
                <li class="post" data-index=${index}>
                    <div class="post-header" data-user-id="${element.userId}">
                        <img src="${element.userImageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${element.userName}</p>
                    </div>
                    <div class="post-image-container">
                        <img class="post-image" src="${element.imageUrl}">
                    </div>
                    <div class="post-likes-delete">
                      <div class="post-likes">
                          <button data-post-id="${element.id}" data-like="${element.isLiked ? 'true' : ''}" data-index="${index}" class="like-button">
                              <img src="${element.isLiked ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg`}">
                          </button>
                          <p class="post-likes-text">
                              Нравится: <strong>${element.likes.length >= 1 ? element.likes[0].name : '0'}</strong> ${element.likes.length - 1 > 0 ? 'и ещё' + ' ' + (element.likes.length - 1) : ''}
                          </p>
                      </div>
                      <button class="delete-button" data-post-id="${element.id}">
                        <!-- Кнопка удаления -->
                        <img src="./assets/images/remove.svg" alt="Удалить" class="delete-icon">
                        <!-- Изображение для кнопки удаления -->
                      </button>
                    </div>
                    <p class="post-text">
                        <span class="user-name">${element.userName}</span>
                        ${element.description}
                    </p>
                    <p class="post-date">
                        ${element.date} назад
                    </p>

                </li>
            </ul>
        </div>`
        })
        .join('') // Объединяем массив строк в одну строку

    appEl.innerHTML = appHtml

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }

    const likeEventListener = () => {
        const likeButtons = document.querySelectorAll('.like-button')

        likeButtons.forEach((likeButton) => {
            likeButton.addEventListener('click', (event) => {
                event.stopPropagation()
                const postId = likeButton.dataset.postId
                const index = likeButton.dataset.index
                likeButton.classList.add('shake-bottom')

                if (posts[index].isLiked) {
                    removeLike({ token: getToken(), postId })
                        .then(() => {
                            posts[index].isLiked = false
                        })
                        .then(() => {
                            getPosts({ token: getToken() }).then((response) => {
                                setPosts(response)
                                likeButton.classList.remove('shake-bottom')
                                renderApp()
                            })
                        })
                } else {
                    setLike({ token: getToken(), postId })
                        .then(() => {
                            posts[index].isLiked = true
                        })
                        .then(() => {
                            getPosts({ token: getToken() }).then((response) => {
                                setPosts(response)
                                likeButton.classList.remove('shake-bottom')
                                renderApp()
                            })
                        })
                }
            })
        })
    }

    likeEventListener()
    deleteEventListener(posts) // Cобытие для кнопок удаления
}
