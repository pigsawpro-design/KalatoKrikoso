const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'survivalpigsaw.aternos.me',
        port: 30396,
        username: 'BotterPilly',
        version: false
    });

    bot.on('login', () => {
        console.log(`[NPC] Conexión establecida.`);
    });

    bot.on('spawn', () => {
        console.log(`[NPC] Bot spawneado correctamente.`);
        
        // Auto login (cambia la contraseña si es otra)
        setTimeout(() => {
            bot.chat('/login 123456'); // <-- PON AQUÍ LA CONTRASEÑA REAL DEL BOT
        }, 3000);

        // Empezar el movimiento humano
        startHumanMovement(bot);
    });

    // Sistema de movimiento más humano
    function startHumanMovement(bot) {
        setInterval(() => {
            if (!bot.entity) return;

            // Mirar a un lado random
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * 0.5;
            bot.look(yaw, pitch, true);

            // Caminar un poco random
            const actions = ['forward', 'back', 'left', 'right'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            bot.setControlState(action, true);
            setTimeout(() => {
                bot.setControlState(action, false);
            }, 800 + Math.random() * 1200); // camina entre 0.8 y 2 segundos

            // Saltar de vez en cuando
            if (Math.random() < 0.4) {
                setTimeout(() => {
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 400);
                }, 500);
            }

            // Balancear el brazo
            if (Math.random() < 0.3) {
                bot.swingArm();
            }

        }, 6000 + Math.random() * 4000); // cada 6-10 segundos hace algo
    }

    // Auto-reconexión
    bot.on('end', (reason) => {
        console.log(`[NPC] Desconectado: ${reason}. Reconectando en 20 segundos...`);
        setTimeout(createBot, 20000);
    });

    bot.on('error', (err) => {
        console.log(`[NPC] Error: ${err}`);
    });

    bot.on('kicked', (reason) => {
        console.log(`[NPC] Kickeado: ${reason}`);
    });
}

createBot();
