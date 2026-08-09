import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('Error capturado por ErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg m-6">
                    <p className="font-semibold">Ocurrió un error al cargar esta vista.</p>
                    <p className="text-sm mt-2">{this.state.error?.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
}
