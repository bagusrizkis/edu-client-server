/**
 *  - Dom Manipulation (hide/show, empty, append)
 *  - Event Handling(form, button, dll)
 *  - Ajax (get, post, put, patch, delete)
 *      C R U D
 */

$(document).ready(function () {
    checkLogin();
    // console.log("Document Ready");
    // DOM Manipulation

    $("#login-form").on("submit", handleLogin);
    $("#nav-logout").on("click", handleLogout);
});

function checkLogin() {
    if (localStorage.getItem("access_token")) {
        $("#form-login").hide();
        $("#home-page").show();
        fetchMovies();
    } else {
        $("#form-login").show();
        $("#home-page").hide();
    }
}

function handleLogout() {
    localStorage.removeItem("access_token");
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log("User signed out.");
    });
    checkLogin();
}

// Step-step
// dapetin selector nya seperti apa
// id login-form
// rencanakan event
// submit
// logic
// kirim ke server untuk login
// dapetin access_token

function handleLogin(event) {
    event.preventDefault();
    const email = $("#login-email").val();
    const password = $("#login-password").val();
    $.ajax({
        url: "http://localhost:3000/users/login",
        type: "POST",
        data: {
            email: email,
            password: password,
        },
    })
        .done((data) => {
            localStorage.setItem("access_token", data.access_token);

            checkLogin();
        })
        .fail((error) => {
            console.log(error);
        })
        .always(() => {
            console.log("selesai nih loginnya");
        });
}

function fetchMovies() {
    // request data ke server
    // masukin ke moviecard-container
    $.ajax({
        url: "http://localhost:3000/movies",
        type: "GET",
        headers: {
            access_token: localStorage.getItem("access_token"),
        },
    })
        .done(({ data }) => {
            $("#moviecard-container").empty();
            for (let i = 0; i < data.length; i++) {
                $("#moviecard-container").append(`
                <div class="col-3">
                <div class="card">
                    <img src="${data[i].image}" class="card-img-top"
                    alt="" />
                    <div class="card-body">
                    <h5 class="card-title">
                        ${data[i].name}
                    </h5>
                    </div>
                </div>
                </div>
                `);
            }
        })
        .fail((error) => {
            console.log(error);
        })
        .always(() => {
            console.log("INi dijalanin");
        });
}

function onSignIn(googleUser) {
    // ! GAK AMAN - GAK BOLEH
    // var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log("Name: " + profile.getName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("id_token", id_token);
    $.ajax({
        url: "http://localhost:3000/users/google-login",
        type: "POST",
        data: {
            token_google: id_token,
        },
    })
        .done((data) => {
            localStorage.setItem("access_token", data.access_token);
        })
        .fail((err) => {
            console.log(err);
        })
        .always(() => {
            checkLogin();
        });
}
