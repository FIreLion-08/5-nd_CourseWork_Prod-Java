// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod

//const personalKey = "prod";
const personalKey = 'Dmitry_Avdoshkin'
const baseHost = 'https://webdev-hw-api.vercel.app'
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`

// Все посты в API
export function getPosts({ token }) {
    return fetch(postsHost, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Вы не авторизованы')
            }
            return response.json()
        })
        .then((data) => {
            return data.posts
        })
}

// Посты определённого пользователя в API
export function getUserPosts({ token, userId }) {
    return fetch(`${postsHost}/user-posts/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Вы не авторизованы')
            }

            return response.json()
        })
        .then((data) => {
            return data.posts
        })
}

//Добавление поста в API
export const addPost = ({ token, description, imageUrl }) => {
    return fetch(postsHost, {
        method: 'POST',
        body: JSON.stringify({
            description,
            imageUrl,
        }),
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.status === 400) {
            alert('Выберите фото и добавьте комментарий')
            throw new Error('Выберите фото и добавьте комментарий')
        }

        return response.json()
    })
}

// Удаление поста c API
export const deletePost = ({ token, postId }) => {
    return fetch(`${postsHost}/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.status === 401) {
            alert('Вы не авторизованы');
            throw new Error('Вы не авторизованы');
        }
        if (response.status === 404) {
            throw new Error('Пост не найден');
        }
        if (!response.ok) {
            throw new Error('Ошибка при удалении поста');
        }
        return response.json(); // или просто return, если не нужно возвращать данные
    });
}

// Добавление лайка на API
export const setLike = ({ token, postId }) => {
    return fetch(postsHost + '/' + postId + '/like', {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.status === 401) {
            alert('Вы не авторизованы')
            throw new Error('Вы не авторизованы')
        }

        return response.json()
    })
}

// Удаление лайка c API
export const removeLike = ({ token, postId }) => {
    return fetch(postsHost + '/' + postId + '/dislike', {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.status === 401) {
            throw new Error('Вы не авторизованы')
        }

        return response.json()
    })
}

// Регистрация нового пользователя в API
export function registerUser({ login, password, name, imageUrl }) {
    return fetch(baseHost + '/api/user', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
            name,
            imageUrl,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Такой пользователь уже существует')
        }
        return response.json()
    })
}

// Авторизация пользователя в API
export function loginUser({ login, password }) {
    return fetch(baseHost + '/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Неверный логин или пароль')
        }
        return response.json()
    })
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
    const data = new FormData()
    data.append('file', file)

    return fetch(baseHost + '/api/upload/image', {
        method: 'POST',
        body: data,
    }).then((response) => {
        return response.json()
    })
}
