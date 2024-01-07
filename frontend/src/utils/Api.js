
function getToken() {
    const token = localStorage.getItem('jwt');
    return token;
}
export class Api {
    constructor({ baseUrl }) {
        this.baseUrl = baseUrl;
    }


    //Метод для обработки ошибке в запросе
    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    }

    //Функция создания запроса
    _request(url, options) {
        return fetch(`${this.baseUrl}` + `${url}`, options).then(this._checkResponse)

    }

    //Метод для запроса карточек с сервера
    getInitialCards() {
        return this._request(`/cards`, {
            headers: {
                authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        })
    }

    //Метод для запроса текущего пользователя с сервера
    getUserInfo() {
        return this._request(`/users/me`, {
            headers: {
                authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        })
    }

    //Метод для обновления данных пользователя на сервере
    editingProfile({ name, about }) {
        return this._request(`/users/me`, {
            headers: {
                authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                name: name,
                about: about
            })
        })
    }

    //Метод для добавления карточки пользователя на сервер
    setUserCard({ name, link }) {
        return this._request(`/cards`, {
            headers: {
                authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
    }

    //Метод для удаления карточки пользователя с сервера
    deleteCard(id) {
        return this._request(`/cards/${id}/`, {
            headers: {
                authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        })
    }

    //Метод для добавления лайка пользователя на сервер
    changeLikeCardStatus(id, isLiked) {
        if (!isLiked) {
            return this._request(`/cards/${id}/likes`, {
                headers: {
                    authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
            })
        } else {
            return this._request(`/cards/${id}/likes`, {
                headers: {
                    authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
            })
        }
    }


    //Метод для изменения аватара пользователя на сервере
    setAvatar(url) {
        return this._request(`/users/me/avatar`, {
            headers: {
                authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                avatar: url
            })
        })
    }

}


const api = new Api({
    baseUrl: 'https://api.terennikov.students.nomoredomainsmonster.ru',
});

export default api;
