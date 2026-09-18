const mineflayer = require('mineflayer');

function createBot() {
    console.log('[BOT] Intentando conectar...');

    const bot = mineflayer.createBot({
        host: 'survivalpigsaw.aternos.me',
        port: 30396,
        username: 'BotterPilly',
        version: false,
        hideErrors: true
    });

    bot.once('spawn', () => {
        console.log('[BOT] ¡Entró correctamente!');
        
        // Auto login (cambia la contraseña)
        setTimeout(() => {
            bot.chat('/login yeribel'); // <-- AQUÍ PON LA CONTRASEÑA CORRECTA
            console.log('[BOT] Intentando login...');
        }, 2500);

        // Movimiento suave cada 8-12 segundos
        setInterval(() => {
            if (!bot.entity) return;

            // Mirar random
            bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.6, true);

            // Caminar un poquito
            const dirs = ['forward', 'back', 'left', 'right'];
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            bot.setControlState(dir, true);
            
            setTimeout(() => {
                bot.setControlState(dir, false);
            }, 600 + Math.random() * 900);

            // Saltar a veces
            if (Math.random() < 0.35) {
                setTimeout(() => {
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 350);
                }, 400);
            }

        }, 8000 + Math.random() * 4000);
    });

    bot.on('kicked', (reason) => {
        console.log('[BOT] Kickeado:', reason);
    });

    bot.on('error', (err) => {
        console.log('[BOT] Error:', err.message);
    });

    bot.on('end', () => {
        console.log('[BOT] Se desconectó. Reintentando en 30 segundos...');
        setTimeout(createBot, 30000); // 30 segundos de espera
    });
}

createBot();
