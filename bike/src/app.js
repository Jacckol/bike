// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const PostgreSQLStore = require('connect-pg-simple')(session); 
const fileUpload = require("express-fileupload");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const winston = require('winston');
const fs = require('fs');
const crypto = require('crypto');
const hpp = require('hpp');
const toobusy = require('toobusy-js');
const cors = require('cors');

// Importar módulos locales 
const { POSTGRESHOST, POSTGRESUSER, POSTGRESPASSWORD, POSTGRESDATABASE, POSTGRESPORT } = require('./config/key.example');
require('./lib/passport');

// Importar conexiones a bases de datos
require('./database/dataBase.orm'); 
require('./database/dataBaseMongose'); 

// Crear aplicación Express
const app = express();

// ==================== CONFIGURACIÓN BÁSICA ====================
app.set('port', process.env.PORT || 4500);

// Habilitar CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true
}));

// ==================== CONFIGURACIÓN DE LOGS  ====================
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => {
            return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'app.log'),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 5,
            tailable: true
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Sobrescribir console.log
console.log = (...args) => logger.info(args.join(' '));
console.info = (...args) => logger.info(args.join(' '));
console.warn = (...args) => logger.warn(args.join(' '));
console.error = (...args) => logger.error(args.join(' '));
console.debug = (...args) => logger.debug(args.join(' '));

// Configurar Morgan
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            const cleanedMessage = message.replace(/\n$/, '');
            logger.info(cleanedMessage);
        }
    }
}));

// ==================== CONFIGURACIÓN DE SEGURIDAD ====================
app.use((req, res, next) => {
    if (toobusy()) {
        logger.warn('Server too busy!');
        res.status(503).json({ error: 'Server too busy. Please try again later.' });
    } else {
        next();
    }
});

app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Too many requests, please try again later.'
        });
    }
});
app.use(limiter);

app.use(cookieParser(
    process.env.COOKIE_SECRET || crypto.randomBytes(64).toString('hex'),
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
));

// Configuración de sesiones 
const sessionConfig = {
    store: new PostgreSQLStore({
        conString: `postgres://${POSTGRESUSER}:${POSTGRESPASSWORD}@${POSTGRESHOST}:${POSTGRESPORT}/${POSTGRESDATABASE}`,
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    },
    name: 'secureSessionId',
    rolling: true,
    unset: 'destroy'
};

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));
app.use(flash());

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(csrfProtection);
} else {
    console.log('⚠️ CSRF protection desactivada en desarrollo');
}


app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
    next();
});

app.use((req, res, next) => {
    for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
            req.query[key] = escape(req.query[key]);
        }
    }
    
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = escape(req.body[key]);
            }
        }
    }
    
    next();
});

// ==================== MIDDLEWARE ADICIONAL ====================
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true
}));

app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.apiResponse = (data, status = 200, message = '') => {
        const response = {
            success: status >= 200 && status < 300,
            message,
            data
        };
        return res.status(status).json(response);
    };
    
    res.apiError = (message, status = 400, errors = null) => {
        const response = {
            success: false,
            message,
            errors
        };
        return res.status(status).json(response);
    };
    
    next();
});

// ==================== RUTAS API ====================
// Importar rutas del sistema de alquiler de bicicletas
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);


// app.use('/api/auth', require('./routes/auth'));

// Configurar variables globales
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user || null;
    next();
});

// ==================== MANEJO DE ERRORES ====================
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);

    if (err.name === 'ValidationError') {
        return res.apiError('Validation error', 400, err.errors);
    }

    if (err.code === 'EBADCSRFTOKEN') {
        return res.apiError('CSRF token validation failed', 403);
    }

    const errorResponse = {
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };
    
    res.status(500).json(errorResponse);
});

app.use((req, res, next) => {
    logger.warn(`404 Not Found: ${req.originalUrl}`);
    res.apiError('Endpoint not found', 404);
});

module.exports = app;