import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

export default function Login() {
    
const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const result = await login(email, password);
            if (result.ok) {
                navigate('/dashboard', { replace: true });
            } else {
                setError(result.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            console.log(err);
            setError('Error al iniciar sesión, intenta de nuevo');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm space-y-4"
            >
                <h1 className="text-xl font-semibold text-stone-900">Iniciar sesión</h1>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 rounded-md p-2">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm text-stone-600 mb-1">Correo</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                </div>

                <div>
                    <label className="block text-sm text-stone-600 mb-1">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-stone-900 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
                >
                    {submitting ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}
