const mineflayer = require('mineflayer');

function createBot() {
    console.log('[BOT] Intentando conectar...');

    const bot = mineflayer.createBot({
        host: 'survivalpigsaw.aternos.me:30396',
        port: 30396,
        username: 'BotterPilly',
        version: '1.21.1', // 1. RECOMENDADO: Pon la versión EXACTA de tu servidor en vez de 'false'
        hideErrors: false, // Cambiado a false para que veas el motivo real si hay un kick previo
        checkTimeoutInterval: 60 * 1000, // 2. Verifica la conexión cada 60 segundos
    });

    // Evento previo al spawn para verificar que la conexión se estableció correctamente
    bot.once('login', () => {
        console.log('[BOT] Autenticado en el servidor. Esperando spawn...');
    });

    bot.once('spawn', () => {
        console.log('[BOT] ¡Entró correctamente!');
        
        // Auto login
        setTimeout(() => {
            bot.chat('/login yeribel'); 
            console.log('[BOT] Intentando login...');
        }, 3000); // Subido a 3 segundos para asegurar que el terreno cargó

        // Rutina anti-AFK más realista
        setInterval(() => {
            if (!bot.entity) return;

            // 3. Forzar al bot a mirar e interactuar con el entorno de forma más humana
            bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.6, true);

            const dirs = ['forward', 'back', 'left', 'right'];
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            bot.setControlState(dir, true);
            
            setTimeout(() => {
                bot.setControlState(dir, false);
            }, 800 + Math.random() * 800);

            if (Math.random() < 0.4) {
                setTimeout(() => {
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 350);
                }, 200);
            }

            // 4. Enviar un mensaje de estado oculto o comando vacío para mantener el socket activo
            // bot.swingArm('right'); // Mueve el brazo para enviar paquetes de animación al servidor

        }, 10000 + Math.random() * 5000); // Intervalos de 10 a 15 segundos
    });

    bot.on('kicked', (reason) => {
        // Aternos suele mandar un JSON text en el kick, lo convertimos a string legible
        console.log('[BOT] Kickeado por el servidor. Razón:', reason.toString());
    });

    bot.on('error', (err) => {
        console.log('[BOT] Error de red:', err.message);
        // Si el error es ECONNRESET, mineflayer disparará automáticamente el evento 'end'
    });

    bot.on('end', () => {
        console.log('[BOT] Se desconectó. Reintentando en 15 segundos...');
        // Reducido a 15 segundos para reconectar más rápido si el server sigue abierto
        setTimeout(createBot, 15000); 
    });
}

// Iniciar el bot por primera vez
createBot();
