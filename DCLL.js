    /*as a class*/
    function Node(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
        this.getValue = getTemplateValue;
        this.showNode = showAll;
	this.delete = function()
	{
		if(this.value.delete){this.value.delete();} 
		/*
		delete this.value;
		delete this.prev;
		delete this.next;
		delete this.getValue;
		delete this.showNode;
		delete this.delete;
		*/
	        this.value = null;
	        this.prev = null;
	        this.next = null;
	}
    };

    function showAll() {

        txt = "";
        txt += "node of value: " + this.value;
        txt += ", its prev.value:  " + (this.prev ? ("" + this.prev.value + "") : "null");
        txt += " , and its next value : " + (this.next ? ("" + this.next.value + "") : "null");
        txt += "<br/>";
        return txt;

    }



    function getTemplateValue() {
        return this.value;
    }


    //prev pointer is not working, causing HUGE BUGS

    var DoublyCircularLinkedList = function() {
        this.head = 0;
        this.tail = 0;
        this.current = 0;
        this.count = 0;
        this.message = " ";

    };


    DoublyCircularLinkedList.prototype.append = function(value) {

        if (this.count == 0) {
            var node1 = new Node();
            node1.value = value;
            this.head = node1;
            this.head.prev = node1;
            this.current = this.head;
            this.tail = node1;
            node1.next = node1;
            node1.prev = node1;


        } else if (this.count >= 1) {
            var node2 = new Node();
            node2.value = value;


            node2.prev = this.tail;
            node2.next = this.head;
            this.head.prev = node2;
            this.tail.next = node2;

            this.tail = node2;

            this.head.prev = this.tail;
            this.tail.next = this.head;


        }

        this.count++;
    };


    DoublyCircularLinkedList.prototype.appendNoDup = function(value) {

        if (this.count == 0) {
            var node1 = new Node();
            node1.value = value;
            this.head = node1;
            this.head.prev = node1;
            this.current = this.head;
            this.tail = node1;
            node1.next = node1;
            node1.prev = node1;


        } else if (this.count >= 1) {
            if ((typeof this.tail.value.checkEquals == 'function') && (this.tail.value.checkEquals(value))
                //||this.tail.prev.value.checkEquals(value))
                ||
                (this.head.value.checkEquals(value))) {
                return;
            }
            if (this.tail === value) {
                return;
            }
            // if(this.tail.value == value){ return; }
            var node2 = new Node();
            node2.value = value;


            node2.prev = this.tail;
            node2.next = this.head;
            this.head.prev = node2;
            this.tail.next = node2;

            this.tail = node2;

            this.head.prev = this.tail;
            this.tail.next = this.head;
        }

        this.count++;
    };


    DoublyCircularLinkedList.prototype.getHeadNodeValue = function() {
        return this.head.value;
    };


    DoublyCircularLinkedList.prototype.getCurrentNodeValue = function() {
	//if(this.count<=0){return null;}
        return this.current.value;
    };

    DoublyCircularLinkedList.prototype.getNextNodeValue = function() {
        return this.current.next.value;
    };

    DoublyCircularLinkedList.prototype.getPrevNodeValue = function() {
        return this.current.prev.value;
    };



    DoublyCircularLinkedList.prototype.deleteHeadNode = function() {
        if (this.count == 0) {
            return;
        }

        temp = this.head;
        temp.prev.next = temp.next;
        temp.next.prev = temp.prev;
	if(this.head.value.delete){this.head.value.delete();/*delete this.head.value; this line may cause a joint to be deleted itself, check*/}
        this.head = null;
        this.head = temp.next;
        this.head.prev = this.tail;
        // delete temp;
        this.count--;

    };

    DoublyCircularLinkedList.prototype.deleteTailNode = function() {
        if (this.count == 0) {
            return;
        }

        temp = this.tail;
        temp.prev.next = temp.next;
        temp.next.prev = temp.prev;
	if(this.tail.value.delete){this.tail.value.delete();}
        this.tail = null;
        this.tail = temp.prev;
        this.tail.next = this.head;
        //delete temp;
        this.count--;

    };



    // faulty
    DoublyCircularLinkedList.prototype.deleteCurrentNode = function() {
        if (this.count == 0) {
            return;
        }

	if(this.count == 1)
	{
	        delete this.current;
		if(this.head){this.head = null;}
		if(this.tail){this.tail = null;}
		this.next = null;
		this.prev = null;
		this.count = 0;
		return;
	}

        temp = this.current;
        temp.prev.next = temp.next;
        temp.next.prev = temp.prev;
        this.current = null;

        this.current = temp.next;
        this.head.prev = this.tail;
        this.tail.next = this.head;
        //delete temp;

        this.count--;

    };

    DoublyCircularLinkedList.prototype.deleteList = function() {
        length = this.count;
        for (i = 0; i < length; i++) {
            this.message += "count = " + this.count + ", i=" + i;
            this.deleteHeadNode();
            //this.current = this.current.next;

        }
    };

    DoublyCircularLinkedList.prototype.pointToNext = function() {

        this.current = this.current.next;
    };

    DoublyCircularLinkedList.prototype.pointToPrev = function() {
        this.current = this.current.prev;
    };

    DoublyCircularLinkedList.prototype.show = function() {
        llist = "count=" + this.count + "\n";
        temp = this.current;
        this.current = this.head;
        for (i = 0; i < this.count; i++) {
            llist += this.getCurrentNodeValue() + ", ";
            this.current = this.current.next;
            //	this.pointToPrev();
        }

        llist += "\n";
        this.current = temp;
        return llist;

    };


    DoublyCircularLinkedList.prototype.showDetails = function() {
        llist = "count=" + this.count + "\n";
        temp = this.current;
        this.current = this.head;
        for (i = 0; i < this.count; i++) {
            llist += "this current node value: " + this.current.showNode();
            llist += "head of list = " + this.head.showNode();
            llist += "tail of list = " + this.tail.showNode();

            //    this.current = this.current.next;
            this.pointToNext();
            //	this.pointToPrev();
        }

        llist += "\n";
        this.current = temp;
        return llist;

    };




    function displayList() {

        var dcll1 = new DoublyCircularLinkedList();

        dcll1.append("first");
        dcll1.append(" second ");
        dcll1.append(" third word ");
        dcll1.append(" fourth and the last");

        //    text = dcll1.show();
        text = dcll1.showDetails();


        alert(text);
        document.getElementById("demo").innerHTML = text;
    };

    function deleteList2() {
        DoublyCircularLinkedList.deleteCurrentNode();
        alert(DoublyCircularLinkedList.show());

    };

    function deleteAllList() {
        DoublyCircularLinkedList.deleteList();
        alert(DoublyCircularLinkedList.show() + DoublyCircularLinkedList.message);
    };