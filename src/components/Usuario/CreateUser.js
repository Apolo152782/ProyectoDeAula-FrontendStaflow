import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [rol, setRol] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuario = {
            id,
            nombre,
            correo,
            pass,
            rol
        };

        const response = await fetch('http://localhost:8080/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        if (response.ok) {
            Swal.fire({
                title: 'Registro exitoso',
                text: 'El usuario ha sido registrado correctamente',
                icon: 'success',
                confirmButtonText: 'Ir al inicio',
                showCancelButton: true,
                cancelButtonText: 'Seguir registrando',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });

            // Limpiar el formulario
            setId('');
            setNombre('');
            setCorreo('');
            setPass('');
            setRol('');
        } else {
            Swal.fire('Error', 'Hubo un problema al registrar el usuario', 'error');
        }
    };

    const handleClick = () => {
        navigate('/');
    };

    // Verificar que los cmapos esten completos
    const isFormValid = () => {
        return id && nombre && correo && pass && rol;
    };

    return (
        <section className="background-radial-gradient">
            <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                <button type="button" className="btn btn-secondary position-absolute top-0 end-0 m-3" onClick={handleClick}>
                    Regresar al inicio
                </button>

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
                                    <h1>Registrarse</h1><br />

                                    <div className="form-outline mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                        />
                                        <label className="form-label">Id</label>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                        <label className="form-label">Nombre</label>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                        />
                                        <label className="form-label">Correo electrónico</label>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={pass}
                                            onChange={(e) => setPass(e.target.value)}
                                        />
                                        <label className="form-label">Contraseña</label>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={rol}
                                            onChange={(e) => setRol(e.target.value)}
                                        />
                                        <label className="form-label">Rol</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block mb-4"
                                        disabled={!isFormValid()} // omite el boton si el formulario no es valido
                                    >
                                        Registrarse
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                    background-image: radial-gradient(800px circle at 0% 0%, hsl(218, 41%, 35%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%), radial-gradient(1250px circle at 100% 100%, hsl(218, 41%, 45%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%);
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

                .btn-disabled {
                    background-color: #cccccc;
                    color: #666666;
                    cursor: not-allowed;
                }
            `}</style>
        </section>
    );
};

export default CreateUser;
