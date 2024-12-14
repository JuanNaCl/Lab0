import React, { useState, useEffect } from 'react';

interface PopupProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ message, show, onClose }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [show]);

    if (!visible) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-lg p-6 shadow-lg transition-transform duration-300 transform ${show ? 'scale-100' : 'scale-95'}`}>
                <p>{message}</p>
                <div className="flex justify-end">
                    <button className=" mt-4 px-10 py-2 bg-emerald-500 text-white rounded" onClick={onClose}>
                        Cerrar
                    </button>                
                </div>
            </div>
        </div>
    );
};