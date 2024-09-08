function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Node {
    constructor(orderedNumber, nodeHandler, parentId) {
        let innerHTML = `<div> ${orderedNumber} </div> `
        this.orderedNumber = orderedNumber
        this.domElement = this.createNodeDivAtPosition(0, 0, innerHTML, orderedNumber, parentId)
        this.nodeHandler = nodeHandler

        let [x, y] = this.getRandomPosInWindow()
        this.x = x
        this.y = y
        this.domElement.addEventListener("click", () => {
            this.nodeHandler.nodeClicked(this.orderedNumber)
        })
        
        if (orderedNumber === undefined) {
            throw Error("No orderedNumber included")
        }
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    createNodeDivAtPosition(x, y, innerHTML, orderedNumber, parentId) {
        const box = document.createElement('div');
        box.className = 'box';
        box.id = `node-${orderedNumber}`;
        box.style.left = `${x}px`;
        box.style.top = `${y}px`;
        box.innerHTML = innerHTML;
        box.style.backgroundColor = this.getRandomColor();

        let parent = document.getElementById(parentId);
        parent.appendChild(box);
        return box;
    }

    setPos() {
        this.domElement.style.position = "absolute"
        this.domElement.style.left = this.x + "px"
        this.domElement.style.top = this.y + "px"
    }

    removeFromDOM() {
        this.domElement.remove();
    }

    hideNumber() {
        this.domElement.innerHTML = ""
    }

    showNumber() {
        this.domElement.innerHTML = `${this.orderedNumber}`
    }

    getRandomPosInWindow() {
        let elementHeight = this.domElement.offsetHeight;
        let elementWidth = this.domElement.offsetWidth;

        let x = Math.floor(Math.random() * (window.innerWidth - elementWidth));
        let y = Math.floor(Math.random() * (window.innerHeight - elementHeight));

        return [x, y];
    }

    // The following functions dont need to be in this class
    // to be more modular they should be in a util class 
    // but for simplicity i left them here
    getRandomPosInWindow() {
        let elementHeight = this.domElement.offsetHeight;
        let elementWidth = this.domElement.offsetWidth;

        // Calculate valid ranges for x and y to avoid out-of-bounds
        let x = Math.floor(Math.random() * (window.innerWidth - elementWidth));
        let y = Math.floor(Math.random() * (window.innerHeight - elementHeight));

        return [x, y];
    }

    setRandomPos() {
        let [x, y] = this.getRandomPosInWindow();
        this.x = x
        this.y = y
        this.setPos()
    }
}

class NodeHandler {
    constructor(numberOfNodes, menuDiv) {
        this.numberOfNodes = numberOfNodes || 4;
        this.nodes = [];
        this.gameStarted = false
        this.nextIndexToClick = 1
        this.menuDiv = menuDiv
        for (let i = 1; i <= this.numberOfNodes; i++) {
            this.nodes.push(new Node(i, this, "boxes"));
        }
    }
    removeElements() {
        for (let node of this.nodes) {
            node.removeFromDOM()
        }
    }
    nodeClicked(orderedNumber) {
        if (orderedNumber == this.nextIndexToClick && this.gameStarted) {
            this.nodes[orderedNumber-1].showNumber()
            this.nextIndexToClick++;
            if (this.nextIndexToClick == this.numberOfNodes + 1) {
                this.showNumbers()
                alert(strings.excelentMemory)
                this.gameStarted = false
            this.menuDiv.style.display = "block"
            }
        }
        else if (!this.gameStarted) {
            return
        }
        else {
            this.showNumbers()
            alert(strings.wrongOrder)
            this.menuDiv.style.display = "block"
            this.gameStarted = false
        }
    }
    setPoses() {
        for (let node of this.nodes) {
            node.setPos()
        }
    }
    updatePoses() {
        for (let node of this.nodes) {
            node.setRandomPos();
        }
    }
    showNumbers() {
        for (let node of this.nodes) {
            node.showNumber()
        }
    }
    hideNumbers() {
        for (let node of this.nodes) {
            node.hideNumber()
        }
    }
}


class Game {
    constructor() {
        this.nodeHandler = null;
        this.input = null;
        this.button = null;
        this.menuDiv = null;
    }


    async  startGame(numberOfNodes) {
        if (numberOfNodes > 7) {
            alert(strings.gt7)
            return
        }
        if (this.nodeHandler) {
            this.nodeHandler.removeElements()
        }
        this.nodeHandler = new NodeHandler(numberOfNodes, this.menuDiv)
        this.menuDiv.style.display = "none"

        await sleep(numberOfNodes * 1000)


        for (let i = 0; i < numberOfNodes-1; i++) {
            this.nodeHandler.updatePoses()
            await sleep(2000)
        }

        this.nodeHandler.updatePoses()
        this.nodeHandler.hideNumbers()
        this.nodeHandler.gameStarted = true; 
    }
    startUpdatingPoses(maxCount) {
        let count = 0;
        const intervalId = setInterval(() => {
            this.nodeHandler.updatePoses();
            count++;

            if (count >= maxCount) {
                clearInterval(intervalId);
            }
        }, 2000);
    }

    handleButtonClick() {
        this.startGame(parseInt(this.input.value));
    }

    main() {
        this.input = document.createElement('input');
        this.button = document.createElement('button');
        this.label = document.createElement('label');

        this.input.type = 'number';
        this.input.id = 'userInput'; 
        this.label.textContent = strings.typeSomethingHere; 
        this.label.setAttribute('for', 'userInput'); 

        this.button.textContent = strings.go;

        this.menuDiv = document.getElementById('menu');
        this.menuDiv.appendChild(this.label);
        this.menuDiv.appendChild(this.input);
        this.menuDiv.appendChild(this.button);

        this.button.addEventListener('click', () => this.handleButtonClick());
    }
}

const game = new Game();
game.main();
