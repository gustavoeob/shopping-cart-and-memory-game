window.onload = function (){
    
        const container = document.querySelector('section');
        let livesCount = document.getElementById('livesCount');
        let playerLives = 3;
        
        // Definimos el valor de las vidas del jugador
        livesCount.textContent = playerLives;
    
        // Preparamos las imagenes para las cartas
        const setData = () => [
                { imgSrc: "./images/blackhoddie.jpg", name: "blackhoodie" },
                { imgSrc: "./images/blacktshirt.jpg", name: "blacktshirt" },
                { imgSrc: "./images/greyhoddie.jpg", name: "greyhoodie" },
                { imgSrc: "./images/greytshirt.jpg", name: "greytshirt" },
                { imgSrc: "./images/blackhoddie.jpg", name: "blackhoodie" },
                { imgSrc: "./images/blacktshirt.jpg", name: "blacktshirt" },
                { imgSrc: "./images/greyhoddie.jpg", name: "greyhoodie" },
                { imgSrc: "./images/greytshirt.jpg", name: "greytshirt" }
            ];
        
        // Barajea las cartas
        const setRandomCards = () => {
            const cardData = setData();
            cardData.sort(() => Math.random() -0.5)
            console.log(cardData);
            return cardData;
        }

        const cardGenerator = () => {
            const cardData = setRandomCards();
            // Generar HTML
            cardData.forEach((item) => {
            const card = document.createElement('div');
            const face = document.createElement('img');
            const back = document.createElement('div');
            card.classList = 'card'
            face.classList = 'face'
            back.classList = 'back'
            // Vincular data a las cartas
            face.src = item.imgSrc
            card.setAttribute('name', item.name)
            // Vincular cartas en el container
            container.appendChild(card)
            card.appendChild(face)
            card.appendChild(back)
            
            card.addEventListener('click', function(e){
                card.classList.toggle("toggleCard")
                flipCards(e)
            })
        })
    }
    // Funcion que ejecuta la accion de seleccionar y comprobar cartas mediante evento que pasamos en el parametro (e)

    const flipCards = (e) => {
        console.log(e)
        const clickedCard = e.target
        clickedCard.classList.add('flipped')
        const flipped = document.querySelectorAll('.flipped')
        const toggleCard = document.querySelectorAll('.toggleCard')
    // Comprobar si la primera carta cliqueada coincide con la segunda cliquedad mediante un indice 
        if (flipped.length === 2){
            if (flipped[0].getAttribute('name') === flipped[1].getAttribute('name')){
                flipped.forEach((card) => {
                    card.classList.remove('flipped')
                    card.style.pointerEvents = 'none'
                })
            }else{
                flipped.forEach((card) => {
                    card.classList.remove('flipped')
                    setTimeout(() => card.classList.remove('toggleCard'), 1000)
                });
                //  Resta una vida cada vez que no coinciden las cartas
                playerLives--;
                livesCount.textContent = playerLives;
                if (playerLives === 0) {
                    setTimeout(() => restartGame("Try again 🥲"), 500)
                }
            }
            // Si estan combinamos todas las cartas bien ejecutamos restartGame
            if (toggleCard.length === 8){
                setTimeout(() => restartGame("You did it!☺️"), 500)
            }
        }
    }
    // Le pasamos un parametro en este caso una alerta de texto
    const restartGame = (text) => {
        let cardData = setRandomCards();
        let faces = document.querySelectorAll('.face');
        let cards = document.querySelectorAll('.card');
        container.style.pointerEvents = 'none';
        cardData.forEach((item, index) => {
            cards[index].classList.remove('toggleCard')
            // Reiniciamos el juego dejandolo como estaba una vez el juego finaliza.
            setTimeout(() => { 
            cards[index].style.pointerEvents = 'all'
            faces[index].src = item.imgSrc;
            cards[index].setAttribute('name', item.name)
            section.style.pointerEvents = 'all'}, 1000)

        })
        playerLives = 3;
        livesCount.textContent = playerLives
        setTimeout(() => window.alert(text), 400)
    }
        cardGenerator();
}
