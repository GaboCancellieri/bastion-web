import React, { useState, useEffect } from 'react';
import styles from './completeReserva.module.scss';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { appFirebase } from '../../../../../firebase';

const db = getFirestore(appFirebase);

export default function CompleteReserva() {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        cantidadPersonas: 1,
        chocolates: 0,
        toallones: 0,
        toallas: 0,
    });

    const [reservaDates, setReservaDates] = useState<{ startDate: string; endDate: string; cantidadPersonas: number } | null>(null);
    const [reservaInfo, setReservaInfo] = useState<{ total: number; reserva: number } | null>(null);

    useEffect(() => {
        const storedDates = localStorage.getItem('reservaDate');
        if (storedDates) {
            const parsedDates = JSON.parse(storedDates);
            setReservaDates({
                startDate: new Date(parsedDates.startDate).toLocaleDateString(),
                endDate: new Date(parsedDates.endDate).toLocaleDateString(),
                cantidadPersonas: parsedDates.cantidadPersonas,
            });
        }

        const storedInfo = localStorage.getItem('reservaInfo');
        if (storedInfo) {
            const parsedInfo = JSON.parse(storedInfo);
            setReservaInfo(parsedInfo);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { nombre, telefono, email } = formData;

        if (!nombre.trim()) {
            alert('El nombre es obligatorio.');
            return false;
        }

        const phoneRegex = /^[0-9]{10,}$/;
        if (!telefono.match(phoneRegex)) {
            alert('El teléfono debe contener al menos 10 dígitos.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            alert('Por favor, introduce un correo electrónico válido.');
            return false;
        }

        return true; // Todo es válido
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        const confirmed = window.confirm("¿Estás seguro de que deseas continuar con la reserva?");
        if (!confirmed) {
            return; 
        }

        const reservaData = {
            ...formData,
            startDate: reservaDates?.startDate,
            endDate: reservaDates?.endDate,
            createdAt: new Date(),  
        };

        try {
            const docRef = await addDoc(collection(db, 'reservas'), reservaData);
            console.log("Reserva guardada con ID: ", docRef.id);
            alert("Reserva realizada con éxito"); 
        } catch (error) {
            console.error("Error al guardar la reserva: ", error);
            alert("Error al realizar la reserva. Intenta nuevamente."); 
        }
    };

    return (
        <div className={styles.completeReservaContainer}>
            <h2>Datos de la reserva</h2>

            {reservaDates && (
                <p>
                    Fechas de Reserva: {reservaDates.startDate} - {reservaDates.endDate}
                </p>
            )}

            {reservaInfo && (
                <div>
                    <p>
                        Precio Total: ${reservaInfo.total.toLocaleString()} <br />
                        Reserva: ${reservaInfo.reserva.toLocaleString()}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="cantidadPersonas">Cantidad de Personas:</label>
                    <select
                        id="cantidadPersonas"
                        name="cantidadPersonas"
                        value={reservaDates?.cantidadPersonas || 1}  
                        onChange={handleChange}
                        disabled  
                    >
                        {Array.from({ length: 10 }, (_, num) => (
                            <option key={num} value={num + 1}>
                                {num + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="chocolates">Cantidad de Chocolates:</label>
                    <select
                        id="chocolates"
                        name="chocolates"
                        value={formData.chocolates}
                        onChange={handleChange}
                        required
                    >
                        {Array.from({ length: 11 }, (_, num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="toallones">Cantidad de Toallones:</label>
                    <select
                        id="toallones"
                        name="toallones"
                        value={formData.toallones}
                        onChange={handleChange}
                        required
                    >
                        {Array.from({ length: 11 }, (_, num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="toallas">Cantidad de Toallas:</label>
                    <select
                        id="toallas"
                        name="toallas"
                        value={formData.toallas}
                        onChange={handleChange}
                        required
                    >
                        {Array.from({ length: 11 }, (_, num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className={styles.submitButton}>
                    Siguiente
                </button>
            </form>
        </div>
    );
}