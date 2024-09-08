function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function startGame(numberOfNodes) {
    if (numberOfNodes > 7) {
        alert(strings.gt7)
        return
    }
    if (nodeHandler) {
        nodeHandler.removeElements()
    }
    nodeHandler = new NodeHandler(numberOfNodes)
    this.input.style.display = "none"
    button.style.display = "none"

    await sleep(numberOfNodes * 1000)


    for (let i = 0; i < numberOfNodes-1; i++) {
        nodeHandler.updatePoses()
        await sleep(2000)
    }

    nodeHandler.updatePoses()
    nodeHandler.hideNumbers()
    nodeHandler.gameStarted = true; 
}
class Node {
    constructor(ordered_number, nodeHandler, parentId) {
        let innerHTML = `<div> ${ordered_number} </div> `
        this.ordered_number = ordered_number
        this.domElement = this.createNodeDivAtPosition(0, 0, innerHTML, ordered_number, parentId)
        this.nodeHandler = nodeHandler

        let [x, y] = this.getRandomPosInWindow()
        this.x = x
        this.y = y
        this.domElement.addEventListener("click", () => {
            this.nodeHandler.nodeClicked(this.ordered_number)
        })

        if (ordered_number === undefined) {
            throw Error("No ordered_number included")
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

    createNodeDivAtPosition(x, y, innerHTML, ordered_number, parentId) {
        const box = document.createElement('div');
        box.className = 'box';
        box.id = `node-${ordered_number}`;
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
    // This method would be responsible for removing the node from the DOM
    removeFromDOM() {
        this.domElement.remove();
    }

    hideNumber() {
        this.domElement.innerHTML = ""
    }

    showNumber() {
        this.domElement.innerHTML = `${this.ordered_number}`
    }
    getRandomPosInWindow() {
        let elementHeight = this.domElement.offsetHeight;
        let elementWidth = this.domElement.offsetWidth;

        // Calculate valid ranges for x and y to avoid out-of-bounds
        let x = Math.floor(Math.random() * (window.innerWidth - elementWidth));
        let y = Math.floor(Math.random() * (window.innerHeight - elementHeight));

        return [x, y];
    }

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
    constructor(number_of_nodes) {
        this.number_of_nodes = number_of_nodes || 4;
        this.nodes = [];
        this.gameStarted = false
        this.nextIndexToClick = 1
        for (let i = 1; i <= this.number_of_nodes; i++) {
            this.nodes.push(new Node(i, this, "boxes"));
        }
    }
    removeElements() {
        for (let node of this.nodes) {
            node.removeFromDOM()
        }
    }
    nodeClicked(ordered_number) {
        if (ordered_number == this.nextIndexToClick && this.gameStarted) {
            this.nextIndexToClick++;
            if (this.nextIndexToClick == this.number_of_nodes + 1) {
                this.showNumbers()
                alert(strings.excelentMemory)
                input.style.display = "inline"
                button.style.display = "inline"
                this.gameStarted = false
            }
        }
        else if (!this.gameStarted) {
            return
        }
        else {
            this.showNumbers()
            alert(strings.wrongOrder)
            this.gameStarted = false
            input.style.display = "inline"
            button.style.display = "inline"
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
        this.nodeHandler = new NodeHandler(numberOfNodes)
        this.input.style.display = "none"
        this.button.style.display = "none"

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

        this.input.type = 'number';
        this.input.placeholder = strings.typeSomethingHere;
        this.button.textContent = strings.go;

        this.menuDiv = document.getElementById('menu');
        this.menuDiv.appendChild(this.input);
        this.menuDiv.appendChild(this.button);

        this.button.addEventListener('click', () => this.handleButtonClick());
    }
}

const game = new Game();
game.main();
