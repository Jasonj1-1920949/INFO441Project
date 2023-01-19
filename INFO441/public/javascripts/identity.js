let myIdentity = undefined;

async function loadIdentity(){
    let identity_div = document.getElementById("identity_div");

    try{
        let identityInfo = await fetchJSON(`/users/myprofile`)
        
        if (identityInfo.status == "loggedin"){
            myIdentity = identityInfo.userInfo.email;
            identity_div.innerHTML = `
            <a href="/profile.html?user=${encodeURIComponent(myIdentity)}" class="btn btn-primary" role="button">My Profile</a>
            <a href="signout" class="btn btn-danger" role="button">Log out</a>`;
            if(document.getElementById("make_post_div")){
                document.getElementById("make_post_div").classList.remove("d-none");
            }
            Array.from(document.getElementsByClassName("new-comment-box")).forEach(e => e.classList.remove("d-none"))
            Array.from(document.getElementsByClassName("heart-button-span")).forEach(e => e.classList.remove("d-none"));
        } else { //logged out
            myIdentity = undefined;
            identity_div.innerHTML = `
            <a href="signin" class="btn btn-primary" role="button">Log in</a>
            <a href="newaccount" class="btn btn-secondary" role="button">Create Account</a>`;
        }
    } catch(error){
        myIdentity = undefined;
        identity_div.innerHTML = `<div>
        <button onclick="loadIdentity()">retry</button>
        Error loading identity: <span id="identity_error_span"></span>
        </div>`;
        document.getElementById("identity_error_span").innerText = error;
    }
}
