
async function initIdentity(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo() {
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;

    let responseJson = await fetchJSON(`/users/new`, {
        method: "POST",
        body: {
            email: email,
            first_name: fname,
            last_name: lname,
            phone_number: phone
        }
    });
}

async function loadUserInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if (username == myIdentity) {
        document.getElementById("username-span").innerText= `You (${username})`;
        
    } else {
        document.getElementById("username-span").innerText=username;
    }
    
    let userData = await fetchJSON(`/users?user=${encodeURIComponent(username)}`);
    try {
        let name = userData.userInfo.first_name + " " + userData.userInfo.last_name;
        let email = userData.userInfo.email;
        let phone = userData.userInfo.phone_number;

        document.getElementById("user_info_div").innerHTML = 
        `
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Phone Number:</strong> ${phone}<br>
        `;
        document.getElementById("user_info_div").classList.remove("d-none");
    } catch (err) {
        document.getElementById("user_info_div").innerHTML = "Failed to load user data: " + err;
        document.getElementById("user_info_div").classList.remove("d-none");
    }

    let responseJson = await fetchJSON(`/itineraries/p?username=${encodeURIComponent(username)}`);
    let itineraries = responseJson.itineraries;
    let itinerariesHtml = itineraries.map((itinerary) => {
        return getItineraryHtml(itinerary, save_itinerary=false, delete_itinerary=true); 
    }).join("\n");
    document.getElementById("display").innerHTML = itinerariesHtml;
}

async function deleteItinerary(itinerary_id){
    let responseJson = await fetchJSON(`/itineraries`, {
        method: "DELETE",
        body: {itinerary_id: itinerary_id}
    })
    loadUserInfo();
}

function getItineraryHtml(itinerary, save_itinerary=true) {
    Event_0 = itinerary.Event_0;
    Event_1 = itinerary.Event_1;
    Event_2 = itinerary.Event_2;
    let button = "";
    if (save_itinerary) {
        button = `<p>No Itinerary found with current preferences, try again with different preferences!</p>`;
    } else {
        button = `<span id="delete_button"><button class="btn btn-danger" onclick="deleteItinerary('${itinerary._id}')">Save Itinerary</button></span>`
    }
    let event0Html = {
        img: "",
        info: ""
    };
    let event1Html = {
        img: "",
        info: ""
    };
    let event2Html = {
        img: "",
        info: ""
    };
    if (Event_0) {
        button = (save_itinerary && itinerary.username != "") ? `<span id="save_button"><button class="btn btn-primary" onclick="createItinerary()">Save Itinerary</button></span>` : "";
        event0Html.img = `<img src="${Event_0.business_img_url}" alt="${Event_0.name + ' business image'}" style="width: 250px; height: 250px; margin-bottom: 40px;  padding: 10px; flex-direction: row;">`;
        event0Html.info = `<div class="" style="font-weight: bold; margin-top: 8px;">${Event_0.name}</div>
        <div class="sc-jSMfEi iElCfA">${Event_0.address + ', ' + Event_0.city + ' ' + Event_0.zip}</div><br>
        <div class="sc-jSMfEi iElCfA">${"<em>categories:</em> " + Event_0.categories}</div><br>
        <div class="sc-jSMfEi iElCfA">${Event_0.hours_of_operation}</div>
        <div class="sc-jSMfEi iElCfA"><a href="tel:${Event_0.phone}">${Event_0.phone}</a></div>
        `;
    }
    if (Event_1) {
        event1Html.img = `<img src="${Event_1.business_img_url}" alt="${Event_1.name + ' business image'}" style="width: 250px; height: 250px; margin-bottom: 40px; padding: 10px;">`;
        event1Html.info = `<div class="sc-jSMfEi iElCfA" style="font-weight: bold; margin-top: 8px;">${Event_1.name}</div>
        <div class="sc-jSMfEi iElCfA">${Event_1.address + ', ' + Event_1.city + ' ' + Event_1.zip}</div><br>
        <div class="sc-jSMfEi iElCfA">${"<em>categories:</em> " + Event_1.categories}</div><br>
        <div class="sc-jSMfEi iElCfA">${Event_1.hours_of_operation}</div>
        <div class="sc-jSMfEi iElCfA"><a href="tel:${Event_1.phone}">${Event_1.phone}</a></div>
        `;
    }
    if (Event_2) {
        event2Html.img = `<img src="${Event_2.business_img_url}" alt="${Event_2.name + ' business image'}" style="width: 250px; height: 250px; margin-bottom: 40px; padding: 10px;">`;
        event2Html.info = `<div class="sc-jSMfEi iElCfA" style="font-weight: bold; margin-top: 8px;">${Event_2.name}</div>
        <div class="sc-jSMfEi iElCfA">${Event_2.address + ', ' + Event_2.city + ' ' + Event_2.zip}</div><br>
        <div class="sc-jSMfEi iElCfA">${"<em>categories:</em> " + Event_2.categories}</div><br>
        <div class="sc-jSMfEi iElCfA">${Event_2.hours_of_operation}</div>
        <div class="sc-jSMfEi iElCfA"><a href="tel:${Event_2.phone}">${Event_2.phone}</a></div>
        `;
    }
    let displayHtml = `
                ${button}
                <div style="margin-left: 10px; padding: 10px">
                    <div style="display: flex; flex-direction: row; margin-left: 24px;">
                    <div style="flex-direction: row; padding: 20px">
                        ${event0Html.info}${event0Html.img}
                    </div>
                    <div style="flex-direction: row; padding: 20px">
                        ${event1Html.info}${event1Html.img}
                    </div>
                    <div style="flex-direction: row; padding: 20px">
                        ${event2Html.info}${event2Html.img}
                    </div>
                </div>
    `
    return displayHtml;
}