
import '../../src/index.css';
import React from 'react';
import Header from './Header.jsx';
import Main from './Main.jsx';
import Footer from './Footer.jsx';
import ImagePopup from './ImagePopup.jsx';
import { useEffect, useState } from 'react';
import api from "../utils/Api.js";
import { CurrentUserContext } from '../context/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup.jsx';
import EditAvatarPopup from './EditAvatarPopup.jsx';
import AddPlacePopup from './AddPlacePopup.jsx';
import DeleteConfirmationPopup from './DeleteConfirmationPopup.jsx';
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Login';
import Register from './Register';
import { NavLink } from 'react-router-dom';
import { login, register, checkToken } from '../utils/auth.js';
import InfoTooltip from './InfoTooltip';
import ProtectedRouteElement from './ProtectedRouteElement.jsx';


function App() {

  const navigate = useNavigate()

  const [isDeleteConfirmationPopupOpen, setIsDeleteConfirmationPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [cardDelete, setCardDelete] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('')
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [headingText, setHeadingText] = useState('')



  function handleAddPlaceSubmit({ name, link }) {
    function makeRequest() {
      return api.setUserCard({ name, link })
        .then(res => {
          setCards([res, ...cards]);

        })
    }
    handleSubmit(makeRequest);
  }

  function handleCardLike(card, setCards) {
    const isLiked = card.likes.some(id => id === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(console.error);
  }

  function handleCardDelete(card, setCards) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => { return c._id !== card._id }))
        closeAllModals();

      })
      .catch(console.error);
  }

  function handleUpdateAvatar(url) {
    function makeRequest() {
      return api.setAvatar(url)
        .then(res => {
          setCurrentUser(res);
        })
    }
    handleSubmit(makeRequest);

  }

  function handleUpdateUser({ name, about }) {
    function makeRequest() {
      return api.editingProfile({ name, about })
        .then(res => {
          setCurrentUser(res);
        })
    }
    handleSubmit(makeRequest);
  }

  // универсальная функця, которая принимает функцию запроса
  function handleSubmit(request) {
    setIsLoading(true);
    request()
      .then(closeAllModals)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  // Проверка авторизации 


  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    
    if (jwt) {
      checkToken(jwt)
      .then(() => {
        setUserEmail(JSON.stringify(localStorage.getItem('email')).replace(/\"/g, ""));
        setLoggedIn(true)
        navigate('/')
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log('400 — Токен не передан или передан не в том формате')
        } else if (err.status === 401) {
          console.log('401 — Переданный токен некорректен  ')
        }
        navigate('/sign-in')
      })
      Promise.all([api.getInitialCards(), api.getUserInfo()])
      .then(([cardsData, userData]) => {
        setCards(cardsData);
        setCurrentUser(userData)
      })
      .catch((err)=> console.error(err));
    };
    // api.getInitialCards()
    // .then(setCards).catch(console.error);
    //  api.getUserInfo()
    // .then(setCurrentUser).catch(console.error);
  },[navigate,loggedIn])




  // Колбэк для логина пользователя
  function handleLogin({ email, password }) {
    localStorage.setItem('email', email);
    setUserEmail(email);
    return login({ email, password })
      .then(res => {
        if (res.token) {
          localStorage.setItem('jwt', res.token)
          setLoggedIn(true)
        }
      })
      .catch(err => {
        if (err.status === 400) {
          console.log('400 - не передано одно из полей ')
        } else if (err.status === 401) {
          console.log('401 - пользователь с email не найден ')
        }
      })
  }

  // Колбэк для регистрации

  function handleRegister({ email, password }) {
    return register({ email, password })
      .then((res) => {
        setIsSuccess(true);
        setHeadingText('Вы успешно зарегестировались!')
        return res;
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log('400 - некорректно заполнено одно из полей')
        }

        setIsSuccess(false);
        setHeadingText('Что-то пошло не так...')
      })
      .finally(() => {
        setIsInfoTooltipOpen(true);
      })
  }

  // Обработчик закрытие попапа по кнопке Esc
  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard || isDeleteConfirmationPopupOpen || isInfoTooltipOpen

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllModals();
      }
    }
    if (isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  function handleLoggout() {
    localStorage.clear();
  }

  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
  }


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function showDeletePopup(card) {
    setCardDelete(card);
    setIsDeleteConfirmationPopupOpen(true);
  }

  function closeAllModals() {
    setIsDeleteConfirmationPopupOpen(false)
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);

  }
  return (

    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route path="/" element={<ProtectedRouteElement loggedIn={loggedIn} path="/">

          <Header>
            <div className={'header__container'}>
              <p className={'header__user-email'}>{userEmail}</p>
              <NavLink to='/sign-in' className={'header__link header__link_loged_in opacity'} onClick={handleLoggout}>Выход</NavLink>
            </div>

          </Header>
          <Main
            setCards={setCards}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onTrashClick={showDeletePopup}

          />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllModals} onUpdateUser={handleUpdateUser} isLoading={isLoading} />
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllModals} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading}></EditAvatarPopup>
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllModals} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading}></AddPlacePopup>
          <DeleteConfirmationPopup isOpen={isDeleteConfirmationPopupOpen} onClose={closeAllModals} onCardDelete={handleCardDelete} card={cardDelete} setCards={setCards}></DeleteConfirmationPopup>
          <ImagePopup
            card={selectedCard}
            onClose={closeAllModals}
          />
          <Footer />

        </ProtectedRouteElement>}></Route>
        <Route path='/sign-up' element={<Register onRegister={handleRegister} />} />
        <Route path='/sign-in' element={<Login onLogin={handleLogin} />} />
      </Routes>
      {isInfoTooltipOpen > 0 && <InfoTooltip isSuccess={isSuccess} onClose={closeAllModals} headingText={headingText} />}
    </CurrentUserContext.Provider>



  );
}

export default App;