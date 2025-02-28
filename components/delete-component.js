import { deletePost } from '../api'
import { getToken, setPosts, renderApp } from '../index'

// Удаление поста
export const deleteEventListener = (posts) => {
    const deleteButtons = document.querySelectorAll('.delete-button')

    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const postId = deleteButton.dataset.postId

            if (confirm('Вы уверены, что хотите удалить этот пост?')) {
                deletePost({ token: getToken(), postId })
                    .then(() => {
                        // Удаляем пост из массива posts
                        const updatedPosts = posts.filter(
                            (post) => post.id !== postId,
                        )
                        setPosts(updatedPosts)
                        renderApp() // Обновляем приложение
                    })
                    .catch((error) => {
                        console.error('Ошибка при удалении поста:', error)
                        alert('Не удалось удалить пост')
                    })
            }
        })
    })
}
