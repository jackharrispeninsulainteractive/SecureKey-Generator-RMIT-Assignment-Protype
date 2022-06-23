class Application {

    static instance = new Application();
    users
    user
    domain = "http://localhost";
    domainLocation = "/A1_Q1/";
    loadingScreen;
    one_time_pad = null;
    security_key = null;

    constructor() {
        fetch(this.domain + this.domainLocation + "oracle_members.json").then(response => response.json()).then(data => {this.users = data.users; this.renderOracleMembers()});
        fetch(this.domain + this.domainLocation + "you.json").then(response => response.json()).then(data => {this.user = data.you; this.renderUser()})

        this.loadingScreen = document.getElementById("requesting_access_permission");
    }

    generateKey(step){
        if(step === 1){
            this.loadingScreen.style.display = "block";
            let users = Array.from(document.getElementById("member_approval").children);

            setTimeout(function(){ Application.instance.generateKey(2) }, 1500*(users.length+1));

            users.forEach(function (user, index) {
                let image= Array.from(user.children)[0];
                setTimeout(function(){ image.src=Application.instance.domain+Application.instance.domainLocation+"/images/permission_given.png"; }, 1200*(index+1));
            })


        }

        if(step === 2){
            let inner = document.getElementById("inner");
            inner.innerHTML = "";
            let heading = document.createElement("h2");
            heading.innerText = "Approval granted, generating one time pad"
            inner.appendChild(heading);
            let text = document.createElement("p");
            text.innerText = "Please wait whilst the system generates you a one time pad"
            inner.appendChild(text);
            let loadingImage = document.createElement("img");
            loadingImage.style.height = "128px";
            loadingImage.style.display = "block";
            loadingImage.style.marginLeft = "auto";
            loadingImage.style.marginRight = "auto";
            loadingImage.src = Application.instance.domain+Application.instance.domainLocation+"/images/loading.gif"
            inner.appendChild(loadingImage);

            setTimeout(function(){ Application.instance.generateKey(3) }, 1300);
        }

        if(step === 3){

            let file_number = document.getElementById("requester_file_number").valueOf().value;

            let inner = document.getElementById("inner");
            inner.innerHTML = "";

            let heading = document.createElement("h2");
            heading.innerText = "Success, one time pad generated"
            inner.appendChild(heading);

            let text = document.createElement("p");
            text.innerText = "Select next to continue to security key generation";
            inner.appendChild(text);

            let key = document.createElement("input");
            key.value = "loading";
            key.className = "final_key";
            key.disabled = true;
            key.id= "one_time_pad";
            key.style.width = "calc(100% - 32px)";
            key.style.margin = "16px";
            key.style.padding = "8px";
            inner.appendChild(key);


            this.postFormData(this.domain+this.domainLocation+"keyGenerationModule.php",
                "action=generate_pad"+
                    "&file_number="+file_number+
                    "&employee_id="+this.user.id
            ).then(outcome => {
                let response = JSON.parse(outcome);
                document.getElementById("one_time_pad").valueOf().value = response.pad;
                this.one_time_pad = response.pad;
            })

            let button = document.createElement("button");
            button.innerText = "Generate Security Access Key Using Pad";
            button.onclick = f => {
                Application.instance.generateKey(4);
            }
            inner.appendChild(button);
        }

        if(step === 4){
            let inner = document.getElementById("inner");
            inner.innerHTML = "";

            let heading = document.createElement("h2");
            heading.innerText = "Generating Security Access Key"
            inner.appendChild(heading);

            let text = document.createElement("p");
            text.innerText = "Please wait whilst the security access key is generated for you";
            inner.appendChild(text);

            let loadingImage = document.createElement("img");
            loadingImage.style.height = "128px";
            loadingImage.style.display = "block";
            loadingImage.style.marginLeft = "auto";
            loadingImage.style.marginRight = "auto";
            loadingImage.src = Application.instance.domain+Application.instance.domainLocation+"/images/loading.gif"
            inner.appendChild(loadingImage);

            setTimeout(function(){ Application.instance.generateKey(5) }, 1000);

        }

        if(step === 5){

            let file_number = document.getElementById("requester_file_number").valueOf().value;


            let inner = document.getElementById("inner");
            inner.innerHTML = "";

            let heading = document.createElement("h2");
            heading.innerText = "Success! Security Access Key Created"
            inner.appendChild(heading);

            let text = document.createElement("p");
            text.innerText = "Please enter the security access key to open the file,";
            inner.appendChild(text);
            let text2 = document.createElement("p");
            text2.innerText = "or into the reverser to get the one time pad";
            inner.appendChild(text2)

            let security_key = document.createElement("input");
            security_key.disabled = true;
            security_key.style.width = "calc(100% - 32px)";
            security_key.style.margin = "16px";
            security_key.style.padding = "8px";
            security_key.id = "security_key";
            inner.appendChild(security_key);

            this.postFormData(this.domain+this.domainLocation+"keyGenerationModule.php",
                "action=generate_security_key"+
                "&file_number="+file_number+
                "&employee_id="+this.user.id+
                "&one_time_pad="+this.one_time_pad
            ).then(outcome => {
                let response = JSON.parse(outcome);
                document.getElementById("security_key").valueOf().value = response.security_key;
                this.security_key = response.security_key;
                document.getElementById("reversed_security_key_input").valueOf().value = response.security_key;
                document.getElementById("reverse-security-key-title").innerText = "Security Key (PreFilled from last generation)";
            })

            let button = document.createElement("button");
            button.innerText = "Close";
            button.onclick = f => {
                this.loadingScreen.style.display = "none";

            }
            inner.appendChild(button);
        }

    }

    reverseSecurityKey(){
        let file_number = document.getElementById("requester_file_number").valueOf().value;
        let securityKey = document.getElementById("reversed_security_key_input").valueOf().value;
        let output = document.getElementById("reversed_one_time_pad");

        this.postFormData(this.domain+this.domainLocation+"keyGenerationModule.php",
            "action=reverse_security_key"+
            "&file_number="+file_number+
            "&employee_id="+this.user.id+
            "&security_key="+securityKey
        ).then(outcome => {
            let response = JSON.parse(outcome);
            console.log(response);
            output.valueOf().value = response.one_time_pad;
        })
    }



    renderUser(){
        //get our target wrapper div
        let you = document.getElementById("you");

        //create our blank user elements
        let name =  document.createElement("p");
        let role = document.createElement("p");
        let image = document.createElement("img");
        let id = document.createElement("p");

        //insert our data into the elements
        name.innerText = this.user.name;
        name.className = "user-name";
        role.innerText = this.user.role;
        role.style.textAlign ="center";
        role.style.fontSize = "0.75rem";
        image.src = Application.instance.domain+Application.instance.domainLocation+this.user.image;
        id.innerText= "employee id : "+this.user.id;
        id.style.fontSize = "0.75rem";
        id.style.textAlign = "center";


        //append our new elements to the wrapper
        you.appendChild(image);
        you.appendChild(name);
        you.appendChild(role);
        you.appendChild(id);

        //prefill the from with the users data
        document.getElementById("requester-id").valueOf().value = this.user.id;
    }

    renderOracleMembers(){
        let oracleMembers = document.getElementById("oracle_members");
        let loadingApprovalElement = document.getElementById("member_approval");

        this.users.forEach(function (user) {
            //create our wrapper div
            let element = document.createElement("div");

            //create our blank user elements
            let image = document.createElement("img");
            let name = document.createElement("p");
            let role =  document.createElement("p");

            //set the content of our elements
            image.src = Application.instance.domain+Application.instance.domainLocation+user.image;
            name.innerText = user.name;
            name.className = "user-name";
            role.innerText = user.role;
            role.style.textAlign ="center";
            role.style.fontSize = "0.75rem";


            //append our elements to the div
            element.appendChild(image);
            element.appendChild(name);
            element.appendChild(role);

            //finally append the div to the fileManagers wrapper div
            oracleMembers.appendChild(element);

            //next we render the users into the loading page
            let loadingElement = document.createElement("div");
            let loadingGif = document.createElement("img");
            let loadingElementName = document.createElement("p");

            //Loading bar credit Ahm masum
            //https://commons.wikimedia.org/wiki/File:Loading_icon.gif
            loadingGif.src= Application.instance.domain+Application.instance.domainLocation+"images/loading.gif";

            loadingElementName.innerText = user.name;

            loadingElement.appendChild(loadingGif);
            loadingElement.appendChild(loadingElementName);

            loadingApprovalElement.appendChild(loadingElement);



        })

    }

    postFormData(uri, data){
        return fetch(uri,{
            method: 'post',
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            return await response.text();
        })
    }


}