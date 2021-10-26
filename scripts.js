let pieces = [];
let fields = [];

window.onload = () => {
    for(let r = 1; r <= 21; r++) {
        if(r < 7) {
            for(let c = 1; c <= r; c++) {
                buildHex(r, hexLeftCalc(r, c), c);
            }
        } else if(r < 16) {
            let i = r % 2 === 1 ? 6 : 7
            for(let c = 1; c < i; c++) {
                buildHex(r, hexLeftCalc(r % 2 === 1 ? 5 : 6, c), c);
            }
        } else {
            for(let c = 22 - r; c >= 1; c--) {
                buildHex(r, hexLeftCalc(22 - r, c), c)
            }
        }
    }
}

function hexLeftCalc(r, c) {
    let left;
    if(c <= r / 2) {
        left = -46 - ((r - 1) - (c - 1) * 2) * 69;
    } else if(r % 2 === 1 && c === r / 2 + 0.5) {
        left = -46;
    } else {
        left = -46 + ((r - 1) - (r - c) * 2) * 69;
    }
    return left;
}

function buildHex(r, left, c) {
    let containerTag = document.createElement("div");
    containerTag.classList.add("hexContainer");
    containerTag.style.top = r * 40 - 40 +"px";
    let sign = left < 0 ? "-" : "+";
    containerTag.style.left = "calc(50% " + sign + " " + Math.abs(left) + "px)"

    let leftTag = document.createElement("div");
    leftTag.classList.add("hex");
    leftTag.classList.add("left");
    let middleTag = document.createElement("div");
    middleTag.id = "r-" + r + "_c-" + c;
    middleTag.ondrop = (event) => {
        drop(event);
    }
    middleTag.ondragover = (event) => {
        allowDrop(event);
    }
    middleTag.classList.add("hex");
    middleTag.classList.add("middle");
    let rightTag = document.createElement("div");
    rightTag.classList.add("hex");
    rightTag.classList.add("right");
    if(r % 3 === 1) {
        leftTag.classList.add("color1");
        middleTag.classList.add("color1");
        rightTag.classList.add("color1");
    } else if(r % 3 === 2) {
        leftTag.classList.add("color2");
        middleTag.classList.add("color2");
        rightTag.classList.add("color2");
    } else {
        leftTag.classList.add("color3");
        middleTag.classList.add("color3");
        rightTag.classList.add("color3");
    }

    containerTag.appendChild(leftTag);
    containerTag.appendChild(middleTag);
    containerTag.appendChild(rightTag);
    document.getElementById("boardContainer").appendChild(containerTag);
}

function initBoard() {
    document.getElementById("whiteArea").innerText = "";
    document.getElementById("blackArea").innerText = "";
    let tags = document.getElementsByClassName("middle");
    for (let i = 0; i < tags.length; i++) {
        tags[i].innerText = "";
    }
    let piece = {};
    pieces = [];
    initData(piecesData, piece, pieces);
    let field = {};
    fields = [];
    initData(fieldsData, field, fields);

    pieces.forEach(p => {
        let pieceTag = document.createElement("img");
        pieceTag.id = p.id;
        pieceTag.src = "images/" + p.id.substring(0, p.id.length - 1) + ".png";
        pieceTag.classList.add("piece");
        pieceTag.draggable = true;
        pieceTag.ondragstart = (event) => {
            drag(event);
        }
        p.color === "white" ? document.getElementById("whiteArea").appendChild(pieceTag) : document.getElementById("blackArea").appendChild(pieceTag);
    })
    fields.forEach(f => {
        let fieldTag = document.createElement("img");
        fieldTag.id = f.id;
        fieldTag.src = "images/" + f.id.split("-")[0] + ".png";
        fieldTag.classList.add("field");
        fieldTag.draggable = true;
        fieldTag.ondragstart = (event) => {
            drag(event);
        }
        fieldTag.ondrop = (event) => {
            drop(event);
        }
        fieldTag.ondragover = (event) => {
            allowDrop(event);
        }
        f.color === "white" ? document.getElementById("whiteArea").appendChild(fieldTag) : document.getElementById("blackArea").appendChild(fieldTag);
    })
}

function hideWhite() {
    let tags = document.getElementsByClassName("middle");
    if(document.getElementById("hideWhiteButton").innerText === "HIDE WHITE") {
        for (let i = 0; i < tags.length; i++) {
            let tagRow = parseInt(tags[i].id.split("_")[0].substr(2));
            if (tagRow <= 12)
                hideHex(tags[i]);
        }
        document.getElementById("hideWhiteButton").innerText = "SHOW WHITE";
    } else {
        for (let i = 0; i < tags.length; i++) {
            tags[i].childNodes.forEach(n => {
                if(n.classList.contains("hider"))
                    n.remove();
            })
        }
        document.getElementById("hideWhiteButton").innerText = "HIDE WHITE";
    }
}

function hideBlack() {
    let tags = document.getElementsByClassName("middle");
    if(document.getElementById("hideBlackButton").innerText === "HIDE BLACK") {
        for (let i = 0; i < tags.length; i++) {
            let tagRow = parseInt(tags[i].id.split("_")[0].substr(2));
            if (tagRow >= 10)
                hideHex(tags[i]);
        }
        document.getElementById("hideBlackButton").innerText = "SHOW BLACK";
    } else {
        for (let i = 0; i < tags.length; i++) {
            tags[i].childNodes.forEach(n => {
                if(n.classList.contains("hider"))
                    n.remove();
            })
        }
        document.getElementById("hideBlackButton").innerText = "HIDE BLACK";
    }
}

function hideHex(tag) {
    let containerTag = document.createElement("div");
    containerTag.classList.add("hexContainer");
    containerTag.classList.add("hider");
    let leftTag = document.createElement("div");
    leftTag.classList.add("hex");
    leftTag.classList.add("left");
    let middleTag = document.createElement("div");
    middleTag.classList.add("hex");
    middleTag.classList.add("middleHider");
    let rightTag = document.createElement("div");
    rightTag.classList.add("hex");
    rightTag.classList.add("right");
    containerTag.appendChild(leftTag);
    containerTag.appendChild(middleTag);
    containerTag.appendChild(rightTag);
    tag.appendChild(containerTag);
}

function initData(data, variable, collection) {
    data.forEach(p => {
        for (let i = 0; i < p.number; i++) {
            variable = {
                id: p.name + "-white" + i,
                color: "white",
                inGame: false,
                position: ""
            }
            collection.push(variable);
            variable = {
                id: p.name + "-black" + i,
                color: "black",
                inGame: false,
                position: ""
            }
            collection.push(variable);
        }
    })
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    event.stopPropagation();
    let data = event.dataTransfer.getData("text");
    let hexTag = event.target.nodeName === "DIV" ? event.target : event.target.parentElement;
    removeTag(hexTag, "piece")
    if (document.getElementById(data).classList.contains("field")) {
        removeTag(hexTag, "field")
    }
    hexTag.appendChild(document.getElementById(data));
}

function removeTag(hexTag, className) {
    let tag
    hexTag.childNodes.forEach(n => {
        if (n.classList.contains(className))
            tag = n;
    })
    if(tag !== undefined) {
        tag.remove();
        tag.id.includes("white") ? document.getElementById("whiteArea").appendChild(tag) : document.getElementById("blackArea").appendChild(tag);
    }
}
