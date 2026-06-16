document.getElementById("leadForm").addEventListener("submit", function(e){

    e.preventDefault();

    let valid = true;

    document.getElementById("nameError").innerHTML = "";
    document.getElementById("phoneError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";

    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();

    if(name === ""){
        document.getElementById("nameError").innerHTML =
        "Please enter your name";
        valid = false;
    }

    let phoneRegex = /^[0-9]{10}$/;

    if(!phoneRegex.test(phone)){
        document.getElementById("phoneError").innerHTML =
        "Phone number must be exactly 10 digits";
        valid = false;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        document.getElementById("emailError").innerHTML =
        "Please enter a valid email address";
        valid = false;
    }

    if(valid){
        alert("Form submitted successfully!");
        document.getElementById("leadForm").reset();
    }

});