import React from 'react';
import Header from './Header';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'


export default function Login({ onLogin }) {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isDirty, isValid }, clearErrors, reset } = useForm({ mode: 'onChange' });

    const emailRegister = register('email', {
        required: {
            value: true,
            message: 'Обязательное поле'
        },
        pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Введите email'
        }

    })

    const passwordRegister = register('password', {

        required: {
            value: true,
            message: 'Обязательное поле'
        },
        minLength: {
            value: 2,
            message: 'Минимальное число символов : 2'
        },
        maxLength: {
            value: 10,
            message: 'Максимальное число символов: 10'
        }
    })

    const handleSubmitForm = (data) => {
        onLogin({
            email: data.email,
            password: data.password
        }

        ).then(() => {
            navigate('/');
            reset();
        })
            .catch(console.error);
        
    }

    

    return (
        <>
            <Header>
                <NavLink to='/sign-up' className={'header__link opacity'}>Регистрация</NavLink>
            </Header>
            <div className={'login'}>
                <div className="login__container">
                    <h2 className="login__heading">Вход</h2>
                    <form action="#" className='login__form' name='login' onSubmit={handleSubmit(handleSubmitForm)}>
                        <input type="email" className="login__input" id="user-email" name="email"
                            placeholder="Введите ваш email" {...emailRegister} />
                        <span id="card-link-error" className={`login__input-error ${errors.email ? 'login__input-error_active' : ''}`}>{errors.email ? errors.email.message : ''}</span>
                        <input type="password" className="login__input" id="user-password" name="password"
                            placeholder="Введите ваше пароль" {...passwordRegister} />
                        <span id="card-link-error" className={`login__input-error ${errors.password ? 'login__input-error_active' : ''}`}>{errors.password ? errors.password.message : ''}</span>
                        <button disabled={!isDirty || !isValid} type="submit" className={`login__submit-btn ${!isDirty || !isValid ? 'popup__submit-btn_inactive' : ''}`}>Войти</button>
                    </form>
                </div>
            </div>

        </>
    )
}