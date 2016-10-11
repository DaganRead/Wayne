var app;
function onDeviceReady() {
    app = {
        picked : false,
        menu : false,
        websocket : {
            public : io('http://gaz-huntingapp.rhcloud.com:8000/public'),
            private : io('http://gaz-huntingapp.rhcloud.com:8000/restricted')
        },
        DOM : {
            newSale: document.getElementById('newSale'),
            sales: document.getElementById('sales'),
            customers: document.getElementById('customers'),
            items: document.getElementById('items'),
            slaughters: document.getElementById('slaughters'),
            modal : document.getElementById('modal-12'),
            serverHandle : document.getElementById('serverHandle'),
            menuLeft : document.getElementById('cbp-spmenu-s1'),
            menuLeft2 : document.getElementById('advancedMenu')
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
        openMenu : function() {
            return function() {
                if (app.menu) {
                    app.menu = false;
                    window.location.hash = '#page-wrap';
                    classie.toggle( document.body, 'cbp-spmenu-push-toright' );
                    document.getElementById('page-wrap').removeEventListener('click',app.closeMenu, false);
                } else{
                    app.menu = true;
                    window.location.hash = '';
                    //classie.toggle( thisObj, 'active' );
                    classie.toggle( document.body, 'cbp-spmenu-push-toright' );
                    document.getElementById('page-wrap').addEventListener("click",app.closeMenu, false);
                };
            };
        },
        closeMenu : function() {
            app.menu = false;
            window.location.hash = '#page-wrap';
            classie.toggle( document.body, 'cbp-spmenu-push-toright' );
            document.getElementById('page-wrap').removeEventListener('click',app.closeMenu, false);
        },
        switchMenu : function() {
            classie.toggle( app.DOM.menuLeft2, 'active' );
        },
        login : function() {
            if(classie.hasClass(app.DOM.modal, 'md-show')){
                classie.removeClass(app.DOM.modal, 'md-show');
            }; 
        },
        logout : function() {
            return function() {
                delete window.localStorage['token'];
                classie.addClass(app.DOM.modal, 'md-show');
                var message = {
                    type:'logout',
                    token:token
                };
                app.DOM.serverHandle.contentWindow.postMessage(JSON.stringify(message),'http://gaz-huntingapp.rhcloud.com');
            };
        },
        failSafe : function() {
                delete window.localStorage['token'];
                classie.addClass(app.DOM.modal, 'md-show');
                var message = {
                    type:'logout',
                    token:token
                };
                app.DOM.serverHandle.contentWindow.postMessage(JSON.stringify(message),'http://gaz-huntingapp.rhcloud.com');
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
            };
        },
        initialize: function() {
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
                window.location.hash = '#page-wrap';
                var menuLinksLive = document.getElementsByTagName('nav');
                for (var i = 0; i < menuLinksLive.length; i++) {
                    for (var ii = 0; ii < menuLinksLive[i].children.length; ii++) {
                        for (var iii = 0; iii < menuLinksLive[i].children[ii].children.length; iii++) {
                            if (classie.hasClass(menuLinksLive[i].children[ii].children[iii], "backUp")) {
                                menuLinksLive[i].children[ii].children[iii].addEventListener("click", function(e) { app.sync.backUp();}, false);
                            }else if(classie.hasClass(menuLinksLive[i].children[ii].children[iii], "advanced") || classie.hasClass(menuLinksLive[i].children[ii].children[iii], "main")){
                                menuLinksLive[i].children[ii].children[iii].addEventListener("click", function(e) { app.switchMenu();}, false);
                            }else if(classie.hasClass(menuLinksLive[i].children[ii].children[iii], "loginExpire" )){
                                menuLinksLive[i].children[ii].children[iii].addEventListener("change", function(e) { nextSibling.innerHTML = e.target.value +' day/days';}, false);
                            }else if(classie.hasClass(menuLinksLive[i].children[ii].children[iii], "storeLocal" )){
                                menuLinksLive[i].children[ii].children[iii].children[0].addEventListener("change", function(e) { alert('keep local');}, false);
                            };
                        };
                    };
                };
                document.getElementById('btn_search_sales').addEventListener("click", function(e) { app.search.sales(e.target);}, false);
                this.data = JSON.parse(window.localStorage['data']);
                //app.binding();
                /*New Sales*/
                var HTMLFrag = '<article id="newSale"><span class="header">Slaughter Date:</span><br /><select id="newSaleSlaughterDate">';
                                HTMLFrag += '<option disabled selected value=""></option>';
                                app.data.slaughters.forEach(function(element, index, array) {
                                    HTMLFrag += '<option value="';
                                    HTMLFrag += element.slaughterDate;
                                    HTMLFrag += '">';
                                    HTMLFrag += element.slaughterDate;
                                    HTMLFrag += '</option>';
                                });
                                HTMLFrag += '</select><br /><span class="header">Customer:</span><br /><figure class="location" id="btn_pickContact" ><figcaption id="newSaleLocation">Pick</figcaption></figure><input type="text" placeholder="Last Name" onblur="app.customerSearch( null, this.value )" id="newSaleLastName"/><input type="text" placeholder="First Name" id="newSaleFirstName" onblur="app.customerSearch( this.value )" /><br class="clear" /><input type="email" placeholder="Email" id="newSaleEmail"/><br /><input type="text" placeholder="046-625 526 0" id="newSaleTelephone"/><br /><textarea id="newSaleAddress" cols="50">Address</textarea> <br class="clear" /><select id="newSaleLocationSelect">';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.locations.forEach(function(element, index, array) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += element.location;
                                        HTMLFrag += '">';
                                        HTMLFrag += element.location;
                                        HTMLFrag += '</option>';
                                    }); 
                                    HTMLFrag += '</select><input type="text" placeholder="New Location" id="newSaleAddLocationText"/><input type="button" id="newSaleAddLocationBtn" value="Add"><br class="clear"/><span class="header">Purchase Table:</span><br /><table id="newSalePurchaseTable"><thead><tr><th>Item</th><th>Qnt</th><th>Mass</th></tr></thead><tbody><tr><td>';
                                    HTMLFrag += '<select id="btn_tableInput" class="tableInput" >';
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
                                    HTMLFrag += '</tbody></table><br /><input type="button" class="confirm" value="Confirm" id="btn_newSale" /><input type="button" class="cancel" value="Cancel"></article>';
                                    document.getElementById('newSale').innerHTML = HTMLFrag;
                /* Sales */
                HTMLFrag = '';
                var total = 0;

               this.data.sales.sort(function(a,b) { 
                    var month = a.slaughterDate.substring(4,7),
                    day = a.slaughterDate.substring(8,10),
                    year = a.slaughterDate.substring(11,15),
                    dateString = month +' '+ day +', '+ year,
                    month2 = b.slaughterDate.substring(4,7),
                    day2 = b.slaughterDate.substring(8,10),
                    year2 = b.slaughterDate.substring(11,15),
                    dateString2 = month2 +' '+ day2 +', '+ year2;

                    return new Date(dateString).getTime() - new Date(dateString2).getTime() 
                });
                    

                this.data.sales.forEach(function(element, index, array) {
/*                    var month = element.slaughterDate.substring(4,7),
                    day = element.slaughterDate.substring(8,10),
                    year = element.slaughterDate.substring(11,15),
                    dateString = month +' '+ day +', '+ year;

                    alert(new Date(dateString).getTime());*/

                            HTMLFrag +='<fieldset data-index="';
                            HTMLFrag += index;
                            HTMLFrag += '" data-indexOld="';
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
                                HTMLFrag += '<select class="itemCode" data-index="';
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
                                HTMLFrag += 'R ' + Math.ceil10(innerElement.itemPrice, -1);
                                HTMLFrag += '</td><td class="priceTag">';
                                HTMLFrag += 'R ' + Math.ceil10(innerElement.totalWeight * innerElement.itemPrice, -1);//bug
                                total    += Math.ceil10(innerElement.totalWeight * innerElement.itemPrice, -1);
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
                            HTMLFrag += '<tr><td class="large">+</td><td colspan="7"></td></tr>';
                            HTMLFrag += '</tbody><tfoot><tr><td colspan="6">Total: </td><td colspan="2">';
                            HTMLFrag += 'R' + Math.ceil10(total, -1);
                            HTMLFrag += '</td></tr></tfoot></table>';
                            total = 0;
                            HTMLFrag += '<br /><span class="noteHeader" >Notes:</span><br class="clear" /><textarea class="notes" data-index="';
                            HTMLFrag += index;
                            HTMLFrag += '" >'; 
                            HTMLFrag += element.notes;
                            HTMLFrag += '</textarea>';
                            HTMLFrag += '<input type="button" value="clear" class="noteClear"/> <br class="clear" /><img src="img/delete.png" class="cancel" data-type="sale" data-index="';
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
                                        HTMLFrag += '" class="accordion" /></legend>';
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                HTMLFrag += element.name.givenName;
                                HTMLFrag += '"/><input type="text" data-type="updateCustomer" placeholder="';
                                HTMLFrag += element.name.familyName;
                                HTMLFrag += '"/>';
                                if (element.emails!=null) {
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                if (element.phoneNumbers!=null) {
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
                                        HTMLFrag += '"/>';
                                };
                                HTMLFrag += '<br /><article>';
                                HTMLFrag += '<figure class="location" ><figcaption>';
                                HTMLFrag += '<select data-type="updateCustomer">';
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
                                    /*element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea data-type="updateCustomer">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });*/
                                    HTMLFrag += '<textarea data-type="updateCustomer">';
                                    HTMLFrag += element.addresses[0].formatted;
                                    HTMLFrag += '</textarea>';
                                }else{
                                    HTMLFrag += '<textarea data-type="updateCustomer"></textarea>';
                                };
                                HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
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
                                        HTMLFrag += '" class="accordion" data-index="';
                                        HTMLFrag += index;
                                        HTMLFrag += '"/></legend>';
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                HTMLFrag += element.name.givenName;
                                HTMLFrag += '" /><input type="text" data-type="updateCustomer" placeholder="';
                                HTMLFrag += element.name.familyName;
                                HTMLFrag += '" />';
                                if (element.emails!=null) {
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                if (element.phoneNumbers!=null) {
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
                                        HTMLFrag += '"/>';
                                };
                                HTMLFrag += '<br /><article>';
                                HTMLFrag += '<figure class="location" ><figcaption>';
                                HTMLFrag += '<select data-type="updateCustomer">';
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
                                    /*element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea data-type="updateCustomer">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });*/
                                    HTMLFrag += '<textarea data-type="updateCustomer">';
                                    HTMLFrag += element.addresses[0].formatted;
                                    HTMLFrag += '</textarea>';
                                }else{
                                    HTMLFrag += '<textarea data-type="updateCustomer"></textarea>';
                                };
                                HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"/>';                              
                                HTMLFrag += '</fieldset>';
                            }else if(newChar == compareChar){
                                HTMLFrag += '<fieldset data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '"><legend><input type="button" value="';
                                HTMLFrag += element.displayName;
                                        HTMLFrag += '" class="accordion" /></legend>';
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                HTMLFrag += element.name.givenName;
                                HTMLFrag += '"/><input type="text" data-type="updateCustomer" placeholder="';
                                HTMLFrag += element.name.familyName;
                                HTMLFrag += '"/>';
                                if (element.emails!=null) {
                                    element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<input type="email" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += innerElement.value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += innerIndex;
                                        HTMLFrag += '"/>';
                                    });
                                };
                                if (element.phoneNumbers!=null) {
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
                                        HTMLFrag += '"/>';
                                };
                                HTMLFrag += '<br /><article>';
                                HTMLFrag += '<figure class="location" ><figcaption>';
                                HTMLFrag += '<select data-type="updateCustomer">';
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
                                    /*element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea data-type="updateCustomer">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });*/
                                    HTMLFrag += '<textarea data-type="updateCustomer">';
                                    HTMLFrag += element.addresses[0].formatted;
                                    HTMLFrag += '</textarea>';
                                }else{
                                    HTMLFrag += '<textarea data-type="updateCustomer"></textarea>';
                                };
                                HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
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
                                HTMLFrag += '<article><input type="button" data-type="updateItem" class="itemName" value="';
                                HTMLFrag += element.itemName;
                                HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '" /><input type="text" data-type="updateItem" class="itemCode" placeholder="';
                                HTMLFrag += element.itemCode;
                                HTMLFrag += '" /><input type="text" data-type="updateItem" class="itemPrice" placeholder="';
                                HTMLFrag += element.itemPrice;
                                HTMLFrag += '" /></article>';
                            };
                            if (newChar > compareChar){
                                HTMLFrag += '</fieldset><fieldset><legend>';                              
                                HTMLFrag += newChar;
                                HTMLFrag += '</legend>';  
                                compareChar = newChar;
                                HTMLFrag += '<article><input type="button" data-type="updateItem" class="itemName" value="';
                                HTMLFrag += element.itemName;
                                HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '" /><input type="text" data-type="updateItem" class="itemCode" placeholder="';
                                HTMLFrag += element.itemCode;
                                HTMLFrag += '" /><input type="text" data-type="updateItem" class="itemPrice" placeholder="';
                                HTMLFrag += element.itemPrice;
                                HTMLFrag += '" /></article>';
                            }else if(newChar == compareChar){
                                HTMLFrag += '<article><input type="button" data-type="updateItem" class="itemName" value="';
                                HTMLFrag += element.itemName;
                                HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
                                HTMLFrag += index;
                                HTMLFrag += '" /><input type="text" data-type="updateItem" class="itemCode" placeholder="';
                                HTMLFrag += element.itemCode;
                                HTMLFrag += '" /><input type="text" data-type="updateItem" class="itemPrice" placeholder="';
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
                    HTMLFrag += Math.ceil10(element.total, -1);
                    HTMLFrag += '"/><img data-type="slaughter" src="img/delete.png" class="cancel" data-index="';
                    HTMLFrag += index;
                    HTMLFrag += '" />';
                    HTMLFrag += '</article>';
                });
                app.DOM.slaughters.innerHTML = HTMLFrag;

                //Event Listereners

                document.getElementById('tab-1').addEventListener("click", function(e) { app.nav.to('Sales'); }, false);
                document.getElementById('tab-2').addEventListener("click", function() { app.nav.to('Customers'); }, false);
                document.getElementById('tab-3').addEventListener("click", function() { app.nav.to('Items'); }, false);
                document.getElementById('tab-4').addEventListener("click", function() { app.nav.to('Slaughters'); }, false);
                document.getElementById('tab-5').addEventListener("click", function() { app.nav.to('New'); }, false);
                document.getElementById('btn_logout').addEventListener("click", app.logout(), false);
                document.getElementById('btn_menu').addEventListener("click", app.openMenu(), false);
                document.getElementById('btn_sync_customer').addEventListener("click", function() { app.sync.customers() }, false);
                //new Sale
                document.getElementById('btn_newSale').addEventListener("click", function(e) { app.newSale(); }, false);
                document.getElementById('btn_pickContact').addEventListener("click", function() { app.pickContact(); }, false); 
                document.getElementById('newSaleAddLocationBtn').addEventListener("click", function() { app.newLocation(); }, false); 
                var tableInputsLive = document.getElementsByTagName('select');
                for (var i = 0; i < tableInputsLive.length; i++) {
                    if (classie.hasClass(tableInputsLive[i], "tableInput")) {
                        tableInputsLive[i].addEventListener("click", function(e) { app.purchaseTableAdd(e.target);}, false);
                    };
                };
                // Delete and sales
                var newRowsLive = document.getElementsByTagName('td'),
                    inputsLive = document.getElementsByTagName('input'),
                    notesLive = document.getElementsByTagName('textarea'),
                    selectsLive = document.getElementsByTagName('select'),
                    imgsLive = document.getElementsByTagName('img');

                for (var i = 0; i < selectsLive.length; i++) {
                    if (classie.hasClass(selectsLive[i], "itemCode")) {
                        selectsLive[i].addEventListener("change", function(e) { app.update.sale(e.target);}, false);
                    }else if (selectsLive[i].dataset.type == "updateCustomer") {
                        selectsLive[i].onblur = function(e) { app.update.sale(e.target.parentNode);};
                        //selectsLive[i].addEventListener("blur", function(e) { app.update.customer(e.target.parentNode);}, false);
                    };
                };
                for (var i = 0; i < newRowsLive.length; i++) {
                    if (classie.hasClass(newRowsLive[i], "large")) {
                        newRowsLive[i].onclick = function(e) { app.newRow(e.target);};
                    };
                };
                for (var i = 0; i < inputsLive.length; i++) {
                    if (classie.hasClass(inputsLive[i], "cancel") && inputsLive[i].value == "sales") {
                        inputsLive[i].addEventListener("click", function(e) {app.delete.sale(e.target.dataset.index);}, false);
                    }else if(classie.hasClass(inputsLive[i], "noteClear")){
                        inputsLive[i].addEventListener("click", function(e) { e.target.previousSibling.value=''; app.update.sale(e.target.previousSibling);}, false);
                    }else if(classie.hasClass(inputsLive[i], "weight")||classie.hasClass(inputsLive[i], "quantity")){
                        inputsLive[i].addEventListener("blur", function(e) { app.update.sale(e.target);}, false);
                    }else if(classie.hasClass(inputsLive[i], "accordion")){
                        inputsLive[i].addEventListener("click", function(e) { app.accordion(e.target);}, false);
                    }else if(inputsLive[i].dataset.type == "updateCustomer"){
                        inputsLive[i].addEventListener("blur", function(e) { app.update.customer(e.target);}, false);
                    }else if (inputsLive[i].dataset.type == "updateItem") {
                        inputsLive[i].addEventListener("blur", function(e) { app.update.item(e.target);}, false);
                    };
                };
                for (var i = 0; i < imgsLive.length; i++) {
                    if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "sale") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.sale(e.target.dataset.index); }, false);
                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "customer") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.customer(e.target.dataset.index); }, false);
                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "item") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.item(e.target.dataset.index); }, false);
                    }else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "slaughter") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.slaughter(e.target.dataset.index); }, false);
                    };
                };
                for (var i = 0; i < notesLive.length; i++) {
                    if (classie.hasClass(notesLive[i], "notes")) {
                        notesLive[i].onblur =  function(e) { app.update.sale(e.target);};
                    }else if (notesLive[i].dataset.type == "updateCustomer") {
                        notesLive[i].onblur = function(e) { app.update.customer(e.target);};
                    };
                };
                //end
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
                //alert(JSON.stringify(newSale));
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
                }else{
                    alert('pick instead');
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
                this.data.sales.sort(function(a,b) { 
                    var month = a.slaughterDate.substring(4,7),
                    day = a.slaughterDate.substring(8,10),
                    year = a.slaughterDate.substring(11,15),
                    dateString = month +' '+ day +', '+ year,
                    month2 = b.slaughterDate.substring(4,7),
                    day2 = b.slaughterDate.substring(8,10),
                    year2 = b.slaughterDate.substring(11,15),
                    dateString2 = month2 +' '+ day2 +', '+ year2;

                    return new Date(dateString).getTime() - new Date(dateString2).getTime() 
                });
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
                                    HTMLFrag += 'R ' + Math.ceil10(iiiElement.itemPrice, -1);
                                    HTMLFrag += '</td><td class="priceTag">';
                                    HTMLFrag += 'R ' + Math.ceil10((iiiElement.totalWeight * iiiElement.itemPrice), -1);
                                    total    += Math.ceil10((iiiElement.totalWeight * iiiElement.itemPrice), -1);
                                    HTMLFrag += '</td></tr>';
                                });
                                HTMLFrag += '</tbody><tfoot><tr><td colspan="6">Total: </td><td colspan="2">';
                                HTMLFrag += 'R' + Math.ceil10(total, -1);
                                HTMLFrag += '</td></tr></tfoot></table>';
                                total = 0;
                                HTMLFrag += '<br /><span class="noteHeader" >Notes:</span><br class="clear" /><textarea class="notes" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" onblur="app.update.sale(this)" > '; 
                                HTMLFrag += innerElement.notes;
                                HTMLFrag += '</textarea>';
                                HTMLFrag += '<input type="button" value="clear" class="noteClear" onclick="this.previousSibling.value=\' \' " /> <br class="clear" /><img src="img/delete.png" class="cancel" data-type="sale" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"/></fieldset>';
                    });
                    app.DOM.sales.innerHTML = HTMLFrag;
                    var newRowsLive = document.getElementsByTagName('td'),
                    inputsLive = document.getElementsByTagName('input'),
                    notesLive = document.getElementsByTagName('textarea'),
                    selectsLive = document.getElementsByTagName('select'),
                    imgsLive = document.getElementsByTagName('img');

                for (var i = 0; i < selectsLive.length; i++) {
                    if (classie.hasClass(selectsLive[i], "itemCode")) {
                        selectsLive[i].onblur = function(e) { app.update.sale(e.target);};
                    };
                };
                for (var i = 0; i < newRowsLive.length; i++) {
                    if (classie.hasClass(newRowsLive[i], "large")) {
                        newRowsLive[i].onclick = function(e) { app.newRow(e.target);};
                    };
                };
                for (var i = 0; i < inputsLive.length; i++) {

                    if (classie.hasClass(inputsLive[i], "cancel") && inputsLive[i].value == "sales") {
                        inputsLive[i].addEventListener("click", function(e) {app.delete.sale(e.target.dataset.index);}, false);

                    }else if(classie.hasClass(inputsLive[i], "noteClear")){
                        inputsLive[i].addEventListener("click", function(e) { e.target.previousSibling.value=''; app.update.sale(e.target.previousSibling);}, false);

                    }else if(classie.hasClass(inputsLive[i], "weight")||classie.hasClass(inputsLive[i], "quantity")){
                        inputsLive[i].addEventListener("blur", function(e) { app.update.sale(e.target);}, false);

                    };
                };
                for (var i = 0; i < imgsLive.length; i++) {

                    if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "sale") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.sale(e.target.dataset.index); }, false);

                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "customer") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.customer(e.target.dataset.index); }, false);

                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "item") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.item(e.target.dataset.index); }, false);

                    }else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "slaughter") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.slaughter(e.target.dataset.index); }, false);

                    };
                };
                for (var i = 0; i < notesLive.length; i++) {
                    if (classie.hasClass(notesLive[i], "notes")) {
                        notesLive[i].onblur =  function(e) { app.update.sale(e.target);};
                    };
                };

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
                            HTMLFrag += '"/><img data-type="slaughter" src="img/delete.png" class="cancel" data-index="';
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
                "note" : '',
                "emails" : [new ContactField('work', this.forms.newCustomer.email(), false)],
                "phoneNumbers" : [new ContactField('work', this.forms.newCustomer.telephone(), false)],
                "addresses" : [{formatted:this.forms.newCustomer.address()}]
            }), match = true;
            newCustomer.location = { location : this.forms.newCustomer.location()};
            this.data.customers.forEach(function(element, index, array) {
                if (newCustomer.displayName == element.displayName) {
                    match = false;
                };
            });
            if (match) {
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
                count : 0
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
                                HTMLFrag += '</select><br /><span class="header">Customer:</span><br /><figure class="location" id="btn_pickContact" ><figcaption id="newSaleLocation">Pick</figcaption></figure><input type="text" placeholder="Last Name" onblur="app.customerSearch( null, this.value )" id="newSaleLastName"/><input type="text" placeholder="First Name" id="newSaleFirstName" onblur="app.customerSearch( this.value )" /><br class="clear" /><input type="email" placeholder="Email" id="newSaleEmail"/><br /><input type="text" placeholder="046-625 526 0" id="newSaleTelephone"/><br /><textarea id="newSaleAddress" cols="50">Address</textarea> <br class="clear" /><select id="newSaleLocationSelect">';
                                    HTMLFrag += '<option disabled selected value=""></option>';
                                    app.data.locations.forEach(function(element, index, array) {
                                        HTMLFrag += '<option value="';
                                        HTMLFrag += element.location;
                                        HTMLFrag += '">';
                                        HTMLFrag += element.location;
                                        HTMLFrag += '</option>';
                                    }); 
                                    HTMLFrag += '</select><input type="text" placeholder="New Location" id="newSaleAddLocationText"/><input type="button" id="newSaleAddLocationBtn" value="Add"><br class="clear"/><span class="header">Purchase Table:</span><br /><table id="newSalePurchaseTable"><thead><tr><th>Item</th><th>Qnt</th><th>Mass</th></tr></thead><tbody><tr><td>';
                                    HTMLFrag += '<select id="btn_tableInput" class="tableInput" >';
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
                                    HTMLFrag += '</tbody></table><br /><input type="button" class="confirm" value="Confirm" id="btn_newSale" /><input type="button" class="cancel" value="Cancel"></article>';
                                    document.getElementById('newSale').innerHTML = HTMLFrag;
                                    //Event listeners
                                    document.getElementById('btn_newSale').addEventListener("click", function(e) { app.newSale(); }, false);
                                    document.getElementById('btn_pickContact').addEventListener("click", function() { app.pickContact(); }, false); 
                                    document.getElementById('newSaleAddLocationBtn').addEventListener("click", function() { app.newLocation(); }, false); 
                                    var tableInputsLive = document.getElementsByTagName('select');
                                    for (var i = 0; i < tableInputsLive.length; i++) {
                                        if (classie.hasClass(tableInputsLive[i], "tableInput")) {
                                            tableInputsLive[i].addEventListener("click", function(e) { app.purchaseTableAdd(e.target);}, false);
                                        };
                                    };
                                    //alert(parent.children[2].tagName);
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
                                        HTMLFrag += '</select><input type="text" placeholder="New Location" id="newCustomerAddLocationText"/><input type="button" id="newCustomerAddLocationBtn" value="Add" onclick="app.newLocation()"><br class="clear"/><input type="button" class="confirm" value="Confirm" id="btn_newCustomer" /><input type="button" class="cancel" value="Cancel"></article>';
                                document.getElementById('newSale').innerHTML = HTMLFrag;
                                document.getElementById('btn_newCustomer').addEventListener("click", function(e) { app.newCustomer(); }, false);
                                 //app.purchaseTableAdd(this)                            
                                break;
                            case "Items":
                                document.getElementById('newSale').innerHTML  = '<article id="newItem"><input type="text" id="newItemName" placeholder="Item Name"/><input type="text" id="newItemCode" placeholder="Item Code"/><input type="text" id="newItemPrice" placeholder="R0.00"/><br /><input type="button" id="btn_newItem" class="confirm"value="Confirm" /><input type="button" class="cancel" value="Cancel"></article>';
                                document.getElementById('btn_newItem').addEventListener("click", function(e) { app.newItem(); }, false);                                
                                break;
                            case "Slaughters":
                                document.getElementById('newSale').innerHTML  = '<article id="newSlaughter"><span>New Slaughter Date:</span><br /><input type="text" id="newSlaughterDate" placeholder="Fri Jan 01 2016"/><br /><input type="button" class="confirm" value="Confirm" id="btn_newSlaughter" onclick="app.newSlaughter()" /><input type="button" class="cancel" value="Cancel"></article>';
                                var slaughterDate = new Pikaday({ 
                                    field: document.getElementById('newSlaughterDate'),
                                    onSelect: function(date) {
                                        app.forms.newSlaughter.slaughterDate = slaughterDate.toString();
                                    }
                                });
                                document.getElementById('btn_newSlaughter').addEventListener("click", function(e) { app.newSlaughter(); }, false);
                                break;
                        }
                    };                    
            }
        },
        binding : {
            sales : function() {
                var HTMLFrag = '',
                    total = 0;

                app.data.sales.sort(function(a,b) { 
                    var month = a.slaughterDate.substring(4,7),
                    day = a.slaughterDate.substring(8,10),
                    year = a.slaughterDate.substring(11,15),
                    dateString = month +' '+ day +', '+ year,
                    month2 = b.slaughterDate.substring(4,7),
                    day2 = b.slaughterDate.substring(8,10),
                    year2 = b.slaughterDate.substring(11,15),
                    dateString2 = month2 +' '+ day2 +', '+ year2;

                    return new Date(dateString).getTime() - new Date(dateString2).getTime() 
                });

                    app.data.sales.forEach(function(innerElement, innerIndex, innerArray) {
                                HTMLFrag +='<fieldset data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" data-indexOld="';
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
                                    HTMLFrag += 'R ' + Math.ceil10(iiiElement.itemPrice, -1);
                                    HTMLFrag += '</td><td class="priceTag">';
                                    HTMLFrag += 'R ' + Math.ceil10((iiiElement.totalWeight * iiiElement.itemPrice), -1);
                                    total    += Math.ceil10((iiiElement.totalWeight * iiiElement.itemPrice), -1);
                                    HTMLFrag += '</td></tr>';
                                });
                                HTMLFrag += '<tr><td class="large" onclick="app.newRow(this)">+</td><td colspan="7"></td></tr>';
                                HTMLFrag += '</tbody><tfoot><tr><td colspan="6">Total: </td><td colspan="2">';
                                HTMLFrag += 'R' + Math.ceil10(total, -1);
                                HTMLFrag += '</td></tr></tfoot></table>';
                                total = 0;
                                HTMLFrag += '<br /><span class="noteHeader" >Notes:</span><br class="clear" /><textarea class="notes" onblur="app.update.sale(this)" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"  > '; 
                                HTMLFrag += innerElement.notes;
                                HTMLFrag += '</textarea>';
                                HTMLFrag += '<input type="button" value="clear" class="noteClear" onclick="this.previousSibling.value=\' \' " /> <br class="clear" /><img src="img/delete.png" class="cancel" data-type="sale" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"/></fieldset>';
                    });
                    app.DOM.sales.innerHTML = HTMLFrag;

                    var newRowsLive = document.getElementsByTagName('td'),
                    inputsLive = document.getElementsByTagName('input'),
                    notesLive = document.getElementsByTagName('textarea'),
                    selectsLive = document.getElementsByTagName('select'),
                    imgsLive = document.getElementsByTagName('img');

                for (var i = 0; i < selectsLive.length; i++) {
                    if (classie.hasClass(selectsLive[i], "itemCode")) {
                        selectsLive[i].onblur = function(e) { app.update.sale(e.target);};
                    };
                };
                for (var i = 0; i < newRowsLive.length; i++) {
                    if (classie.hasClass(newRowsLive[i], "large")) {
                        newRowsLive[i].onclick = function(e) { app.newRow(e.target);};
                    };
                };
                for (var i = 0; i < inputsLive.length; i++) {

                    if (classie.hasClass(inputsLive[i], "cancel") && inputsLive[i].value == "sales") {
                        inputsLive[i].addEventListener("click", function(e) {app.delete.sale(e.target.dataset.index);}, false);

                    }else if(classie.hasClass(inputsLive[i], "noteClear")){
                        inputsLive[i].addEventListener("click", function(e) { e.target.previousSibling.value=''; app.update.sale(e.target.previousSibling);}, false);

                    }else if(classie.hasClass(inputsLive[i], "weight")||classie.hasClass(inputsLive[i], "quantity")){
                        inputsLive[i].addEventListener("blur", function(e) { app.update.sale(e.target);}, false);

                    };
                };
                for (var i = 0; i < imgsLive.length; i++) {

                    if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "sale") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.sale(e.target.dataset.index); }, false);

                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "customer") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.customer(e.target.dataset.index); }, false);

                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "item") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.item(e.target.dataset.index); }, false);

                    }else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "slaughter") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.slaughter(e.target.dataset.index); }, false);

                    };
                };
                for (var i = 0; i < notesLive.length; i++) {
                    if (classie.hasClass(notesLive[i], "notes")) {
                        notesLive[i].onblur =  function(e) { app.update.sale(e.target);};
                    };
                };
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
                                    HTMLFrag += '" class="accordion" /></legend>';
                                    HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '"/><input type="text" data-type="updateCustomer" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '"/>'; 
                                    if (element.emails!=null) {
                                        element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="email" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    if (element.phoneNumbers!=null) {
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
                                        HTMLFrag += '"/>';
                                    };
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select data-type="updateCustomer">';
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
                                        /*element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<textarea data-type="updateCustomer">';
                                            HTMLFrag += innerElement.formatted;
                                            HTMLFrag += '</textarea>';
                                        });*/
                                        HTMLFrag += '<textarea data-type="updateCustomer">';
                                        HTMLFrag += element.addresses[0].formatted;
                                        HTMLFrag += '</textarea>';
                                    }else{
                                        HTMLFrag += '<textarea data-type="updateCustomer"></textarea>';
                                    };
                                    HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
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
                                    HTMLFrag += '" class="accordion" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/></legend>';
                                    HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '" /><input type="text" data-type="updateCustomer" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '" />';
                                    if (element.emails!=null) {
                                        element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="email" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    if (element.phoneNumbers!=null) {
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
                                        HTMLFrag += '"/>';
                                    };
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select data-type="updateCustomer">';
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
                                    /*element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea data-type="updateCustomer">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });*/
                                    HTMLFrag += '<textarea data-type="updateCustomer">';
                                    HTMLFrag += element.addresses[0].formatted;
                                    HTMLFrag += '</textarea>';
                                }else{
                                    HTMLFrag += '<textarea data-type="updateCustomer"></textarea>';
                                };
                                    HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/>';                              
                                    HTMLFrag += '</fieldset>';
                                }else if(newChar == compareChar){
                                    HTMLFrag += '<fieldset data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"><legend><input type="button" value="';
                                    HTMLFrag += element.displayName;
                                            HTMLFrag += '" class="accordion" data-index="';
                                            HTMLFrag += index;
                                            HTMLFrag += '"/></legend>';
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                    HTMLFrag += element.name.givenName;
                                    HTMLFrag += '"/><input type="text" data-type="updateCustomer" placeholder="';
                                    HTMLFrag += element.name.familyName;
                                    HTMLFrag += '"/>';
                                    if (element.emails!=null) {
                                        element.emails.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="email" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });
                                    };
                                    if (element.phoneNumbers!=null) {
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
                                        HTMLFrag += '"/>';
                                    };
                                    HTMLFrag += '<br /><article>';
                                    HTMLFrag += '<figure class="location" ><figcaption>';
                                    HTMLFrag += '<select data-type="updateCustomer">';
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
                                    /*element.addresses.forEach(function(innerElement, innerIndex, innerArray) {
                                        HTMLFrag += '<textarea data-type="updateCustomer">';
                                        HTMLFrag += innerElement.formatted;
                                        HTMLFrag += '</textarea>';
                                    });*/
                                    HTMLFrag += '<textarea data-type="updateCustomer">';
                                    HTMLFrag += element.addresses[0].formatted;
                                    HTMLFrag += '</textarea>';
                                }else{
                                    HTMLFrag += '<textarea data-type="updateCustomer"></textarea>';
                                };
                                    HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '"/>';                              
                                    HTMLFrag += '</fieldset>';
                                };
                            app.DOM.customers.innerHTML = HTMLFrag;
                    });

                //event listeners
                   var inputsLive = document.getElementsByTagName('input'),
                    imgsLive = document.getElementsByTagName('img'),
                    notesLive = document.getElementsByTagName('textarea'),
                    selectsLive = document.getElementsByTagName('select');

                for (var i = 0; i < inputsLive.length; i++) {

                    if(classie.hasClass(inputsLive[i], "accordion")){
                        inputsLive[i].addEventListener("click", function(e) { app.accordion(e.target);}, false);

                    }else if(inputsLive[i].dataset.type == "updateCustomer"){
                        inputsLive[i].addEventListener("blur", function(e) { app.update.customer(e.target);}, false);
                    }else if (inputsLive[i].dataset.type == "updateItem") {
                        inputsLive[i].addEventListener("blur", function(e) { app.update.item(e.target);}, false);
                    };

                };
                for (var i = 0; i < selectsLive.length; i++) {
                    if (selectsLive[i].dataset.type == "updateCustomer") {
                        selectsLive[i].onblur = function(e) { app.update.sale(e.target.parentNode);};
                        //selectsLive[i].addEventListener("blur", function(e) { app.update.customer(e.target.parentNode);}, false);
                    };
                };
                for (var i = 0; i < imgsLive.length; i++) {

                    if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "customer") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.customer(e.target.dataset.index); }, false);

                    };
                };
                for (var i = 0; i < notesLive.length; i++) {
                    if (notesLive[i].dataset.type == "updateCustomer") {
                        notesLive[i].addEventListener("blur", function(e) { app.update.customer(e.target);}, false);
                    };
                };


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
                                HTMLFrag += '<article><input type="button" data-type="updateItem" class="itemName" value="';
                                HTMLFrag += innerElement.itemName;
                                HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" />';
                                HTMLFrag+='<input type="text" data-type="updateItem" class="itemCode" placeholder="';
                                HTMLFrag += innerElement.itemCode;
                                HTMLFrag += '" />';
                                HTMLFrag += '<input type="text" data-type="updateItem" class="itemPrice" placeholder="';
                                HTMLFrag += innerElement.itemPrice;
                                HTMLFrag += '" />';
                                HTMLFrag +='</article>';
                            };
                            if (newChar > compareChar){
                                HTMLFrag += '</fieldset><fieldset><legend>';                              
                                HTMLFrag += newChar;
                                HTMLFrag += '</legend>';  
                                compareChar = newChar;
                                HTMLFrag += '<article><input type="button" data-type="updateItem" class="itemName" value="';
                                HTMLFrag += innerElement.itemName;
                                HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"/>';
                                HTMLFrag+='<input type="text" data-type="updateItem" class="itemCode" placeholder="';
                                HTMLFrag += innerElement.itemCode;
                                HTMLFrag += '" />';
                                HTMLFrag += '<input type="text" data-type="updateItem" class="itemPrice" placeholder="';
                                HTMLFrag += innerElement.itemPrice;
                                HTMLFrag += '" />';
                                HTMLFrag +='</article>';
                            }else if(newChar == compareChar){
                                HTMLFrag += '<article><input type="button" data-type="updateItem" class="itemName" value="';
                                HTMLFrag += innerElement.itemName;
                                HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" />';
                                HTMLFrag+='<input type="text" data-type="updateItem" class="itemCode" placeholder="';
                                HTMLFrag += innerElement.itemCode;
                                HTMLFrag += '" />';
                                HTMLFrag += '<input type="text" data-type="updateItem" class="itemPrice" placeholder="';
                                HTMLFrag += innerElement.itemPrice;
                                HTMLFrag += '" />';
                                HTMLFrag +='</article>';
                            };
                        
                    });
                    app.DOM.items.innerHTML = HTMLFrag;
                //Event Listereners
                // Delete and sales
                var inputsLive = document.getElementsByTagName('input'),
                    selectsLive = document.getElementsByTagName('select'),
                    imgsLive = document.getElementsByTagName('img');

                for (var i = 0; i < selectsLive.length; i++) {
                    if (classie.hasClass(selectsLive[i], "itemCode")) {
                        selectsLive[i].onblur = function(e) { app.update.sale(e.target);};
                    };
                };
                for (var i = 0; i < inputsLive.length; i++) {
                    if(classie.hasClass(inputsLive[i], "weight")||classie.hasClass(inputsLive[i], "quantity")){
                        inputsLive[i].addEventListener("blur", function(e) { app.update.sale(e.target);}, false);
                    }else if (inputsLive[i].dataset.type == "updateItem") {
                        inputsLive[i].addEventListener("blur", function(e) { app.update.item(e.target);}, false);
                    };
                };
                for (var i = 0; i < imgsLive.length; i++) {
                    if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "item") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.item(e.target.dataset.index); }, false);
                    };
                };
                //end
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
                            HTMLFrag += '"/><img data-type="slaughter" src="img/delete.png" class="cancel" data-index="';
                            HTMLFrag += innerIndex;
                            HTMLFrag += '" /></article>';
                        });
                        app.DOM.slaughters.innerHTML = HTMLFrag;
                        //Event listeners
                        var imgsLive = document.getElementsByTagName('img');
                        for (var i = 0; i < imgsLive.length; i++) {
                            if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "slaughter") {
                                imgsLive[i].addEventListener("click", function(e) { app.delete.slaughter(e.target.dataset.index); }, false);
                            };
                        };
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

                    temp += '<td><select class="tableInput" >';
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
                var tableInputsLive = document.getElementsByTagName('SELECT');
                for (var i = 0; i < tableInputsLive.length; i++) {
                    if (classie.hasClass(tableInputsLive[i], "tableInput")) {
                        tableInputsLive[i].addEventListener("change", function(e) { app.purchaseTableAdd(e.target);}, false);
                    };
                };
            };
        },
        pickContact : function() {
            navigator.contacts.pickContact(function(contact){
                app.picked = true;
                if (contact.name.formatted != null) {
                            if (contact.name.givenName != null) {
                                document.getElementById('newSaleFirstName').value = contact.name.givenName;
                            }else{
                                document.getElementById('newSaleFirstName').value = contact.name.formatted;                                
                            };
                            if (contact.name.familyName != null) {
                                document.getElementById('newSaleLastName').value = contact.name.familyName;
                            };
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
                            
                        };
                    app.data.customers.forEach(function(element, index, array){
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
                    saleOldIdx = target.tagName == 'TEXTAREA'? target.parentNode.dataset.indexold:target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.indexold;
                //alert(saleIdx);
                //alert(saleOldIdx);
                    var saleOld = JSON.stringify(app.data.sales[saleIdx]),
                    sale = JSON.parse(saleOld);
                //alert(saleOld);
                    var tables = document.getElementById('sales').getElementsByTagName('TABLE');
                //alert(JSON.stringify(document.getElementById('sales').children));
                    var children = saleIdx==0 ? tables[saleIdx].children[1].children : tables[saleIdx].children[0].children,
                    HTMLFrag ='',
                    total = 0;
                //alert(tables);
                    var dom = {
                            item : children[idx].children[0].children[0],
                            quantity : children[idx].children[1].children[0],
                            totalWeight : children[idx].children[2].children[0]
                    };
                    var saleData = {
                        itemCode : dom.item.selectedOptions[0].value,
                        quantity : dom.quantity.value == '' ? parseFloat(dom.quantity.placeholder) : parseFloat(dom.quantity.value),
                        weights : sale.purchaseTable[idx].weights,
                        totalWeight : dom.totalWeight.value == '' ? parseFloat(dom.totalWeight.placeholder.slice(0, -2)):parseFloat(dom.totalWeight.value),
                        itemPrice : parseFloat(dom.item.selectedOptions[0].dataset.price)
                    };
                //alert('0');
                    app.data.sales[saleOldIdx].purchaseTable[idx] = JSON.stringify(saleData);
                    
                    app.data.sales[saleOldIdx].purchaseTable.forEach(function(innerElement, innerIndex, innerArray) {
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
                        HTMLFrag += 'R ' + Math.ceil10(innerElement.itemPrice, -1);
                        HTMLFrag += '</td><td class="priceTag">';
                        HTMLFrag += 'R ' + Math.ceil10(innerElement.totalWeight * innerElement.itemPrice, -1);
                        total    += Math.ceil10(innerElement.totalWeight * innerElement.itemPrice, -1);
                        HTMLFrag += '</td></tr>';
                    });
                    HTMLFrag += '<tr><td class="large" onclick="app.newRow(this)">+</td><td colspan="7"></td></tr>';
                    app.data.sales[saleOldIdx].total = Math.ceil10(total, -1);
                    //alert('1');
/*                    alert('notes: ');
                    alert(children[idx].parentNode.parentNode.parentNode.children[7].tagName);*/
                    app.data.sales[saleOldIdx].notes = children[idx].parentNode.parentNode.parentNode.children[7].value;
                    //alert('1a');
                    saleIdx==0 ? tables[saleIdx].children[1].innerHTML = HTMLFrag : tables[saleIdx].children[0].innerHTML = HTMLFrag;
                    //alert('1b');
                    saleIdx==0 ? tables[saleIdx].children[2].children[0].children[1].innerHTML = 'R' + Math.ceil10(total, -1) : tables[saleIdx].children[1].children[0].children[1].innerHTML = 'R' + Math.ceil10(total, -1);
                    //alert('1c');
                    app.data.slaughters.forEach(function(element, index, array) {
                        if (element.slaughterDate == sale.slaughterDate) {
                            app.data.slaughters[index].total -= Math.ceil10(sale.total, -1);
                            app.data.slaughters[index].total += Math.ceil10(total, -1);
                            app.binding.slaughters();
                            app.store('slaughter');
                        };
                    });
                    //alert('2');
                    app.store('sale'); 
                    //alert('fine');
                    var newRowsLive = document.getElementsByTagName('td'),
                        inputsLive = document.getElementsByTagName('input'),
                        notesLive = document.getElementsByTagName('textarea'),
                        selectsLive = document.getElementsByTagName('select');

                    for (var i = 0; i < selectsLive.length; i++) {
                        if (classie.hasClass(selectsLive[i], "itemCode")) {
                            selectsLive[i].onblur = function(e) { app.update.sale(e.target);};
                        };
                    };
                    for (var i = 0; i < newRowsLive.length; i++) {
                        if (classie.hasClass(newRowsLive[i], "large")) {
                            //newRowsLive[i].removeEventListener("click", function(e) { app.newRow(e.target);}, false);
                            newRowsLive[i].onclick = function(e) { app.newRow(e.target);};
                        };
                    };
                    for (var i = 0; i < inputsLive.length; i++) {

                        if (classie.hasClass(inputsLive[i], "cancel") && inputsLive[i].value == "sales") {
                            //inputsLive[i].addEventListener("click", function(e) { alert('delete');}, false);

                        }else if(classie.hasClass(inputsLive[i], "noteClear")){
                            //inputsLive[i].addEventListener("click", function(e) { e.target.previousSibling.value='';}, false);

                        }else if(classie.hasClass(inputsLive[i], "weight")||classie.hasClass(inputsLive[i], "quantity")){
                            inputsLive[i].onblur = function(e) { app.update.sale(e.target);};

                        };
                    };
                    for (var i = 0; i < notesLive.length; i++) {
                        if (classie.hasClass(notesLive[i], "notes")) {
                            notesLive[i].onblur =  function(e) { app.update.sale(e.target);};
                        };
                    };
                    //alert('eventlisteners attached');
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
                //newContact.save(function(data) {},function(err) {}); 
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
            sales : function(target) {
                var searchTerm = document.getElementById('salesSearchText').value.toLowerCase(),
                    date = document.getElementById('btn_filter_date').checked,
                    location = document.getElementById('btn_filter_location').checked,
                    name = document.getElementById('btn_filter_name').checked,
                    tempArr = [],
                    searchArr = undefined;
                    //alert(searchTerm);
                if (searchTerm != '') {
                    searchArr = searchTerm.split(' ');
                    app.data.sales.forEach(function(element, index, array) {
                        var tempElem = element,
                        resultsArr = [false, false, false];
                        tempElem.oldIndex = index;
                        for (var i = 0; i < searchArr.length; i++) {
                            if (name) {
                                if(element.name.formatted != undefined){
                                    if (element.name.formatted.toLowerCase().includes(searchArr[i]) ) {
                                        resultsArr[0] = true;
                                    };
                                } else if(element.name.givenName != undefined){
                                    if (element.name.givenName.toLowerCase().includes(searchArr[i])) {
                                        resultsArr[0] = true;
                                    };
                                };
                            };
                            if (location) {
                                if(element.location.toLowerCase().includes(searchArr[i])){
                                    resultsArr[1] = true;
                                };
                            };
                            if (date) {
                                if(element.slaughterDate.toLowerCase().includes(searchArr[i])){
                                    resultsArr[2] = true;
                                };
                            };
                            //alert(JSON.stringify(resultsArr));
                            if (name && location && date) {
                                if (resultsArr[0] && resultsArr[1] && resultsArr[2]) {
                                    if (tempArr.indexOf(tempElem) === -1) {
                                        tempArr.push(tempElem);
                                    };
                                };
                            } else if(name && location){
                                if (resultsArr[0] && resultsArr[1]) {
                                    if (tempArr.indexOf(tempElem) === -1) {
                                        tempArr.push(tempElem);
                                    };
                                };
                            } else if(name && date){
                                if (resultsArr[0] && resultsArr[2]) {
                                    if (tempArr.indexOf(tempElem) === -1) {
                                        tempArr.push(tempElem);
                                    };
                                };
                            }else if(location && date){
                                if (resultsArr[1] && resultsArr[2]) {
                                    if (tempArr.indexOf(tempElem) === -1) {
                                        tempArr.push(tempElem);
                                    };
                                };
                            }else if(name && !date && !location){
                                if (resultsArr[0]) {
                                    if (tempArr.indexOf(tempElem) === -1) {
                                        tempArr.push(tempElem);
                                    };
                                };
                            }else if(!name && date && !location){
                                if (resultsArr[2]) {
                                    if (tempArr.indexOf(tempElem) === -1) {
                                        tempArr.push(tempElem);
                                    };
                                };
                            }else if(!name && !date && location){
                                if (resultsArr[1]) {
                                    if (tempArr.indexOf(tempElem) === -1) {
                                        tempArr.push(tempElem);
                                    };
                                };
                            };

                        };
                    });
                }else{
                    tempArr = app.data.sales;
                };

                var HTMLFrag = '',
                    total = 0;

                    tempArr.forEach(function(innerElement, innerIndex, innerArray) {
                                HTMLFrag +='<fieldset data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '" data-indexOld="';
                                HTMLFrag += innerElement.oldIndex;
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
                                    HTMLFrag += 'R ' + Math.ceil10(iiiElement.itemPrice, -1);
                                    HTMLFrag += '</td><td class="priceTag">';
                                    HTMLFrag += 'R ' + Math.ceil10((iiiElement.totalWeight * iiiElement.itemPrice), -1);
                                    total    += Math.ceil10((iiiElement.totalWeight * iiiElement.itemPrice), -1);
                                    HTMLFrag += '</td></tr>';
                                });
                                HTMLFrag += '<tr><td class="large" onclick="app.newRow(this)">+</td><td colspan="7"></td></tr>';
                                HTMLFrag += '</tbody><tfoot><tr><td colspan="6">Total: </td><td colspan="2">';
                                HTMLFrag += 'R' + Math.ceil10(total, -1);
                                HTMLFrag += '</td></tr></tfoot></table>';
                                total = 0;
                                HTMLFrag += '<br /><span class="noteHeader" >Notes:</span><br class="clear" /><textarea class="notes" onblur="app.update.sale(this)" data-index="';
                                HTMLFrag += innerIndex;
                                HTMLFrag += '"  > '; 
                                HTMLFrag += innerElement.notes;
                                HTMLFrag += '</textarea>';
                                HTMLFrag += '<input type="button" value="clear" class="noteClear" onclick="this.previousSibling.value=\' \' " /> <br class="clear" /><img src="img/delete.png" class="cancel" data-type="sale" data-index="';
                                HTMLFrag += innerElement.oldIndex;
                                HTMLFrag += '"/></fieldset>';
                    });
                    app.DOM.sales.innerHTML = HTMLFrag;

                    var newRowsLive = document.getElementsByTagName('td'),
                    inputsLive = document.getElementsByTagName('input'),
                    notesLive = document.getElementsByTagName('textarea'),
                    selectsLive = document.getElementsByTagName('select'),
                    imgsLive = document.getElementsByTagName('img');

                for (var i = 0; i < selectsLive.length; i++) {
                    if (classie.hasClass(selectsLive[i], "itemCode")) {
                        selectsLive[i].onblur = function(e) { app.update.sale(e.target);};
                    };
                };
                for (var i = 0; i < newRowsLive.length; i++) {
                    if (classie.hasClass(newRowsLive[i], "large")) {
                        newRowsLive[i].onclick = function(e) { app.newRow(e.target);};
                    };
                };
                for (var i = 0; i < inputsLive.length; i++) {

                    if (classie.hasClass(inputsLive[i], "cancel") && inputsLive[i].value == "sales") {
                        inputsLive[i].addEventListener("click", function(e) {app.delete.sale(e.target.dataset.index);}, false);

                    }else if(classie.hasClass(inputsLive[i], "noteClear")){
                        inputsLive[i].addEventListener("click", function(e) { e.target.previousSibling.value=''; app.update.sale(e.target.previousSibling);}, false);

                    }else if(classie.hasClass(inputsLive[i], "weight")||classie.hasClass(inputsLive[i], "quantity")){
                        inputsLive[i].addEventListener("blur", function(e) { app.update.sale(e.target);}, false);

                    };
                };
                for (var i = 0; i < imgsLive.length; i++) {

                    if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "sale") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.sale(e.target.dataset.index); }, false);

                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "customer") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.customer(e.target.dataset.index); }, false);

                    } else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "item") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.item(e.target.dataset.index); }, false);

                    }else if (classie.hasClass(imgsLive[i], "cancel") && imgsLive[i].dataset.type == "slaughter") {
                        imgsLive[i].addEventListener("click", function(e) { app.delete.slaughter(e.target.dataset.index); }, false);

                    };
                };
                for (var i = 0; i < notesLive.length; i++) {
                    if (classie.hasClass(notesLive[i], "notes")) {
                        notesLive[i].onblur =  function(e) { app.update.sale(e.target);};
                    };
                };



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
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
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
                                    HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
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
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
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
                                    HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
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
/*                                        element.phoneNumbers.forEach(function(innerElement, innerIndex, innerArray) {
                                            HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                            HTMLFrag += innerElement.value;
                                            HTMLFrag += '" data-index="';
                                            HTMLFrag += innerIndex;
                                            HTMLFrag += '"/>';
                                        });*/
                                        HTMLFrag += '<input type="text" data-type="updateCustomer" placeholder="';
                                        HTMLFrag += element.phoneNumbers[0].value;
                                        HTMLFrag += '" data-index="';
                                        HTMLFrag += 0;
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
                                    HTMLFrag += '<img data-type="customer" src="img/delete.png" class="cancel" data-index="';
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
                                    HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
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
                                    HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
                                    HTMLFrag += index;
                                    HTMLFrag += '" /><input type="text" class="itemCode" placeholder="';
                                    HTMLFrag += element.itemCode;
                                    HTMLFrag += '" /><input type="text" class="itemPrice" placeholder="';
                                    HTMLFrag += element.itemPrice;
                                    HTMLFrag += '" /></article>';
                                }else if(newChar == compareChar){
                                    HTMLFrag += '<article><input type="button" class="itemName" value="';
                                    HTMLFrag += element.itemName;
                                    HTMLFrag += '" /><img data-type="item" src="img/delete.png" class="cancel" data-index="';
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
                            //alert(JSON.stringify(element));
                            //alert(app.data.customers);
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
                                        //newCustomer.synced = true;
                                        //bug if (indexOf) {};
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
            },
            backUp : function() {
                //app.data
                var message = {
                    type:'back up',
                    data:app.data,
                    token:localStorage['token']
                };
                app.DOM.serverHandle.contentWindow.postMessage(JSON.stringify(message),'http://gaz-huntingapp.rhcloud.com');
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

    //auth
    if (localStorage['token'] != undefined) {
        var token = localStorage['token'];
        var intervalHandle = window.setInterval(function(){
            var message = {
                type:'token',
                token:token
            };
            app.DOM.serverHandle.contentWindow.postMessage(JSON.stringify(message),'http://gaz-huntingapp.rhcloud.com');
        },500);
    }else{
        classie.addClass(app.DOM.modal, 'md-show');
    };
    window.addEventListener('message',function(event) {
        if(event.origin === 'http://gaz-huntingapp.rhcloud.com') {
            var message = JSON.parse(event.data);
            if (message.type === 'token') {
                //alert('token recieved client');
                localStorage['token'] = message.token;
            }else if(message.type === "login"){
                app.login();
            }else if(message.type === "reauth"){
                //alert('reauth');
                app.failSafe();
                //app.logout();
            }else if(message.type === "token recieved"){
                window.clearInterval(intervalHandle);
            }else if (message.type === 'back up') {
                alert('Back up success!');
            };
        };
    },false);
};
document.addEventListener("deviceready", onDeviceReady, false);