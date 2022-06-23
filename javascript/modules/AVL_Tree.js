class Node {
    constructor(key) {
        this.key = key;
        this.height = 1;
        this.left = null;
        this.right = null;

        this.x = 0;
        this.y = 0;
        this.parent = null;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    nodes = [];

    height(node) {
        if (node == null)
            return 0;
        return node.height;
    }

    getHeight() {
        return this.height(this.root);
    }

    rightRotate(x) {
        let y = x.left;
        let T2 = y.right;

        y.right = x;
        x.left = T2;

        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        return y;
    }

    leftRotate(x) {
        let y = x.right;
        let T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        return y;
    }

    getBalance(node) {
        if (node == null) 
            return 0;
        return this.height(node.left) - this.height(node.right);
    }

    insert(node, key) {
        if (node == null) 
            return new Node(key);

        if (key < node.key) 
            node.left = this.insert(node.left, key);

        else if (key > node.key) 
            node.right = this.insert(node.right, key);

        else
            return node;

        node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;

        let balance = this.getBalance(node);
        if (balance > 1 && key < node.left.key)
            return this.rightRotate(node);
 
        if (balance < -1 && key > node.right.key)
            return this.leftRotate(node);
 
        if (balance > 1 && key > node.left.key) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        if (balance < -1 && key < node.right.key) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    Insert(key) {
        this.root = this.insert(this.root, key);
        this.prepareForPrint();
    }

    minValueNode(node) {
        let temp = node;
        while (temp.left != null) {
            temp = temp.left;
        }
        return temp;
    }

    remove(node, key) {
        if (node == null) 
            return null;

        if (key < node.key) 
            node.left = this.remove(node.left, key);

        else if (key > node.key) 
            node.right = this.remove(node.right, key);

        else
        {
            if (node.left == null || node.right == null) {
                let temp = null;

                if (node.left != null) 
                    temp = node.left;
                    
                else if (node.right != null) {
                    temp = node.right;
                }

                if (temp == null) {
                    temp = node;
                    node = null;
                }

                else
                    node = temp;
            }

            else {
                let temp = this.minValueNode(node.right);
                node.key = temp.key;
                node.right = this.remove(node.right, temp.key)
            }
        }

        if (node == null) 
            return null;

        node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;

        let balance = this.getBalance(node);

        if (balance > 1 && this.getBalance(node.left) >= 0)
            return this.rightRotate(node);

        if (balance < -1 && this.getBalance(node.right) <= 0)
            return this.leftRotate(node);

        if (balance > 1 && this.getBalance(node.left) < 0)
        {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        if (balance < -1 && this.getBalance(node.right) > 0)
        {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }
   
        return node;
    }

    Remove(key) {
        this.root = this.remove(this.root, key);
        this.prepareForPrint();
    }

    level(node, level, currLevel) {
        if (node === null)
            return;

        if (currLevel === 1) {

            if (node === this.root) {
                node.x = 0;
                node.y = this.getHeight();
                parent = null;
            }

            const nodeOffset = Math.pow(2, node.y - 2);

            if (node.left != null) {
                node.left.x = node.x - nodeOffset;
                node.left.y = node.y - 1;

                node.left.parent = node;
            }

            if (node.right != null) {
                node.right.x = node.x + nodeOffset;
                node.right.y = node.y - 1;

                node.right.parent = node;
            }
        }

        else if (currLevel > 1){
            this.level(node.left, level, currLevel - 1);
            this.level(node.right, level, currLevel - 1);
        }
    }

    levelOrder(node) {
        if (node === null)
            return;

        for (let i = 1; i < node.height; ++i) {
            this.level(node, i, i);
        }
    }

    _prepareForPrint(node) {
        if (node === null)
            return;

        this._prepareForPrint(node.left);

        this.nodes.push(node);

        this._prepareForPrint(node.right);
    }
    
    prepareForPrint() {
        this.nodes = [];

        this.levelOrder(this.root);
        this._prepareForPrint(this.root);

        if (this.nodes.length === 1) {
            this.nodes[0].x = 0;
            this.nodes[0].y = 0;
            this.nodes[0].height = 0;
            this.nodes[0].parent = null;
        }
    }
}

export { AVLTree };
