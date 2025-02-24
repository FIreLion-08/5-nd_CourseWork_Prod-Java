import { getToken, renderApp, posts, setPosts } from '../index'
import { setLike, removeLike, getUserPosts } from '../api'

export const likeEventListener = () => {
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
