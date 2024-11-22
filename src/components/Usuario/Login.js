import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Login = ({ onLoginSuccess }) => {
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                correo: correo,
                pass: pass,
            }),
        });

        if (response.ok) {
            setMessage('Login exitoso');
            onLoginSuccess();
        } else {
            setMessage('Credenciales incorrectas');
        }
    };

    // Funcion que valida el PIN
    const requestPin = () => {
        Swal.fire({
            title: 'Ingrese el PIN',
            input: 'password',
            inputLabel: 'PIN',
            inputPlaceholder: 'Ingrese el PIN para acceder a este apartado',
            inputAttributes: {
                maxlength: 10,
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            preConfirm: (pin) => {
                if (pin === '1234') {
                    Swal.fire('Acceso concedido', '', 'success');
                    navigate('/Usuario/CreateUser'); // lleva a la ruta de registro al ingresar el pin correcto
                } else {
                    Swal.showValidationMessage('PIN incorrecto. Inténtelo de nuevo.');
                }
            },
        });
    };

    return (
        <section className="background-radial-gradient">
            <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                <div className="row gx-lg-5 align-items-center mb-5">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
                            El mejor sistema de ventas <br />
                            <span style={{ color: 'hsl(218, 81%, 75%)' }}>para tu negocio</span>
                        </h1>
                    </div>
                    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                        <div className="card bg-glass">
                            <div className="card-body px-4 py-5 px-md-5">
                                <form onSubmit={handleSubmit}>
                                    <h1>Inicie sesión</h1><br />
                                    <div className="form-outline mb-4">
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            required
                                        />
                                        <label className="form-label">Correo electrónico</label>
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={pass}
                                            onChange={(e) => setPass(e.target.value)}
                                            required
                                        />
                                        <label className="form-label">Contraseña</label>
                                    </div>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-block mb-4`}
                                    >
                                        Iniciar sesión
                                    </button>
                                    {message && (
                                        <p className={`alert ${message === 'Login exitoso' ? 'alert-success' : 'alert-danger'}`}>
                                            {message}
                                        </p>
                                    )}

                                    <p>
                                        ¿No tienes una cuenta?
                                        <button onClick={requestPin} className="link-info" style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                                            Registrar aquí
                                        </button>
                                    </p>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos de fondo y efectos */}
            <style jsx>{`
                html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }

                .background-radial-gradient {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: hsl(218, 41%, 15%);
                    background-image: radial-gradient(800px circle at 0% 0%,
                        hsl(218, 41%, 35%) 15%,
                        hsl(218, 41%, 30%) 35%,
                        hsl(218, 41%, 20%) 75%,
                        hsl(218, 41%, 19%) 80%,
                        transparent 100%),
                        radial-gradient(1250px circle at 100% 100%,
                        hsl(218, 41%, 45%) 15%,
                        hsl(218, 41%, 30%) 35%,
                        hsl(218, 41%, 20%) 75%,
                        hsl(218, 41%, 19%) 80%,
                        transparent 100%);
                }

                #radius-shape-1 {
                    height: 220px;
                    width: 220px;
                    top: -60px;
                    left: -130px;
                    background: radial-gradient(#44006b, #ad1fff);
                    overflow: hidden;
                }

                #radius-shape-2 {
                    border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
                    bottom: -60px;
                    right: -110px;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(#44006b, #ad1fff);
                    overflow: hidden;
                }

                .bg-glass {
                    background-color: hsla(0, 0%, 100%, 0.9) !important;
                    backdrop-filter: saturate(200%) blur(25px);
                }

                .alert {
                    margin-top: 15px;
                    padding: 10px;
                    border-radius: 5px;
                }

                .alert-success {
                    color: green;
                    border: 1px solid green;
                    background-color: rgba(0, 255, 0, 0.1);
                }

                .alert-danger {
                    color: red;
                    border: 1px solid red;
                    background-color: rgba(255, 0, 0, 0.1);
                }

                .btn-disabled {
                    background-color: #cccccc;
                    color: #666666;
                    cursor: not-allowed;
                }
            `}</style>
        </section>
    );
};

export default Login;

