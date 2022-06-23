"use strict"

import { AVLTree } from "./modules/AVL_Tree.js";
let Tree = new AVLTree();

let data;
let _lockButtons = true; 

let inputText = document.getElementById("inputText");
inputText.addEventListener("input", updateValue, false);

function lockButtons(arg) {

    let inputTextColor = {
        wrongInput: "#e64d43",
        default: "#ffffff"
    }

    if (arg)
        inputText.style.background = inputTextColor.wrongInput;

    else
        inputText.style.background = inputTextColor.default;

    _lockButtons = arg;
}

function updateValue(e) {
    data = e.target.value;

    if (isNaN(data.toString())) 
        lockButtons(true);

    else
        lockButtons(false);
}


let addButton = document.getElementById("addButton");
let removeButton = document.getElementById("removeButton");

inputText.addEventListener("keydown", key, false);

function key(e) {

    if (e.keyCode == 13) {
        //fix reloading page
        e.preventDefault();
        addNum();
    }
    
}

addButton.addEventListener("click", addNum, false);
removeButton.addEventListener("click", removeNum, false);

function addNum() {

    if (_lockButtons )
        return;
    
    Tree.Insert(parseInt(data, 10));

    updateTree(Tree.getHeight(), Tree.nodes);

}

function removeNum(){

    if (_lockButtons )
        return;
    
    Tree.Remove(parseInt(data, 10));

    updateTree(Tree.getHeight(), Tree.nodes);
    
}

//Testing
function Tests(n) {

    for (let i = 0; i < n; ++i) {

        Tree.Insert(i);
        updateTree(Tree.getHeight(), Tree.nodes);
    }

}
