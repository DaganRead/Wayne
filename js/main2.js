var app;
function onDeviceReady() {
    app = {
        scrypt : require("./scrypt.js"),
        picked : false,
        websocket : {
            public : io('http://gaz-huntingapp.rhcloud.com:8000/public'),
            private : io('http://gaz-huntingapp.rhcloud.com:8000/restricted')
        },
        DOM : {
            username: document.getElementById('username'),
            password: document.getElementById('password'),
            newSale: document.getElementById('newSale'),
            sales: document.getElementById('sales'),
            customers: document.getElementById('customers'),
            items: document.getElementById('items'),
            slaughters: document.getElementById('slaughters')
        },
        settings : {
            verboseConsole : false
        },
        data : {
            sales:[],
            customers:[],
            items:[],
            slaughters:[],
            locations:[]
        },
        login : function() {
            var data = {
                username : this.DOM.username.value,
                password : this.DOM.password.value
            };
            data.password = this.scrypt.crypto_scrypt(this.scrypt.encode_utf8(data.username), this.scrypt.encode_utf8(data.password), 128, 8, 1, 32);
            data.password = this.scrypt.to_hex(data.password);
            alert(JSON.stringify(data));
            this.websocket.public.emit('request login', data);
        },
        register : function() {
            var data = {
                username : this.DOM.username.value,
                password : this.DOM.password.value
            };
            data.password = this.scrypt.crypto_scrypt(this.scrypt.encode_utf8(data.username), this.scrypt.encode_utf8(data.password), 128, 8, 1, 32);
            data.password = this.scrypt.to_hex(data.password);
            alert(JSON.stringify(data));
            this.websocket.public.emit('request register', data);
        },
        simulate : function(evt) {
          var el = document.body;
          var touches = evt.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var tabs = touches[i].target.parentNode.parentNode.children;
                switch(touches[i].target.nodeName){
                    case "LABEL" :
                    for (var ii = 0; ii < tabs.length; ii++) {
                            tabs[ii].children[0].checked = false;
                        };
                        touches[i].target.control.checked = true;
                        touches[i].target.control.onclick.call(touches[i].target.control);
                        break;
                    case "SELECT" :
                        touches[i].target.onchange.call(touches[i].target);
                        break;
                };      
            };
        },
        store : function(type) {
            switch(type){
                        case "sale" :
                            var temp = JSON.parse(window.localStorage['data']);
                            temp.sales = this.data.sales;
                            window.localStorage['data'] = JSON.stringify(temp);
                            break;
                        case "customer" :
                            var temp = JSON.parse(window.localStorage['data']);
                            temp.customers = this.data.customers;
                            window.localStorage['data'] = JSON.stringify(temp);
                            break;
                        case "item" :
                            var temp = JSON.parse(window.localStorage['data']);
                            temp.items = this.data.items;
                            window.localStorage['data'] = JSON.stringify(temp);
                            break;
                        case "slaughter" :
                            var temp = JSON.parse(window.localStorage['data']);
                            temp.slaughters = this.data.slaughters;
                            window.localStorage['data'] = JSON.stringify(temp);
                            break;
                        case "location" :
                            var temp = JSON.parse(window.localStorage['data']);
                            temp.locations = this.data.locations;
                            window.localStorage['data'] = JSON.stringify(temp);
                            break;
            }
        },
        initialize: function() {
/*                var public = io.connect('http://gaz-huntingapp.rhcloud.com:8000/public'),
                    restricted = io.connect('http://gaz-huntingapp.rhcloud.com:8000/restricted');*/

            app.websocket.public.on('recieve token', function(token) {
                var data = {
                    token : token,
                    redirect : true
                };
                app.websocket.private.emit('authenticate', data);
                localStorage["token"] = token; 
            });
            app.websocket.private.on('recieve login', function(userData) {
                alert('login successful');
                alert(userData);
            });

            if (!window.localStorage['installed']) {
                window.localStorage['installed'] = true;
                window.localStorage['data'] = JSON.stringify({
                                        sales:[],
                                        customers:[],
                                        items:[],
                                        slaughters:[],
                                        locations:[]
                                    });
            };
            return function() {      
                this.data = JSON.parse(window.localStorage['data']);
                //app.binding();
                /*New Sales*/
                var HTMLFrag = '<article id="newSale"><span class="header">Slaughter Date:</span><br /><select id="newSaleSlaughterDate">';
                HTMLFrag += '<option disabled selected value=""></option>';
                this.data.slaughters.forEach(function(element, index, array) {
                    HTMLFrag += '<option value="';
                    HTMLFrag += element.slaughterDate;
                    HTMLFrag += '">';
                    HTMLFrag += element.slaughterDate;
                    HTMLFrag += '</option>';
                });
                HTMLFrag += '</select><br /><span class="header">Customer:</span><br /><figure class="location" onclick="app.pickContact()" ><figcaption id="newSaleLocation">Pick</figcaption></figure><input type="text" placeholder="Last Name" onblur="app.customerSearch( null, this.value )" id="newSaleLastName"/><input type="text" placeholder="First Name" id="newSaleFirstName" onblur="app.customerSearch( this.value )" /><br class="clear" /><input type="email" placeholder="Email" id="newSaleEmail"/><br /><input type="text" placeholder="046-625 526 0" id="newSaleTelephone"/><br /><textarea id="newSaleAddress" cols="50">Address</textarea> <br class="clear" /><select id="newSaleLocationSelect">';
                    HTMLFrag += '<option disabled selected value=""></option>';
                    this.data.locations.forEach(function(element, index, array) {
                        HTMLFrag += '<option value="';
                        HTMLFrag += element.location;
                        HTMLFrag += '">';
                        HTMLFrag += element.location;
                        HTMLFrag += '</option>';
                    });
                    HTMLFrag += '</select><input type="text" placeholder="New Location" id="newSaleAddLocationText"/><input type="button" id="newSaleAddLocationBtn" value="Add" onclick="app.newLocation()"><br class="clear"/><span class="header">Purchase Table:</span><br /><table id="newSalePurchaseTable"><thead><tr><th>Item</th><th>Qnt</th><th>Mass</th></tr></thead><tbody><tr><td>';
                    HTMLFrag += '<select class="tableInput" onclick="app.purchaseTableAdd(this)" >';
                    HTMLFrag += '<option disabled selected value=""></option>';
                    this.data.items.forEach(function(innerElement, innerIndex, innerArray) {
                        HTMLFrag += '<option value="';
                        HTMLFrag += innerElement.itemCode;
                        HTMLFrag += '" data-price="';
                        HTMLFrag += innerElement.itemPrice;
                        HTMLFrag += '" >';
                        HTMLFrag += innerElement.itemName;
                        HTMLFrag += '</option>';
                    });
                    HTMLFrag += '</select>';
                    HTMLFrag += '</td><td><input type="text" class="tableInput" placeholder="0" /></td><td><input type="text" class="tableInput" placeholder="0" /></td></tr>';
                    HTMLFrag += '</tbody></table><br /><input type="button" class="confirm" value="Confirm" onclick="app.newSale()" /><input type="button" class="cancel" value="Cancel" /></article>';
                app.DOM.newSale.innerHTML = HTMLFrag;
                /* Sales */
                var HTMLFrag = '',
                    total = 0;
                this.data.sales.forEach(function(element, index, array) {
                            HTMLFrag +='<fieldset data-index="';
                            HTMLFrag += index;
                            HTMLFrag += '"><legend>&nbsp;';
                            HTMLFrag += element.slaughterDate;
                            HTMLFrag+='&nbsp;</legend><figure class="location"><figcaption>';
                            HTMLFrag += element.location;
                            HTMLFrag+='</figcaption></figure>';
                            HTMLFrag += element.name.givenName;
                            HTMLFrag+='&nbsp;';
                            HTMLFrag += element.name.familyName;
                            if (index == 0) {
                                HTMLFrag += '<br class="clear"><table class="purchase-table"><thead><tr><th>Item</th><th></th><th>Qnt</th><th colspan="2"></th><th>Mass</th><th>@</th><th>Total</th></tr></thead><tbody>';
                            }else{
                                HTMLFrag += '<br class="clear"><table class="purchase-table"><tbody>';
                            };
                            element.purchaseTable.forEach(function(innerElement, innerIndex, innerArray) {
                                innerElement = JSON.parse(innerElement);
                                HTMLFrag += '<tr><td colspan="2">';
                                HTMLFrag += '<select class="itemCode" onChange="app.update.sale(this)" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" >';
                                HTMLFrag += '<option disabled selected value=""></option>';
                                app.data.items.forEach(function(iiElement, iiIndex, iiArray) {
                                    HTMLFrag += '<option value="';
                                    HTMLFrag += iiElement.itemCode;
                                    HTMLFrag += '" '; 
                                    if (iiElement.itemCode == innerElement.itemCode) {
                                        HTMLFrag += 'selected'; 
                                    };
                                    HTMLFrag += ' data-price="';
                                    HTMLFrag += iiElement.itemPrice;
                                    HTMLFrag += '" >';
                                    HTMLFrag += iiElement.itemName;
                                    HTMLFrag += '</option>';
                                });
                                HTMLFrag += '</select>';
                                HTMLFrag += '</td><td colspan="2" class="small"><input type="text" class="quantity" data-index="';
                                HTMLFrag += innerIndex;         
                                HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';
                                HTMLFrag += innerElement.quantity;
                                HTMLFrag += '"/></td><td colspan="2" class="small"><input type="text" class="weight" data-index="';
                                HTMLFrag += innerIndex;     
                                HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';         
                                HTMLFrag += innerElement.totalWeight + 'kg';
                                HTMLFrag += '"/></td>';
                                HTMLFrag += '<td class="priceKG">';
                                HTMLFrag += 'R ' + innerElement.itemPrice;
                                HTMLFrag += '</td><td class="priceTag">';
                                HTMLFrag += 'R ' + innerElement.totalWeight * innerElement.itemPrice;
                                total    += innerElement.totalWeight * innerElement.itemPrice;
                                HTMLFrag += '</td></tr>';
                                /* if (innerElement.weights.length > 1) {
                                    innerElement.weights.forEach(function(iiElement, iiIndex, iiArray) {
                                        total += iiElement * innerElement.itemPrice;
                                        HTMLFrag += '<tr><td colspan="4"></td>';
                                        HTMLFrag += '<td colspan="2" class="small"><input type="text" class="weight" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';         
                                        HTMLFrag += iiElement + 'kg';
                                        HTMLFrag += '"/></td><td class="priceKG">';
                                        HTMLFrag += 'R ' + innerElement.itemPrice;
                                        HTMLFrag += '</td><td class="priceTag">';
                                        HTMLFrag += 'R ' + total;
                                        HTMLFrag += '</td></tr>';
                                    });
                                };*/
                            });
                            HTMLFrag += '<tr><td class="large" onclick="app.newRow(this)">+</td><td colspan="7"></td></tr>';
                            HTMLFrag += '</tbody><tfoot><tr><td colspan="6">Total: </td><td colspan="2">';
                            HTMLFrag += 'R' + total;
                            HTMLFrag += '</td></tr></tfoot></table>';
                            total = 0;
                            HTMLFrag += '<br /><span class="noteHeader" >Notes:</span><br class="clear" /><textarea class="notes" onblur="app.update.sale(this);" data-index="';
                            HTMLFrag += index;
                            HTMLFrag += '" >'; 
                            HTMLFrag += element.notes;
                            HTMLFrag += '</textarea>';
                            HTMLFrag += '<input type="button" value="clear" class="noteClear" onclick="this.previousSibling.value=\' \' " /> <br class="clear" /><input type="image" src="img/delete.png" onclick="app.delete.sale(this.dataset.index)" class="cancel" data-index="';
                            HTMLFrag += index;
                            HTMLFrag += '"/></fieldset>';
                        });
                app.DOM.sales.innerHTML = HTMLFrag;
                /*customers*/
                HTMLFrag = '';
                var newChar,
                    compareChar = '9',
                    numbersStarted = false;
                this.data.customers.sort(function(a, b) {
                    return a.name.givenName.localeCompare(b.name.givenName);
                });
                this.data.customers.forEach(function(element, index, array) {
                            newChar = element.name.givenName.charAt(0);
                            if (newChar < compareChar) {
                                if (element == array[0]) {
                                    HTMLFrag += '<fieldset><legend>#</legend>';
                                };
                                HTMLFrag += '<fieldset data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"><legend><input type="button" value="';
                                HTMLFrag += element.displayName;
                                        HTMLFrag += '" onclick="app.accordion(this)" /></legend>';
                                        HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                HTMLFrag += element.name.givenName;
                                HTMLFrag += '"/><input type="text" onblur="app.update.customer(this)" placeholder="';
                                HTMLFrag += element.name.familyName;
                                HTMLFrag += '"/>';
                                if (element.emails!=null) {
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" onblur="app.update.customer(this)" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                if (element.phoneNumbers!=null) {
                                    element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                HTMLFrag += '<br /><article>';
                                HTMLFrag += '<figure class="location" ><figcaption>';
                                HTMLFrag += '<select onblur="app.update.customer(this.parentNode)">';
                                if (element.location != undefined) {
                                    HTMLFrag += '<option disabled selected value="';
                                    HTMLFrag += element.location.location;
                                    HTMLFrag += '">';
                                    HTMLFrag += element.location.location;
                                    HTMLFrag += '</option>';
                                }else{
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                };
                                app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                    HTMLFrag += '<option value="';
                                    HTMLFrag += innerElement.location;
                                    HTMLFrag += '" >';
                                    HTMLFrag += innerElement.location;
                                    HTMLFrag += '</option>';
                                });
                                HTMLFrag += '</select></figcaption></figure></article>';
                                if (element.addresses!=null) {
                                    element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea onblur="app.update.customer(this)">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });
                                };
                                HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.dataset.index)" class="cancel" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"/></fieldset>';
                            };
                            if (newChar > compareChar){
                                HTMLFrag += '</fieldset><fieldset><legend>';                              
                                HTMLFrag += newChar;
                                HTMLFrag += '</legend>';  
                                compareChar = newChar;
                                HTMLFrag += '<fieldset data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"><legend><input type="button" value="';
                                HTMLFrag += element.displayName;
                                        HTMLFrag += '" onclick="app.accordion(this)" ';
                                        HTMLFrag += ' data-index="';
                                        HTMLFrag += index;
                                        HTMLFrag += '"/></legend>';
                                        HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                HTMLFrag += element.name.givenName;
                                HTMLFrag += '" /><input type="text" onblur="app.update.customer(this)" placeholder="';
                                HTMLFrag += element.name.familyName;
                                HTMLFrag += '" />';
                                if (element.emails!=null) {
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" onblur="app.update.customer(this)" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                if (element.phoneNumbers!=null) {
                                    element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                HTMLFrag += '<br /><article>';
                                HTMLFrag += '<figure class="location" ><figcaption>';
                                HTMLFrag += '<select onblur="app.update.customer(this.parentNode)">';
                                if (element.location != undefined) {
                                    HTMLFrag += '<option disabled selected value="';
                                    HTMLFrag += element.location.location;
                                    HTMLFrag += '">';
                                    HTMLFrag += element.location.location;
                                    HTMLFrag += '</option>';
                                }else{
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                };
                                app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                    HTMLFrag += '<option value="';
                                    HTMLFrag += innerElement.location;
                                    HTMLFrag += '" >';
                                    HTMLFrag += innerElement.location;
                                    HTMLFrag += '</option>';
                                });
                                HTMLFrag += '</select></figcaption></figure></article>';
                                if (element.addresses!=null) {
                                    element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea onblur="app.update.customer(this)">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });
                                };
                                HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.dataset.index)" class="cancel" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"/>';                              
                                HTMLFrag += '</fieldset>';
                            }else if(newChar == compareChar){
                                HTMLFrag += '<fieldset data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"><legend><input type="button" value="';
                                HTMLFrag += element.displayName;
                                        HTMLFrag += '" onclick="app.accordion(this)" /></legend>';
                                        HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                HTMLFrag += element.name.givenName;
                                HTMLFrag += '"/><input type="text" onblur="app.update.customer(this)" placeholder="';
                                HTMLFrag += element.name.familyName;
                                HTMLFrag += '"/>';
                                if (element.emails!=null) {
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" onblur="app.update.customer(this)" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                if (element.phoneNumbers!=null) {
                                    element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                HTMLFrag += '<br /><article>';
                                HTMLFrag += '<figure class="location" ><figcaption>';
                                HTMLFrag += '<select onblur="app.update.customer(this.parentNode)">';
                                if (element.location != undefined) {
                                    HTMLFrag += '<option disabled selected value="';
                                    HTMLFrag += element.location.location;
                                    HTMLFrag += '">';
                                    HTMLFrag += element.location.location;
                                    HTMLFrag += '</option>';
                                }else{
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                };
                                app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                    HTMLFrag += '<option value="';
                                    HTMLFrag += innerElement.location;
                                    HTMLFrag += '" >';
                                    HTMLFrag += innerElement.location;
                                    HTMLFrag += '</option>';
                                });
                                HTMLFrag += '</select></figcaption></figure></article>';
                                if (element.addresses!=null) {
                                    element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea onblur="app.update.customer(this)">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });
                                };
                                HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.dataset.index)" class="cancel" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"/>';                              
                                HTMLFrag += '</fieldset>';
                            };
                        app.DOM.customers.innerHTML = HTMLFrag;
                });
                /*items*/
                HTMLFrag = '', 
                newChar,
                compareChar = '9',
                numbersStarted = false;
                this.data.items.sort(function(a, b) {
                    return a.itemName.localeCompare(b.itemName);
                });
                this.data.items.forEach(function(element, index, array) {
                            newChar = element.itemName.charAt(0);
                            if (newChar < compareChar) {
                                if (element == array[0]) {
                                    HTMLFrag += '<fieldset><legend>#</legend>';
                                };
                                HTMLFrag += '<article><input type="button" onblur="app.update.item(this)" class="itemName" value="';
                                HTMLFrag += element.itemName;
                                HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.dataset.index)" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '" /><input type="text" onblur="app.update.item(this)" class="itemCode" placeholder="';
                                HTMLFrag += element.itemCode;
                                HTMLFrag += '" /><input type="text" onblur="app.update.item(this)" class="itemPrice" placeholder="';
                                HTMLFrag += element.itemPrice;
                                HTMLFrag += '" /></article>';
                            };
                            if (newChar > compareChar){
                                HTMLFrag += '</fieldset><fieldset><legend>';                              
                                HTMLFrag += newChar;
                                HTMLFrag += '</legend>';  
                                compareChar = newChar;
                                HTMLFrag += '<article><input type="button" onblur="app.update.item(this)" class="itemName" value="';
                                HTMLFrag += element.itemName;
                                HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.dataset.index)" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '" /><input type="text" onblur="app.update.item(this)" class="itemCode" placeholder="';
                                HTMLFrag += element.itemCode;
                                HTMLFrag += '" /><input type="text" onblur="app.update.item(this)" class="itemPrice" placeholder="';
                                HTMLFrag += element.itemPrice;
                                HTMLFrag += '" /></article>';
                            }else if(newChar == compareChar){
                                HTMLFrag += '<article><input type="button" onblur="app.update.item(this)" class="itemName" value="';
                                HTMLFrag += element.itemName;
                                HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.dataset.index)" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '" /><input type="text" onblur="app.update.item(this)" class="itemCode" placeholder="';
                                HTMLFrag += element.itemCode;
                                HTMLFrag += '" /><input type="text" onblur="app.update.item(this)" class="itemPrice" placeholder="';
                                HTMLFrag += element.itemPrice;
                                HTMLFrag += '" /></article>';
                            };
                        app.DOM.items.innerHTML = HTMLFrag;
                });
                /*slaughters*/
                HTMLFrag = '';
                this.data.slaughters.sort(function(a, b) {
                    return a.slaughterDate.localeCompare(b.slaughterDate);
                });
                this.data.slaughters.forEach(function(element, index, array) {
                    HTMLFrag += '<article>';
                    HTMLFrag += '<span class="slaughterDate">';
                    HTMLFrag += element.slaughterDate;
                    HTMLFrag += '</span><b>-</b><span>Total: </span><input type="text" value="R';
                    HTMLFrag += element.total;
                    HTMLFrag += '"/><input type="image" src="img/delete.png" onclick="app.delete.slaughter(this.dataset.index)" class="cancel" data-index="';
                    HTMLFrag += index;
                    HTMLFrag += '" />';
                    HTMLFrag += '</article>';
                });
                app.DOM.slaughters.innerHTML = HTMLFrag;
            };
        }(),
        forms: {
            newSale : {
                arr: [],
                slaughterDate: function() {
                    var temp = document.getElementsByTagName('select');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleSlaughterDate") {
                            return temp[i].value;
                        };
                    };
                },
                location : function() {
                    var temp = document.getElementsByTagName('figcaption');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleLocation") {
                            return temp[i];
                        };
                    };
                },
                givenName : function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleFirstName") {
                            return temp[i].value;
                        };
                    };
                },
                familyName : function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleLastName") {
                            return temp[i].value;
                        };
                    };
                },
                email: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleEmail") {
                            return temp[i].value;
                        };
                    };
                },
                telephone: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleTelephone") {
                            return temp[i].value;
                        };
                    };
                },
                address: function() {
                    var temp = document.getElementsByTagName('textarea');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleAddress") {
                            return temp[i].value;
                        };
                    };
                },
                firstNameMatch : '',
                lastNameMatch : '',
                purchaseTable:[]
            },
            newCustomer : {
                location: function() {
                    var temp = document.getElementsByTagName('select');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newCustomerLocationSelect") {
                            return temp[i].value;
                        };
                    };
                },
                givenName: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newCustomerFirstName") {
                            return temp[i].value;
                        };
                    };
                },
                familyName:  function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newCustomerLastName") {
                            return temp[i].value;
                        };
                    };
                },
                email: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newCustomerEmail") {
                            return temp[i].value;
                        };
                    };
                },
                telephone: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newCustomerTelephone") {
                            return temp[i].value;
                        };
                    };
                },
                address: function() {
                    var temp = document.getElementsByTagName('textarea');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newCustomerAddress") {
                            return temp[i].value;
                        };
                    };
                }
            },
            newItem : {
                itemName: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newItemName") {
                            return temp[i].value;
                        };
                    };
                },
                itemCode: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newItemCode") {
                            return temp[i].value;
                        };
                    };
                },
                itemPrice: function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newItemPrice") {
                            //alert(JSON.stringify(temp[i]));
                            return temp[i].value;
                        };
                    };
                }
            },
            newSlaughter : {
                slaughterDate :   function() {
                    var temp = document.getElementsByTagName('select');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleSlaughterDate") {
                            return temp[i].value;
                        };
                    };
                },
                total :  0
            },
            newLocation : {
                location :   function() {
                    var temp = document.getElementsByTagName('input');
                    for (var i = temp.length - 1; i >= 0; i--) {
                        if (temp[i].id == "newSaleAddLocationText") {
                            return temp[i].value;
                        } else if (temp[i].id == "newCustomerAddLocationText") {
                            return temp[i].value;
                        };
                    };
                }
            }
        },
        newSale : function() {
            app.forms.newSale.location().innerHTML = document.getElementById('newSaleLocationSelect').selectedOptions[0].value;
            this.forms.newSale.purchaseTable = [];
            // Update mapped structure
            var purchaseTableSelects = document.getElementsByTagName('select'),
                foo = {
                    itemCode: '',
                    quantity: 0,
                    weights:[],
                    totalWeight:0,
                    itemPrice:0
                },
                newSale = {
                    slaughterDate: this.forms.newSale.slaughterDate(),
                    name : {
                        givenName: this.forms.newSale.givenName(),
                        familyName: this.forms.newSale.familyName()
                    },
                    purchaseTable: this.forms.newSale.purchaseTable,
                    location: this.forms.newSale.location().innerHTML,
                    total: 0,
                    notes : ''
                };
            for (var i = 0; i < purchaseTableSelects.length; i++) {
                if (classie.hasClass(purchaseTableSelects[i], 'touched')) {
                        foo.itemCode = purchaseTableSelects[i].value;
                        foo.itemPrice = purchaseTableSelects[i].selectedOptions[0].dataset.price;
                        foo.quantity = purchaseTableSelects[i].parentNode.nextSibling.children[0].value;
                        foo.totalWeight = purchaseTableSelects[i].parentNode.nextSibling.nextSibling.children[0].value;
                        for (var ii = foo.quantity - 1; ii >= 0; ii--) {
                            foo.weights.push(foo.totalWeight/foo.quantity);
                        };
                        newSale.total += foo.totalWeight * foo.itemPrice;
                        if (foo.quantity != 0) {
                            this.forms.newSale.purchaseTable.push(JSON.stringify(foo));
                            foo.weights = [];
                        };
                };
            };
            
            if (!this.picked) {
                var newCustomer = navigator.contacts.create({
                    "displayName": this.forms.newCustomer.givenName() + ' ' + this.forms.newCustomer.familyName(),
                    "name" : { 
                        givenName : this.forms.newCustomer.givenName(),
                        familyName : this.forms.newCustomer.familyName()
                    },
                    "note" : this.forms.newCustomer.location(),
                    "emails" : [this.forms.newCustomer.email()],
                    "phoneNumbers" : [this.forms.newCustomer.telephone()],
                    "addresses" : [this.forms.newCustomer.address()]
                });

                if (this.data.customers.indexOf(JSON.stringify(newCustomer)) == -1) {
                    //add to loaded dataset
                    this.data.customers.push(newCustomer);
                    //update dataset
                    //this.binding.customers();
                    this.store('customer');
                };
            };


            if (this.data.sales.indexOf(newSale) == -1) {
                //add to loaded dataset
                this.data.slaughters.forEach(function(element, index, array) {
                    if (element.slaughterDate == newSale.slaughterDate) {
                        element.total += newSale.total;
                    };
                });
                this.data.sales.push(newSale);
                //this.binding.sales();
                /*************************/
                var HTMLFrag = '',
                    total = 0;
                    //alert('0');
                    app.data.sales.forEach(function(innerElement, innerIndex, innerArray) {
                                HTMLFrag +='<fieldset data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"><legend>&nbsp;';
                                HTMLFrag += innerElement.slaughterDate;
                                HTMLFrag+='&nbsp;</legend><figure class="location"><figcaption>';
                                HTMLFrag += innerElement.location;
                                HTMLFrag+='</figcaption></figure>';
                                HTMLFrag += innerElement.name.givenName;
                                HTMLFrag+='&nbsp;';
                                HTMLFrag += innerElement.name.familyName;
                                if (innerIndex == 0) {
                                    HTMLFrag += '<br class="clear"><table class="purchase-table"><thead><tr><th>Item</th><th></th><th>Qnt</th><th colspan="2"></th><th>Mass</th><th>@</th><th>Total</th></tr></thead><tbody>';
                                }else{
                                    HTMLFrag += '<br class="clear"><table class="purchase-table"><tbody>';
                                };
                                innerElement.purchaseTable.forEach(function(iiiElement, iiiIndex, iiiArray) {
                                    iiiElement = JSON.parse(iiiElement);
                                    
                                    HTMLFrag += '<tr><td colspan="2">';
                                    HTMLFrag += '<select class="itemCode" onChange="app.update.sale(this)" data-index="';
                                    HTMLFrag += iiiIndex;
                                    HTMLFrag += '" >';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.items.forEach(function(iiElement, iiIndex, iiArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += iiElement.itemCode;
                                        HTMLFrag += '" '; 
                                        if (iiElement.itemCode == iiiElement.itemCode) {
                                            HTMLFrag += 'selected'; 
                                        };
                                        HTMLFrag += ' data-price="';
                                        HTMLFrag += iiElement.itemPrice;
                                        HTMLFrag += '" >';
                                        HTMLFrag += iiElement.itemName;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select>';
                                    HTMLFrag += '</td><td colspan="2" class="small"><input type="text" class="quantity" data-index="';
                                    HTMLFrag += iiiIndex;         
                                    HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';
                                    HTMLFrag += iiiElement.quantity;
                                    HTMLFrag += '"/></td><td colspan="2" class="small"><input type="text" class="weight" data-index="';
                                    HTMLFrag += iiiIndex;  
                                    HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';         
                                    HTMLFrag += iiiElement.totalWeight + 'kg';
                                    HTMLFrag += '"/></td>';
                                    HTMLFrag += '<td class="priceKG">';
                                    HTMLFrag += 'R ' + iiiElement.itemPrice;
                                    HTMLFrag += '</td><td class="priceTag">';
                                    HTMLFrag += 'R ' + iiiElement.totalWeight * iiiElement.itemPrice;
                                    total    += iiiElement.totalWeight * iiiElement.itemPrice;
                                    HTMLFrag += '</td></tr>';
                                });
                                HTMLFrag += '</tbody><tfoot><tr><td colspan="6">Total: </td><td colspan="2">';
                                HTMLFrag += 'R' + total;
                                HTMLFrag += '</td></tr></tfoot></table>';
                                total = 0;
                                HTMLFrag += '<br /><span class="noteHeader" >Notes:</span><br class="clear" /><textarea class="notes" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" onblur="app.update.sale(this)" > '; 
                                HTMLFrag += innerElement.notes;
                                HTMLFrag += '</textarea>';
                                HTMLFrag += '<input type="button" value="clear" class="noteClear" onclick="this.previousSibling.value=\' \' " /> <br class="clear" /><input type="image" src="img/delete.png" onclick="app.delete.sale(this.dataset.index)" class="cancel" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"/></fieldset>';
                    });
                    app.DOM.sales.innerHTML = HTMLFrag;
                /*************************/
                this.store('sale');
                //this.binding.slaughters();
                /******************************/
                        var HTMLFrag = '',
                            newChar,
                            compareChar = '9',
                            numbersStarted = false;
                        //refresh with this data;
                        app.data.slaughters.forEach(function(innerElement, innerIndex, innerArray) {
                            HTMLFrag += '<article><span class="slaughterDate">';
                            HTMLFrag += innerElement.slaughterDate;
                            HTMLFrag += '</span><b>-</b><span>Total: </span><input type="text" value="R';
                            HTMLFrag += innerElement.total;
                            HTMLFrag += '"/><input type="image" src="img/delete.png" onclick="app.delete.slaughter(this.dataset.index)" class="cancel" data-index="';
                            HTMLFrag += innerIndex;
                            HTMLFrag += '" /></article>';
                        });
                        app.DOM.slaughters.innerHTML = HTMLFrag;
                /****************************/
                this.store('slaughter'); 
            };
        },
        newCustomer : function() {
            var newCustomer = navigator.contacts.create({
                "displayName": this.forms.newCustomer.givenName() + ' ' + this.forms.newCustomer.familyName(),
                "name" : { 
                    givenName : this.forms.newCustomer.givenName(),
                    familyName : this.forms.newCustomer.familyName()
                },
                "note" : this.forms.newCustomer.location(),
                "emails" : [this.forms.newCustomer.email()],
                "phoneNumbers" : [this.forms.newCustomer.telephone()],
                "addresses" : [this.forms.newCustomer.address()]
            }),
            match = false;
            //add to loaded dataset
            this.data.customers.forEach(function(element, index, array) {
                if (newCustomer.displayName == element.displayName) {
                    match = true;
                };
                this.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                    if(this.forms.newCustomer.location() == innerElement.location){
                        innerElement.count ++;
                        this.store('location');
                    }
                });
            });
            if (!match) {
                this.data.customers.push(newCustomer);
                //update dataset
                this.binding.customers();
                this.store('customer');
            };
        },
        newItem : function() {
            //add to loaded dataset
            var newItem = {
                itemName: this.forms.newItem.itemName(),
                itemCode : this.forms.newItem.itemCode(),
                itemPrice : this.forms.newItem.itemPrice()
            };
            if (this.data.items.indexOf(newItem) == -1) {
                //alert(JSON.stringify(newItem.itemPrice));
                this.data.items.push(newItem);
                //update dataset
                this.binding.items();
                this.store('item');         
            };
        },
        newSlaughter : function() {
            //add to loaded dataset
            var newSlaughter = {
                slaughterDate : this.forms.newSlaughter.slaughterDate,
                total : this.forms.newSlaughter.total
            };
            if (this.data.slaughters.indexOf(newSlaughter) == -1) {
                this.data.slaughters.push(newSlaughter);
                //update dataset
                this.binding.slaughters();
                this.store('slaughter');    
            };  
        },
        newLocation : function() {
            //add to loaded dataset
            var newLocation = {
                location : this.forms.newLocation.location(),
                count : 1
            };
            if (this.data.locations.indexOf(JSON.stringify(newLocation)) == -1) {
                this.data.locations.push(newLocation);
                //update dataset
                this.binding.locations();
                this.store('location'); 
            };
            var temp = document.getElementsByTagName('input');
            for (var i = temp.length - 1; i >= 0; i--) {
                if (temp[i].id == "newSaleAddLocationText") {
                    temp[i].value = '';
                } else if (temp[i].id == "newCustomerAddLocationText") {
                    temp[i].value = '';
                };
            };
            app.binding.customers();  
        },
        newRow : function(target) {
            var saleIdx = target.parentNode.parentNode.parentNode.parentNode.dataset.index,
                emptyPurchase = {
                    itemCode: '',
                    quantity: 0,
                    weights:[],
                    totalWeight:0,
                    itemPrice:0
                };
            app.data.sales[saleIdx].purchaseTable.push(JSON.stringify(emptyPurchase));
            app.binding.sales();
            app.store('sale');
        },
        nav : {
            prevTab : 0,
            currentTab : 0,
            newTab : document.getElementById( 'new-tab' ),
            to :  function(value, parent) {
                this.prevTab = this.currentTab;
                this.currentTab = value;
                if (value == "New") {
                    switch(this.prevTab){
                        case "Sales":
                            var HTMLFrag = '<article id="newSale"><span class="header">Slaughter Date:</span><br /><select id="newSaleSlaughterDate">';
                            HTMLFrag += '<option disabled selected value=""></option>';
                            app.data.slaughters.forEach(function(element, index, array) {
                                HTMLFrag += '<option value="';
                                HTMLFrag += element.slaughterDate;
                                HTMLFrag += '">';
                                HTMLFrag += element.slaughterDate;
                                HTMLFrag += '</option>';
                            });
                            HTMLFrag += '</select><br /><span class="header">Customer:</span><br /><figure class="location" onclick="app.pickContact()" ><figcaption id="newSaleLocation">Pick</figcaption></figure><input type="text" placeholder="Last Name" onblur="app.customerSearch( null, this.value )" id="newSaleLastName"/><input type="text" placeholder="First Name" id="newSaleFirstName" onblur="app.customerSearch( this.value )" /><br class="clear" /><input type="email" placeholder="Email" id="newSaleEmail"/><br /><input type="text" placeholder="046-625 526 0" id="newSaleTelephone"/><br /><textarea id="newSaleAddress" cols="50">Address</textarea> <br class="clear" /><select id="newSaleLocationSelect">';
                                HTMLFrag += '<option disabled selected value=""></option>';
                                app.data.locations.forEach(function(element, index, array) {
                                    HTMLFrag += '<option value="';
                                    HTMLFrag += element.location;
                                    HTMLFrag += '">';
                                    HTMLFrag += element.location;
                                    HTMLFrag += '</option>';
                                }); 
                                HTMLFrag += '</select><input type="text" placeholder="New Location" id="newSaleAddLocationText"/><input type="button" id="newSaleAddLocationBtn" value="Add" onclick="app.newLocation()"><br class="clear"/><span class="header">Purchase Table:</span><br /><table id="newSalePurchaseTable"><thead><tr><th>Item</th><th>Qnt</th><th>Mass</th></tr></thead><tbody><tr><td>';
                                HTMLFrag += '<select class="tableInput" onclick="app.purchaseTableAdd(this)" >';
                                HTMLFrag += '<option disabled selected value=""></option>';
                                app.data.items.forEach(function(innerElement, innerIndex, innerArray) {
                                    HTMLFrag += '<option value="';
                                    HTMLFrag += innerElement.itemCode;
                                    HTMLFrag += '" data-price="';
                                    HTMLFrag += innerElement.itemPrice;
                                    HTMLFrag += '" >';
                                    HTMLFrag += innerElement.itemName;
                                    HTMLFrag += '</option>';
                                });
                                HTMLFrag += '</select>';
                                HTMLFrag += '</td><td><input type="text" class="tableInput" placeholder="0" /></td><td><input type="text" class="tableInput" placeholder="0" /></td></tr>';
                                HTMLFrag += '</tbody></table><br /><input type="button" class="confirm" value="Confirm" onclick="app.newSale()" /><input type="button" class="cancel" value="Cancel"></article>';
                                parent.children[2].innerHTML = HTMLFrag;
                            break;
                        case "Customers":
                                var HTMLFrag = '<article id="newCustomer"><span>New Customer Details:</span><br class="clear"/><input type="text" placeholder="First Name" id="newCustomerFirstName"/><input type="text" placeholder="Last Name" id="newCustomerLastName"/><br /><input type="email" placeholder="Email" id="newCustomerEmail"/><br /><input type="text" placeholder="046-625 526 0" id="newCustomerTelephone"/><br /><textarea id="newCustomerAddress" cols="50">Address</textarea> <br class="clear" /><select id="newCustomerLocationSelect">';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.locations.forEach(function(element, index, array) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += element.location;
                                        HTMLFrag += '">';
                                        HTMLFrag += element.location;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select><input type="text" placeholder="New Location" id="newCustomerAddLocationText"/><input type="button" id="newCustomerAddLocationBtn" value="Add" onclick="app.newLocation()"><br class="clear"/><input type="button" class="confirm" value="Confirm" onclick="app.newCustomer()" /><input type="button" class="cancel" value="Cancel"></article>';
                            parent.children[2].innerHTML = HTMLFrag;
                            break;
                        case "Items":
                            parent.children[2].innerHTML = '<article id="newItem"><input type="text" id="newItemName" placeholder="Item Name"/><input type="text" id="newItemCode" placeholder="Item Code"/><input type="text" id="newItemPrice" placeholder="R0.00"/><br /><input type="button" class="confirm"value="Confirm" onclick="app.newItem()" /><input type="button" class="cancel" value="Cancel"></article>';
                            break;
                        case "Slaughters":
                            parent.children[2].innerHTML = '<article id="newSlaughter"><span>New Slaughter Date:</span><br /><input type="text" id="newSlaughterDate" placeholder="Fri Jan 01 2016"/><br /><input type="button" class="confirm" value="Confirm" onclick="app.newSlaughter()" /><input type="button" class="cancel" value="Cancel"></article>';
                            var slaughterDate = new Pikaday({ 
                                field: document.getElementById('newSlaughterDate'),
                                onSelect: function(date) {
                                    app.forms.newSlaughter.slaughterDate = slaughterDate.toString();
                                }
                            });
                            break;
                    }
                };
            }
        },
        binding : {
            sales : function() {
                var HTMLFrag = '',
                    total = 0;
                    app.data.sales.forEach(function(innerElement, innerIndex, innerArray) {
                                HTMLFrag +='<fieldset data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"><legend>&nbsp;';
                                HTMLFrag += innerElement.slaughterDate;
                                HTMLFrag+='&nbsp;</legend><figure class="location"><figcaption>';
                                HTMLFrag += innerElement.location;
                                HTMLFrag+='</figcaption></figure>';
                                HTMLFrag += innerElement.name.givenName;
                                HTMLFrag+='&nbsp;';
                                HTMLFrag += innerElement.name.familyName;
                                if (innerIndex == 0) {
                                    HTMLFrag += '<br class="clear"><table class="purchase-table"><thead><tr><th>Item</th><th></th><th>Qnt</th><th colspan="2"></th><th>Mass</th><th>@</th><th>Total</th></tr></thead><tbody>';
                                }else{
                                    HTMLFrag += '<br class="clear"><table class="purchase-table"><tbody>';
                                };
                                innerElement.purchaseTable.forEach(function(iiiElement, iiiIndex, iiiArray) {
                                    iiiElement = JSON.parse(iiiElement);
                                    
                                    HTMLFrag += '<tr><td colspan="2">';
                                    HTMLFrag += '<select class="itemCode" onChange="app.update.sale(this)" data-index="';
                                    HTMLFrag += iiiIndex;
                                    HTMLFrag += '" >';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.items.forEach(function(iiElement, iiIndex, iiArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += iiElement.itemCode;
                                        HTMLFrag += '" '; 
                                        if (iiElement.itemCode == iiiElement.itemCode) {
                                            HTMLFrag += 'selected'; 
                                        };
                                        HTMLFrag += ' data-price="';
                                        HTMLFrag += iiElement.itemPrice;
                                        HTMLFrag += '" >';
                                        HTMLFrag += iiElement.itemName;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select>';
                                    HTMLFrag += '</td><td colspan="2" class="small"><input type="text" class="quantity" data-index="';
                                    HTMLFrag += iiiIndex;         
                                    HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';
                                    HTMLFrag += iiiElement.quantity;
                                    HTMLFrag += '"/></td><td colspan="2" class="small"><input type="text" class="weight" data-index="';
                                    HTMLFrag += iiiIndex;  
                                    HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';         
                                    HTMLFrag += iiiElement.totalWeight + 'kg';
                                    HTMLFrag += '"/></td>';
                                    HTMLFrag += '<td class="priceKG">';
                                    HTMLFrag += 'R ' + iiiElement.itemPrice;
                                    HTMLFrag += '</td><td class="priceTag">';
                                    HTMLFrag += 'R ' + iiiElement.totalWeight * iiiElement.itemPrice;
                                    total    += iiiElement.totalWeight * iiiElement.itemPrice;
                                    HTMLFrag += '</td></tr>';
                                });
                                HTMLFrag += '<tr><td class="large" onclick="app.newRow(this)">+</td><td colspan="7"></td></tr>';
                                HTMLFrag += '</tbody><tfoot><tr><td colspan="6">Total: </td><td colspan="2">';
                                HTMLFrag += 'R' + total;
                                HTMLFrag += '</td></tr></tfoot></table>';
                                total = 0;
                                HTMLFrag += '<br /><span class="noteHeader" >Notes:</span><br class="clear" /><textarea class="notes" onblur="app.update.sale(this)" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"  > '; 
                                HTMLFrag += innerElement.notes;
                                HTMLFrag += '</textarea>';
                                HTMLFrag += '<input type="button" value="clear" class="noteClear" onclick="this.previousSibling.value=\' \' " /> <br class="clear" /><input type="image" src="img/delete.png" onclick="app.delete.sale(this.dataset.index)" class="cancel" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"/></fieldset>';
                    });
                    app.DOM.sales.innerHTML = HTMLFrag;
            },
            customers : function() {
                    var HTMLFrag = '',
                        newChar,
                        compareChar = '9',
                        numbersStarted = false;
                    app.data.customers.sort(function(a, b) {
                        return a.name.givenName.localeCompare(b.name.givenName);
                    });
                    app.data.customers.forEach(function(element, index, array) {
                                //alert(index);
                                newChar = element.name.givenName.charAt(0);
                                if (newChar < compareChar) {
                                    if (element == array[0]) {
                                        HTMLFrag += '<fieldset><legend>#</legend>';
                                    };
                                    HTMLFrag += '<fieldset data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"><legend><input type="button" value="';
                                    HTMLFrag += element.displayName;
                                    HTMLFrag += '" onclick="app.accordion(this)" /></legend>';
                                    HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '"/><input type="text" onblur="app.update.customer(this)" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '"/>'; 
                                    if (element.emails!=null) {
                                        element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="email" onblur="app.update.customer(this)" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    if (element.phoneNumbers!=null) {
                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select onblur="app.update.customer(this.parentNode)">';
                                    if (element.location != undefined) {
                                        HTMLFrag += '<option disabled selected value="';
                                        HTMLFrag += element.location.location;
                                        HTMLFrag += '">';
                                        HTMLFrag += element.location.location;
                                        HTMLFrag += '</option>';
                                    }else{
                                        HTMLFrag += '<option disabled selected value=""></option>';
                                    };                                    
                                    app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '" >';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select></figcaption></figure></article>';
                                    if (element.addresses!=null) {
                                        element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<textarea onblur="app.update.customer(this)">';
                                            HTMLFrag += innerElement.formatted;
                                            HTMLFrag += '</textarea>';
                                        });
                                    };
                                    HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.dataset.index)" class="cancel" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/></fieldset>';
                                };
                                if (newChar > compareChar){
                                    HTMLFrag += '</fieldset><fieldset><legend>';                              
                                    HTMLFrag += newChar;
                                    HTMLFrag += '</legend>';  
                                    compareChar = newChar;
                                    HTMLFrag += '<fieldset data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"><legend><input type="button" value="';
                                    HTMLFrag += element.displayName;
                                    HTMLFrag += '" onclick="app.accordion(this)" ';
                                    HTMLFrag += ' data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/></legend>';
                                    HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '" /><input type="text" onblur="app.update.customer(this)" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '" />';
                                    if (element.emails!=null) {
                                        element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="email" onblur="app.update.customer(this)" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    if (element.phoneNumbers!=null) {
                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select onblur="app.update.customer(this.parentNode)">';
                                    if (element.location !== undefined) {
                                        HTMLFrag += '<option disabled selected value="';
                                        HTMLFrag += element.location.location;
                                        HTMLFrag += '">';
                                        HTMLFrag += element.location.location;
                                        HTMLFrag += '</option>';
                                    }else{
                                        HTMLFrag += '<option disabled selected value=""></option>';
                                    };
                                    app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '" >';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select></figcaption></figure></article>';
                                    if (element.addresses!=null) {
                                        element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<textarea onblur="app.update.customer(this)">';
                                            HTMLFrag += innerElement.formatted;
                                            HTMLFrag += '</textarea>';
                                        });
                                    };
                                    HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.dataset.index)" class="cancel" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/>';                              
                                    HTMLFrag += '</fieldset>';
                                }else if(newChar == compareChar){
                                    HTMLFrag += '<fieldset data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"><legend><input type="button" value="';
                                    HTMLFrag += element.displayName;
                                            HTMLFrag += '" onclick="app.accordion(this)" ';
                                            HTMLFrag += ' data-index="';
                                            HTMLFrag += index;
                                            HTMLFrag += '"/></legend>';
                                            HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '"/><input type="text" onblur="app.update.customer(this)" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '"/>';
                                    if (element.emails!=null) {
                                        element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="email" onblur="app.update.customer(this)" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    if (element.phoneNumbers!=null) {
                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" onblur="app.update.customer(this)" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select onblur="app.update.customer(this.parentNode)">';
                                    if (element.location != undefined) {
                                        HTMLFrag += '<option disabled selected value="';
                                        HTMLFrag += element.location.location;
                                        HTMLFrag += '">';
                                        HTMLFrag += element.location.location;
                                        HTMLFrag += '</option>';
                                    }else{
                                        HTMLFrag += '<option disabled selected value=""></option>';
                                    };                                    
                                    app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '" >';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select></figcaption></figure></article>';
                                    if (element.addresses!=null) {
                                        element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<textarea onblur="app.update.customer(this)">';
                                            HTMLFrag += innerElement.formatted;
                                            HTMLFrag += '</textarea>';
                                        });
                                    };
                                    HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.dataset.index)" class="cancel" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/>';                              
                                    HTMLFrag += '</fieldset>';
                                };
                            app.DOM.customers.innerHTML = HTMLFrag;
                    });
            },
            items : function() {      
                    var HTMLFrag = '', 
                        newChar,
                        compareChar = '9',
                        numbersStarted = false;
                    //refresh with this data;
                    app.data.items.sort(function(a, b) {
                        return a.itemName.localeCompare(b.itemName);
                    });
                    app.data.items.forEach(function(innerElement, innerIndex, innerArray) {
                        newChar = innerElement.itemName.charAt(0);
                            if (newChar < compareChar) {
                                if (innerElement == innerArray[0]) {
                                    HTMLFrag += '<fieldset><legend>#</legend>';
                                };
                                HTMLFrag += '<article><input type="button" onblur="app.update.item(this)" class="itemName" value="';
                                HTMLFrag += innerElement.itemName;
                                HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.dataset.index)" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" />';
                                HTMLFrag+='<input type="text" onblur="app.update.item(this)" class="itemCode" placeholder="';
                                HTMLFrag += innerElement.itemCode;
                                HTMLFrag += '" />';
                                HTMLFrag += '<input type="text" onblur="app.update.item(this)" class="itemPrice" placeholder="';
                                HTMLFrag += innerElement.itemPrice;
                                HTMLFrag += '" />';
                                HTMLFrag +='</article>';
                            };
                            if (newChar > compareChar){
                                HTMLFrag += '</fieldset><fieldset><legend>';                              
                                HTMLFrag += newChar;
                                HTMLFrag += '</legend>';  
                                compareChar = newChar;
                                HTMLFrag += '<article><input type="button" onblur="app.update.item(this)" class="itemName" value="';
                                HTMLFrag += innerElement.itemName;
                                HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.dataset.index)" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"/>';
                                HTMLFrag+='<input type="text" onblur="app.update.item(this)" class="itemCode" placeholder="';
                                HTMLFrag += innerElement.itemCode;
                                HTMLFrag += '" />';
                                HTMLFrag += '<input type="text" onblur="app.update.item(this)" class="itemPrice" placeholder="';
                                HTMLFrag += innerElement.itemPrice;
                                HTMLFrag += '" />';
                                HTMLFrag +='</article>';
                            }else if(newChar == compareChar){
                                HTMLFrag += '<article><input type="button" onblur="app.update.item(this)" class="itemName" value="';
                                HTMLFrag += innerElement.itemName;
                                HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.dataset.index)" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" />';
                                HTMLFrag+='<input type="text" onblur="app.update.item(this)" class="itemCode" placeholder="';
                                HTMLFrag += innerElement.itemCode;
                                HTMLFrag += '" />';
                                HTMLFrag += '<input type="text" onblur="app.update.item(this)" class="itemPrice" placeholder="';
                                HTMLFrag += innerElement.itemPrice;
                                HTMLFrag += '" />';
                                HTMLFrag +='</article>';
                            };
                        
                    });
                    app.DOM.items.innerHTML = HTMLFrag;
            },
            slaughters : function() {
                        var HTMLFrag = '',
                            newChar,
                            compareChar = '9',
                            numbersStarted = false;
                        //refresh with this data;
                        app.data.slaughters.forEach(function(innerElement, innerIndex, innerArray) {
                            HTMLFrag += '<article><span class="slaughterDate">';
                            HTMLFrag += innerElement.slaughterDate;
                            HTMLFrag += '</span><b>-</b><span>Total: </span><input type="text" value="R';
                            HTMLFrag += innerElement.total;
                            HTMLFrag += '"/><input type="image" src="img/delete.png" onclick="app.delete.slaughter(this.dataset.index)" class="cancel" data-index="';
                            HTMLFrag += innerIndex;
                            HTMLFrag += '" /></article>';
                        });
                        app.DOM.slaughters.innerHTML = HTMLFrag;
            },
            locations : function() {
                        var HTMLFrag = '';
                        HTMLFrag += '</select><br /><span class="header">Customer:</span><br /><figure class="location"><figcaption id="newSaleLocation"></figcaption></figure><input type="text" placeholder="Last Name" onblur="app.customerSearch( null, this.value )" id="newSaleLastName"/><input type="text" placeholder="First Name" id="newSaleFirstName" onblur="app.customerSearch( this.value )" /><br class="clear" /><input type="email" placeholder="Email" id="newSaleEmail"/><br /><input type="text" placeholder="046-625 526 0" id="newSaleTelephone"/><br /><textarea id="newSaleAddress" cols="50">Address</textarea> <br class="clear" /><select id="newSaleLocationSelect">';
                        HTMLFrag += '<option disabled selected value=""></option>';
                        app.data.locations.forEach(function(element, index, array) {
                            HTMLFrag += '<option value="';
                            HTMLFrag += element.location;
                            HTMLFrag += '">';
                            HTMLFrag += element.location;
                            HTMLFrag += '</option>';
                        });
                        var temp = document.getElementsByTagName('select');
                        for (var i = temp.length - 1; i >= 0; i--) {
                            if (temp[i].id == "newSaleLocationSelect") {
                                temp[i].innerHTML = HTMLFrag;
                            } else if (temp[i].id == "newCustomerLocationSelect") {
                                temp[i].innerHTML = HTMLFrag;
                            };
                        };
            }
        },
        accordion : function(target) {
            var container = target.parentNode.parentNode;
            classie.toggleClass(container, 'acc-open');
        },
        purchaseTableAdd : function(target) {
            if(!classie.hasClass(target, 'touched')){
                classie.addClass(target, 'touched');
                var input = document.createElement('tr'),
                    temp ='';

                    temp += '<td><select class="tableInput" onclick="app.purchaseTableAdd(this)" >';
                    temp += '<option disabled selected value=""></option>';
                    app.data.items.forEach(function(innerElement, innerIndex, innerArray) {
                        temp += '<option value="';
                        temp += innerElement.itemCode;
                        temp += '" data-price="';
                        temp += innerElement.itemPrice;
                        temp += '" >';
                        temp += innerElement.itemName;
                        temp += '</option>';
                    });
                    temp += '</select>';
                temp += '</td><td><input type="text" class="tableInput" placeholder="0" /></td><td><input type="text" class="tableInput" placeholder="0" /></td>';
                input.innerHTML = temp;
                document.getElementById('newSalePurchaseTable').children[1].appendChild(input);
            };
        },
        pickContact : function() {
            navigator.contacts.pickContact(function(contact){
                app.picked = true;
                    app.data.customers.forEach(function(element, index, array) {
                        if (contact.name.givenName != null && contact.name.familyName != null) {
                            document.getElementById('newSaleFirstName').value = contact.name.givenName;
                            document.getElementById('newSaleLastName').value = contact.name.familyName;
                                if (contact.phoneNumbers!=null) {
                                    document.getElementById('newSaleTelephone').value = contact.phoneNumbers[0].value;
                                }else{
                                    document.getElementById('newSaleTelephone').value = '';
                                };
                                if (contact.emails!=null) {
                                    document.getElementById('newSaleEmail').value = contact.emails[0].value;
                                }else{
                                    document.getElementById('newSaleEmail').value = '';
                                };
                                if (contact.addresses!=null) {
                                    document.getElementById('newSaleAddress').value = contact.addresses[0].value;
                                }else{
                                    document.getElementById('newSaleAddress').value = 'Address';
                                };
                                if (element.location.location != '' && element.location.location != undefined) {
                                    document.getElementById('newSaleLocation').innerHTML = element.location.location;
                                    for (var i = 0; i < document.getElementById('newSaleLocationSelect').options.length; i++) {
                                        if (document.getElementById('newSaleLocationSelect').options[i].value == element.location.location) {
                                            document.getElementById('newSaleLocationSelect').options[i].selected = true;
                                        }else{
                                            document.getElementById('newSaleLocationSelect').options[i].selected = false;
                                        };
                                    };
                                    if(!classie.hasClass(document.getElementById('newSale'), 'acc-open-loc')){
                                        classie.addClass(document.getElementById('newSale'), 'acc-open-loc');
                                    };
                                }else{
                                    
                                };
                            if (element.name.givenName == contact.name.givenName && element.name.familyName == contact.name.familyName) {
                                //app.picked = true;
                                /*element.location = {
                                    count : 0,
                                    location : document.getElementById('newSaleLocationSelect').selectedOptions[0].value
                                };*/
                                //app.store('customer');
                                //app.binding.customers();
                                /*if(!classie.hasClass(document.getElementById('newSale'), 'acc-open')){
                                    classie.addClass(document.getElementById('newSale'), 'acc-open');
                                };*/
                            };
                        };
                    });

                if(app.picked){
                    if(classie.hasClass(document.getElementById('newSale'), 'acc-open')){
                        classie.removeClass(document.getElementById('newSale'), 'acc-open');
                    };
                };
            },function(err){
                alert('Error: ' + err);
            });
        },
        customerSearch : function(givenName, familyName) {
            app.forms.newSale.location().innerHTML = '';
            if(classie.hasClass(document.getElementById('newSale'), 'acc-open')){
                classie.removeClass(document.getElementById('newSale'), 'acc-open');
            };
                if (givenName !== null) {
                    app.data.customers.forEach(function(element, index, array) {
                        if (element.name.givenName === givenName) {
                            if (app.forms.newSale.firstNameMatch != givenName) {
                                app.forms.newSale.firstNameMatch = givenName;
                            };
                            if (app.forms.newSale.firstNameMatch == element.name.givenName && app.forms.newSale.lastNameMatch == element.name.familyName) {
                                app.forms.newSale.location().innerHTML = element.location;
                                classie.addClass(document.getElementById('newSale'), 'acc-open');
                            };
                        };
                    });
                }else{
                    app.data.customers.forEach(function(element, index, array) {
                        if (element.name.familyName === familyName) {
                            if (app.forms.newSale.lastNameMatch != familyName) {
                                app.forms.newSale.lastNameMatch = familyName;
                            };
                            if (app.forms.newSale.firstNameMatch == element.name.givenName && app.forms.newSale.lastNameMatch == element.name.familyName) {
                                app.forms.newSale.location().innerHTML = element.location;
                                classie.addClass(document.getElementById('newSale'), 'acc-open');
                            };
                        };
                    });
                };
        },
        update : {
            sale : function(target) {
                var idx = target.dataset.index,
                    saleIdx = target.tagName == 'TEXTAREA'? target.parentNode.dataset.index:target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.index,
                    saleOld = JSON.stringify(app.data.sales[saleIdx]),
                    sale = JSON.parse(saleOld),
                    tables = app.DOM.sales.getElementsByTagName('TABLE'),
                    children = saleIdx==0 ? tables[saleIdx].children[1].children : tables[saleIdx].children[0].children,
                    HTMLFrag ='',
                    total = 0,
                    dom = {
                            item : children[idx].children[0].children[0],
                            quantity : children[idx].children[1].children[0],
                            totalWeight : children[idx].children[2].children[0]
                    },
                    saleData = {
                        itemCode : dom.item.selectedOptions[0].value,
                        quantity : dom.quantity.value == '' ? parseFloat(dom.quantity.placeholder) : parseFloat(dom.quantity.value),
                        weights : sale.purchaseTable[idx].weights,
                        totalWeight : dom.totalWeight.value == '' ? parseFloat(dom.totalWeight.placeholder.slice(0, -2)):parseFloat(dom.totalWeight.value),
                        itemPrice : parseFloat(dom.item.selectedOptions[0].dataset.price)
                    };
                    
                    app.data.sales[saleIdx].purchaseTable[idx] = JSON.stringify(saleData);
                    
                    app.data.sales[saleIdx].purchaseTable.forEach(function(innerElement, innerIndex, innerArray) {
                        innerElement = JSON.parse(innerElement);
                        HTMLFrag += '<tr><td colspan="2">';
                        HTMLFrag += '<select class="itemCode" onChange="app.update.sale(this)" data-index="';
                        HTMLFrag += innerIndex;
                        HTMLFrag += '" >';
                        HTMLFrag += '<option disabled selected value=""></option>';
                        app.data.items.forEach(function(iiElement, iiIndex, iiArray) {
                            HTMLFrag += '<option value="';
                            HTMLFrag += iiElement.itemCode;
                            HTMLFrag += '" '; 
                            if (iiElement.itemCode == innerElement.itemCode) {
                                HTMLFrag += 'selected'; 
                            };
                            HTMLFrag += ' data-price="';
                            HTMLFrag += iiElement.itemPrice;
                            HTMLFrag += '" >';
                            HTMLFrag += iiElement.itemName;
                            HTMLFrag += '</option>';
                        });
                        HTMLFrag += '</select>';
                        HTMLFrag += '</td><td colspan="2" class="small"><input type="text" class="quantity" data-index="';
                        HTMLFrag += innerIndex;         
                        HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';
                        HTMLFrag += innerElement.quantity;
                        HTMLFrag += '"/></td><td colspan="2" class="small"><input type="text" class="weight" data-index="';
                        HTMLFrag += innerIndex;     
                        HTMLFrag += '" onblur="app.update.sale(this)" placeholder="';         
                        HTMLFrag += innerElement.totalWeight + 'kg';
                        HTMLFrag += '"/></td>';
                        HTMLFrag += '<td class="priceKG">';
                        HTMLFrag += 'R ' + innerElement.itemPrice;
                        HTMLFrag += '</td><td class="priceTag">';
                        HTMLFrag += 'R ' + innerElement.totalWeight * innerElement.itemPrice;
                        total    += innerElement.totalWeight * innerElement.itemPrice;
                        HTMLFrag += '</td></tr>';
                    });
                    HTMLFrag += '<tr><td class="large" onclick="app.newRow(this)">+</td><td colspan="7"></td></tr>';
                    app.data.sales[saleIdx].total = total;
                    app.data.sales[saleIdx].notes = children[idx].parentNode.parentNode.parentNode.children[7].value;
                    saleIdx==0 ? tables[saleIdx].children[1].innerHTML = HTMLFrag : tables[saleIdx].children[0].innerHTML = HTMLFrag;
                    saleIdx==0 ? tables[saleIdx].children[2].children[0].children[1].innerHTML = 'R' + total : tables[saleIdx].children[1].children[0].children[1].innerHTML = 'R' + total;
                    app.data.slaughters.forEach(function(element, index, array) {
                        if (element.slaughterDate == sale.slaughterDate) {
                            app.data.slaughters[index].total -= sale.total;
                            app.data.slaughters[index].total += total;
                            app.binding.slaughters();
                            app.store('slaughter');
                        };
                    });
                    app.store('sale'); 
            },
            customer: function(target) {
                var element,
                    newContact = navigator.contacts.create(),
                    temp = { 
                        name:undefined,
                        emails:[],
                        phoneNumbers:[],
                        addresses:[]
                    },
                    indx = target.parentNode.dataset.index || target.parentNode.parentNode.parentNode.dataset.index,
                    contact = app.data.customers[indx];
                if (target.tagName == 'FIGCAPTION') {
                    element = target.parentNode.parentNode.parentNode;
                }else{
                    element = target.parentNode;
                };
                temp.name = {
                    givenName : element.children[1].value||element.children[1].placeholder,
                    familyName : element.children[2].value||element.children[2].placeholder
                };
                element.children[0].children[0].value = temp.name.givenName +' '+ temp.name.familyName;
                for (var i = 3; i < element.children.length; i++) {
                    if (element.children[i].type == 'email') {
                        if (element.children[i].value != '') {
                            temp.emails.push(element.children[i].value);
                        }else{
                            temp.emails.push(element.children[i].placeholder);
                        };
                    }else if(element.children[i].tagName == 'ARTICLE'){
                        temp.note = element.children[i].children[0].children[0].children[0].selectedOptions[0].value;
                    }else if(element.children[i].type == 'textarea'){     
                        temp.addresses.push(element.children[i].value);
                    }else{
                        if (element.children[i].value != '' && element.children[i].value != undefined) {
                            temp.phoneNumbers.push(element.children[i].value);
                        }else if (element.children[i].placeholder != '' && element.children[i].placeholder != undefined) {
                            temp.phoneNumbers.push(element.children[i].placeholder);
                        };
                    };
                };
                if (contact.honorificPrefix != undefined && contact.honorificPrefix != null) {
                    contact.displayName = contact.honorificPrefix +' '+ temp.name.givenName +' '+ temp.name.familyName;
                    contact.name.formatted = contact.honorificPrefix +' '+ temp.name.givenName +' '+ temp.name.familyName;
                }else{
                    contact.displayName = temp.name.givenName +' '+ temp.name.familyName;
                    contact.name.formatted = temp.name.givenName +' '+ temp.name.familyName;
                };
                contact.name.givenName = temp.name.givenName;
                contact.name.familyName = temp.name.familyName;
                contact.note = temp.note;
                if (contact.emails != null) {
                    contact.emails.forEach(function(innerElement, innerIndex, innerArray) {
                        contact.emails[innerIndex].value = temp.emails[innerIndex];
                    });
                };
                
                if (contact.phoneNumbers != null) {
                    contact.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                        contact.phoneNumbers[innerIndex].value = temp.phoneNumbers[innerIndex];
                    });
                };
                
                if (contact.addresses != null) {
                    contact.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                        innerElement.formatted = temp.addresses[innerIndex];
                    });                    
                };
                app.data.customers[indx] = contact;
                newContact.displayName = contact.displayName;
                newContact.id = contact.id;
                newContact.rawId = contact.rawId;
                newContact.name = contact.name;
                newContact.emails = contact.emails;
                newContact.phoneNumbers = contact.phoneNumbers;
                newContact.note = contact.note;
                newContact.save(function(data) {},function(err) {}); 
                //find count
                app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                    if(innerElement.location == contact.note){
                        contact.location = {
                            count : innerElement.count,
                            location : contact.note
                        };
                    };
                });
                if (contact.note.location != temp.note) {
                    if (contact.note.count <= 1) {
                        app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                            if(contact.note.location == innerElement.location){
                                app.data.locations.splice(innerIndex, 1);
                            };
                        });
                    } else{
                        contact.note.count --;
                    };
                };
                app.store('customer');
            },
            item : function(target) {
                var indx = target.parentNode.children[1].dataset.index;
                app.data.items[indx] = {
                    itemName: target.parentNode.children[0].value == '' ? target.parentNode.children[0].placeholder:target.parentNode.children[0].value,
                    itemCode : target.parentNode.children[2].value == '' ? target.parentNode.children[2].placeholder:target.parentNode.children[2].value,
                    itemPrice : target.parentNode.children[3].value == '' ? target.parentNode.children[3].placeholder:target.parentNode.children[3].value
                };
                app.binding.items();
                app.store('item');
            }
        },
        delete : {
            sale : function(idx) {
                navigator.notification.confirm(
                    "Are you sure you would like to delete the sale?",
                    function(buttonIndex) {
                        if (buttonIndex == 1) {
                            app.data.slaughters.forEach(function(element, index, array) {
                                if (element.slaughterDate == app.data.sales[idx].slaughterDate) {
                                    app.data.slaughters[index].total -= app.data.sales[idx].total;
                                    app.binding.slaughters();
                                    app.store('slaughters');
                                };
                            });
                            app.data.sales.splice(idx, 1);
                            app.binding.sales();
                            app.store('sale');
                        };
                    },
                    'Confirm Removal',
                    ['Delete','Cancel']
                );
            },
            customer : function(idx) {
                navigator.notification.confirm(
                    "Are you sure you would like to delete the customer?",
                    function(buttonIndex) {
                        if (buttonIndex == 1) {
                            app.data.customers.splice(idx, 1);
                            app.binding.customers();
                            app.store('customer');
                        };
                    },
                    'Confirm Removal',
                    ['Delete','Cancel']
                );
            },
            item : function(idx) {
                    navigator.notification.confirm(
                    "Are you sure you would like to delete the item?",
                    function(buttonIndex) {
                        if (buttonIndex == 1) {
                            app.data.items.splice(idx, 1);
                            app.store('item');
                            app.binding.items();
                        };
                    },
                    'Confirm Removal',
                    ['Delete','Cancel']
                );
            },
            slaughter : function(idx) {
                    navigator.notification.confirm(
                    "Are you sure you would like to delete the date?",
                    function(buttonIndex) {
                        if (buttonIndex == 1) {
                            app.data.slaughters.splice(idx, 1);
                            app.store('slaughter');
                            app.binding.slaughters();
                        };
                    },
                    'Confirm Removal',
                    ['Delete','Cancel']
                );
            }
        },
        search : {
            sale : function(searchTerm) {
                app.data.sales.splice(index, 1);
                app.store('sale');
            },
            customer : function(searchTerm) {
                var arr = [];

                app.data.customers.contains(searchTerm);
                if (true) {
                    HTMLFrag = '';
                    var newChar,
                        compareChar = '9',
                        numbersStarted = false;
                    arr.sort(function(a, b) {
                        return a.name.givenName.localeCompare(b.name.givenName);
                    });
                    arr.forEach(function(element, index, array) {
                                newChar = element.name.givenName.charAt(0);
                                if (newChar < compareChar) {
                                    if (element == array[0]) {
                                        HTMLFrag += '<fieldset><legend>#</legend>';
                                    };
                                    HTMLFrag += '<fieldset><legend><input type="button" value="';
                                    HTMLFrag += element.displayName;
                                        HTMLFrag += '" onclick="app.accordion(this)" ';
                                        HTMLFrag += ' data-index="';
                                        HTMLFrag += index;
                                        HTMLFrag += '"/></legend>';
                                        HTMLFrag += '<input type="text" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '"/><input type="text" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '"/>';
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                    element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="text" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select>';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '" >';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select></figcaption></figure></article>';
                                    element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea>';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '</textarea>';
                                    });
                                    HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.dataset.index)" class="cancel" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/></fieldset>';
                                };
                                if (newChar > compareChar){
                                    HTMLFrag += '</fieldset><fieldset><legend>';                              
                                    HTMLFrag += newChar;
                                    HTMLFrag += '</legend>';  
                                    compareChar = newChar;
                                    HTMLFrag += '<fieldset><legend><input type="button" value="';
                                    HTMLFrag += element.displayName;
                                        HTMLFrag += '" onclick="app.accordion(this)" ';
                                        HTMLFrag += ' data-index="';
                                        HTMLFrag += index;
                                        HTMLFrag += '"/></legend>';
                                        HTMLFrag += '<input type="text" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '" /><input type="text" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '" />';
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                    element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="text" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select>';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '" >';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select></figcaption></figure></article>';
                                    element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea>';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '</textarea>';
                                    });
                                    HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.alt)" class="cancel" alt="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/>';                              
                                    HTMLFrag += '</fieldset>';
                                }else if(newChar == compareChar){
                                    HTMLFrag += '<fieldset><legend><input type="button" value="';
                                    HTMLFrag += element.displayName;
                                        HTMLFrag += '" onclick="app.accordion(this)" ';
                                        HTMLFrag += ' data-index="';
                                        HTMLFrag += index;
                                        HTMLFrag += '"/></legend>';
                                        HTMLFrag += '<input type="text" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '"/><input type="text" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '"/>';
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                    element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="text" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select>';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.locations.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '" >';
                                        HTMLFrag += innerElement.location;
                                        HTMLFrag += '</option>';
                                    });
                                    HTMLFrag += '</select></figcaption></figure></article>';
                                    element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea>';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '</textarea>';
                                    });
                                    HTMLFrag += '<input type="image" src="img/delete.png" onclick="app.delete.customer(this.alt)" class="cancel" alt="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/>';                              
                                    HTMLFrag += '</fieldset>';
                                };
                            app.DOM.customers.innerHTML = HTMLFrag;
                    });                    
                };
            },
            item : function(searchTerm) {
                if (true) {
                    HTMLFrag = '', 
                    newChar,
                    compareChar = '9',
                    numbersStarted = false;
                    this.data.items.sort(function(a, b) {
                        return a.itemName.localeCompare(b.itemName);
                    });
                    this.data.items.forEach(function(element, index, array) {
                                newChar = element.itemName.charAt(0);
                                if (newChar < compareChar) {
                                    if (element == array[0]) {
                                        HTMLFrag += '<fieldset><legend>#</legend>';
                                    };
                                    HTMLFrag += '<article><input type="button" class="itemName" value="';
                                    HTMLFrag += element.itemName;
                                    HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.alt)" alt="';
                                    HTMLFrag += index;
                                    HTMLFrag += '" /><input type="text" class="itemCode" placeholder="';
                                    HTMLFrag += element.itemCode;
                                    HTMLFrag += '" /><input type="text" class="itemPrice" placeholder="';
                                    HTMLFrag += element.itemPrice;
                                    HTMLFrag += '" /></article>';
                                };
                                if (newChar > compareChar){
                                    HTMLFrag += '</fieldset><fieldset><legend>';                              
                                    HTMLFrag += newChar;
                                    HTMLFrag += '</legend>';  
                                    compareChar = newChar;
                                    HTMLFrag += '<article><input type="button" class="itemName" value="';
                                    HTMLFrag += element.itemName;
                                    HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.alt)" alt="';
                                    HTMLFrag += index;
                                    HTMLFrag += '" /><input type="text" class="itemCode" placeholder="';
                                    HTMLFrag += element.itemCode;
                                    HTMLFrag += '" /><input type="text" class="itemPrice" placeholder="';
                                    HTMLFrag += element.itemPrice;
                                    HTMLFrag += '" /></article>';
                                }else if(newChar == compareChar){
                                    HTMLFrag += '<article><input type="button" class="itemName" value="';
                                    HTMLFrag += element.itemName;
                                    HTMLFrag += '" /><input type="image" src="img/delete.png" class="cancel" onclick="app.delete.item(this.alt)" alt="';
                                    HTMLFrag += index;
                                    HTMLFrag += '" /><input type="text" class="itemCode" placeholder="';
                                    HTMLFrag += element.itemCode;
                                    HTMLFrag += '" /><input type="text" class="itemPrice" placeholder="';
                                    HTMLFrag += element.itemPrice;
                                    HTMLFrag += '" /></article>';
                                };
                            app.DOM.items.innerHTML = HTMLFrag;
                    });
                };
            },
            slaughter : function(searchTerm) {
                app.data.slaughters.splice(index, 1);
                app.store('slaughter');
            }
        },
        sync : {
            customers : function() {
                function onPrompt(results) {
                //alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);

                    // find all contacts with 'Bob' in any name field
                    var options      = new ContactFindOptions();
                    options.filter   = results.input1;
                    options.multiple = true;
                    var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name],
                        syncArr      = [],
                        tempArr      = app.data.customers;
                    navigator.contacts.find(fields, function(contacts) {
                        var msg = '',
                            temp = '',
                            tempNumber = 1,
                            syncNumber = 1;
                        contacts.forEach(function(element, index, array) {
                            if (element.name.formatted !== '' && element.displayName !== null && (element.displayName.indexOf('@') == -1 || element.name.formatted.indexOf('@') == -1) ) {
                            tempNumber ++;
                                if (app.data.customers.indexOf(element) == -1) {
                                    temp += syncNumber+' - ' + (element.name.formatted || element.displayName)  + '\n';
                                    syncNumber++;
                                    syncArr.push(element);
                                };
                            };
                        });
                    msg += (tempNumber - 1) + ' contacts successfully retrieved; ' + (syncNumber-1) + ' contacts are not in the customer listing:\n\n' + temp;                
                    navigator.notification.confirm(
                            msg,
                            function(buttonIndex) {
                                if (buttonIndex == 1) {
                                    syncArr.forEach(function(element, index, array) {
                                        var newCustomer = element;
                                        newCustomer.synced = true;
                                        tempArr.push(newCustomer);
                                    });
                                    app.data.customers = tempArr;
                                    /*app.data.customers.sort(function(a, b) {
                                        return a.name.givenName.toUpperCase().localeCompare(b.name.givenName.toUpperCase());
                                    });*/
                                    app.binding.customers();
                                    app.store('customer');
                                };
                            },
                            'Confirm Sync',
                            ['Add','Cancel']
                        );
                    }, function onError(contactError) {
                        //alert(results.input1);
                        navigator.notification.alert('error', function() {}, 'No Contacts Found!', 'Try Again');
                    }, options);
            };

            navigator.notification.prompt(
                'Please enter a search term',  // message
                onPrompt,                  // callback to invoke
                'Contact Sync',            // title
                ['Search','Cancel'],             // buttonLabels
                'Chicken Customer'                 // defaultText
            );
            },
            items : function() {
                //app.data.items = [];
                app.data.items.sort(function(a, b) {
                    return a.itemName.localeCompare(b.itemName);
                });
                app.store('item');
                //alert("items sync success!");
            }
        }
    };
    //eventlistener
    document.body.addEventListener("touchend", app.simulate, false);
    function onContactSuccess(contact) {
        alert("Save Success");
    };

    function onContactError(contactError) {
        alert("Error = " + contactError.code);
    };
    function onSyncSuccess(contacts) {
        alert("Save Success");
    };

    function onSyncError(contactError) {
        alert("Error = " + contactError.code);
    };
    app.initialize();
};
document.addEventListener("deviceready", onDeviceReady, false);