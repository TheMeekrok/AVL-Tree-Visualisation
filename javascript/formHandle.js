inputText = document.getElementById("inputText");
inputText.addEventListener("input", updateValue, false);
inputText.addEventListener("keydown", key, false);

let data;
function updateValue(e) {
    data = e.target.value;
    check(data);
}

function key(e) {
    if (e.keyCode == 13)
        addNum();
}

function check(data) {
    if (isNaN(data.toString())) 
        lockButtons(true);
    else
        lockButtons(false);
}


let inputTextColor = {
    wrongInput: "#e64d43",
    default: "#ffffff"
}


_lockButtons = true; 

function lockButtons(arg) {
    if (arg)
        inputText.style.background = inputTextColor.wrongInput;

    else
        inputText.style.background = inputTextColor.default;

    _lockButtons = arg;
}


addButton = document.getElementById("addButton");
removeButton = document.getElementById("removeButton");
addButton.addEventListener("click", addNum, false);
removeButton.addEventListener("click", removeNum, false);

Tree = new AVLTree();

function addNum() {
    if (_lockButtons )
        return;
    
    Tree.Insert(parseInt(data, 10));
    updateTree(Tree.root);
}

function removeNum(){
    if (_lockButtons)
        return;
    Tree.Remove(parseInt(data, 10));
    updateTree(Tree.root);
}

//Testing
function Tests(n) {
    for (let i = 0; i < n; ++i) {
        Tree.Insert(i);
        updateTree(Tree.root);
    }
}

