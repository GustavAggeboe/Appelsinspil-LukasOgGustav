
function setup() {

    // De første mange linjer henter dom elementer så vi kan snakke med dem.
    const landingPage = document.getElementById('landing-page');
    const socketsPage =  document.getElementById('eline-sockets');

    const createBtn = document.getElementById('create-btn');
    const connectBtn = document.getElementById('connect-btn');

    const header = document.getElementById('header');

    const socketPin = document.getElementById('socket-pin');

    const messageInp = document.getElementById('message-inp')
    const sendBtn = document.getElementById('send');

    const messages = document.getElementById('messages');

    // Skjul socket siden indtil vi har valgt om vi vil create eller connect
    socketsPage.hidden = true;

    // Når vi først har vores socket, er logikken den samme
    function useSocket(socket) {
        // skriv hvilket id socket'en bruger
        socketPin.innerText = socket.id;

        // når der trykkes send, hentes værdien ud af input feltet, og sendes til socket'en
        // efterfølgende nulstilles input feltet.
        sendBtn.addEventListener('click', () => {
            const msg = messageInp.value;
            socket.sendMessage(msg);
            messageInp.value = '';
        });

        // Når der kommer en besked fra den anden side, sættes den ind som et liste element
        // i listen over beskeder.
        socket.onMessage(msg => {
            const li = document.createElement('li');
            li.innerText = msg;
            messages.appendChild(li);
        });
    }

    // Når der trykkes på creact, oprettes en socket med ElineSocket.create()
    createBtn.addEventListener('click', () => {
        landingPage.hidden = true;
        socketsPage.hidden = false;
        header.innerText = 'Creator';
        const socket = ElineSocket.create();
        useSocket(socket);
    });

    // Når der trykkes på connect, skal man indtaste en pin kode (prompt)
    // og denne bruges til at lave en socket med ElineSocket.connect(pin).
    connectBtn.addEventListener('click', () => {
        landingPage.hidden = true;
        socketsPage.hidden = false;
        header.innerText = 'Connector';
        const pin = prompt("Pin: ");
        const socket = ElineSocket.connect(pin);
        useSocket(socket);
    });
}

// vent på at dokumentet er klar. Svarer til p5's setup.
document.addEventListener('DOMContentLoaded', setup);
