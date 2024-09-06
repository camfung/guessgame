let nodeHandler;
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function startGame(numberOfNodes) {
    if (nodeHandler) {
        nodeHandler.removeElements()
    }
    nodeHandler = new NodeHandler(numberOfNodes)
    input.style.display = "none"
    button.style.display = "none"

    setTimeout(() => {
        nodeHandler.hideNumbers()
        nodeHandler.setPoses()

        setTimeout(() => {
            startUpdatingPoses(numberOfNodes);  // Call the updatePoses function 5 times with 2 seconds interval
        }, 1000);
    }, numberOfNodes * 1000);
}

function startUpdatingPoses(maxCount) {
    let count = 0;
    const intervalId = setInterval(() => {
        nodeHandler.updatePoses();
        count++;

        if (count >= maxCount) {
            clearInterval(intervalId);  // Stop the interval after maxCount updates
        }
    }, 2000);  // 2 seconds delay between updates
}

// created by gpt
// prompt: make me a function that takes a x and y position and creates a div with the class box in the dom. 
function createNodeDivAtPosition(x, y, innerHTML, ordered_number, parentId) {
    // Create a new div element
    const box = document.createElement('div');

    box.className = 'box';
    box.id = `node-${ordered_number}`

    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.innerHTML = innerHTML
    box.style.backgroundColor = getRandomColor()


    let parent = document.getElementById(parentId)
    parent.appendChild(box)
    return box
}

class Node {
    constructor(ordered_number, nodeHandler, parentId) {
        let innerHTML = `<div> ${ordered_number} </div> `
        this.ordered_number = ordered_number
        this.domElement = createNodeDivAtPosition(0, 0, innerHTML, ordered_number, parentId)
        this.nodeHandler = nodeHandler

        let [x, y] = this.getRandomPosInWindow()
        this.x = x
        this.y = y
        console.log("🚀 ~ Node ~ constructor ~ x:", x)
        this.domElement.addEventListener("click", () => {
            this.nodeHandler.nodeClicked(this.ordered_number)
        })

        if (ordered_number === undefined) {
            throw Error("No ordered_number included")
        }
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



// Create input and button elements
const input = document.createElement('input');
const button = document.createElement('button');

// Set attributes and text for the button
input.type = 'number';
input.placeholder = strings.typeSomethingHere;
button.textContent = strings.go;

// Append elements to the div with id 'menu'
const menuDiv = document.getElementById('menu');
console.log("🚀 ~ menuDiv:", menuDiv)

menuDiv.appendChild(input);
menuDiv.appendChild(button);

// Function to handle button click
function handleButtonClick() {
    startGame(parseInt(input.value))
    nodeHandler.gameStarted = true
}


// Add event listeners
button.addEventListener('click', handleButtonClick);
