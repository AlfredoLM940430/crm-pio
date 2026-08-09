require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { dbConection } = require('./database/config');
const iniciarVerificacionDeProspectos = require('./notifications/iniciarVerificacionDeProspectos');
const Colaborador = require('./models/Colaborador');

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://127.0.0.1:5173';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.set('socketio', io);

const validarSocketToken = (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error('No hay token en la petición'));
    }

    try {
        const { id, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        socket.uid = id;
        socket.name = name;
        next();
    } catch (error) {
        console.error('Error al validar socket token:', error.message);
        return next(new Error('Token vencido o no válido'));
    }
};

io.use(validarSocketToken);

io.on('connection', async (socket) => {
    if (!socket.uid) return;

    socket.join(socket.uid.toString());

    try {
        const colaborador = await Colaborador
            .findById(socket.uid)
            .select('branch userLevel')
            .lean();

        if (!colaborador) {
            console.warn(`⚠️ Colaborador no encontrado para socket uid ${socket.uid}`);
            return;
        }

        const { userLevel, branch } = colaborador;

        if (userLevel === '7') {
            console.log(`🟢 ${socket.name} (${socket.id}) conectado - nivel 7, sin notificaciones`);
        } else if (['2', '3', '4'].includes(userLevel)) {
            socket.join('supervisores');
            console.log(`🟢 ${socket.name} (${socket.id}) conectado -> sala: supervisores`);
        } else if (branch) {
            const branchRoom = `branch:${branch.toString()}`;
            socket.join(branchRoom);
            console.log(`🟢 ${socket.name} (${socket.id}) conectado -> sala: ${branchRoom}`);
        }
    } catch (error) {
        console.error('Error al unir socket a room de branch/nivel:', error.message);
    }

    socket.on('disconnect', () => {});
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

const iniciar = async () => {
    await dbConection();

    app.use(helmet());
    app.use(compression());
    app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
    app.use(express.json());
    app.use(express.static('public', {
        maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    }));

    app.use('/api', require('./routes/auth'));
    app.use('/api', require('./routes/candidato'));
    app.use('/api', require('./routes/colaborador'));
    app.use('/api', require('./routes/notificaciones'));

    iniciarVerificacionDeProspectos(io);

    server.listen(process.env.PORT, () => {
        console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
    });
};

iniciar().catch((err) => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
});