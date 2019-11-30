window.addEventListener('load', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBd4ZNQRImSA-DLkRuQUShh8jqH-L9DVJM",
        authDomain: "jonas-dorfinger.firebaseapp.com",
        databaseURL: "https://jonas-dorfinger.firebaseio.com",
        projectId: "jonas-dorfinger",
        storageBucket: "jonas-dorfinger.appspot.com",
        messagingSenderId: "47344971189",
        appId: "1:47344971189:web:7dd58623493ae508"
    };
    
    firebase.initializeApp(firebaseConfig);

    const btn = document.getElementById('btn');

    handleRadio();
    printEngagements();

    btn.addEventListener('click', () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(() => {
            
        });
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('signedInAs').textContent = `signed in as ${firebase.auth().currentUser.email}`;
        } else {
            document.getElementById('signedInAs').textContent = 'not logged in';
        }
    });
    
    document.getElementById('check').addEventListener('click', () => {
        const timestamp = new Date().getTime();
        const name = document.getElementById('name');
        const description = document.getElementById('description');
        const priority = document.getElementById('priority');

        if (getSelectedRadioValue() === 'IT - Project') {
            firebase.database().ref('/public/work/' + timestamp).set({
                name: name.value,
                description: description.value,
                type: getSelectedRadioValue(),
                platform: getSelectedPlatforms(),
                timestamp: timestamp,
                priority: priority.value
            });
        } else {
            firebase.database().ref('/public/work/' + timestamp).set({
                name: name.value,
                description: description.value,
                type: getSelectedRadioValue(),
                timestamp: timestamp,
                priority: priority.value
            });
        }

        const wrapper = document.getElementById('removeWorksWrapper');
        while (wrapper.childNodes.length > 3) wrapper.removeChild(wrapper.lastChild);

        printEngagements();
        clearInputs();
    });

    function handleRadio() {
        const itproject = document.getElementById('itproject');
        const otherproject = document.getElementById('otherproject');
        const otherText = document.getElementById('other');

        const inputs = [
            document.getElementById('itproject'),
            document.getElementById('creativeproject'),
            document.getElementById('otherproject')
        ];

        for (const input of inputs) {
            input.addEventListener('change', () => {
                if (otherproject.checked) {
                    otherText.disabled = false;
                } else {
                    otherText.disabled = true;
                }

                if (itproject.checked) {
                    document.getElementById('platform').classList.remove('hide');
                } else {
                    document.getElementById('platform').classList.add('hide');
                }
            });
        }
    }
});

function getSelectedPlatforms() {
    const checkboxes = [
        document.getElementById('windows'),
        document.getElementById('android'),
        document.getElementById('ios'),
        document.getElementById('web')
    ];
    const returnArray = [];

    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            returnArray.push(checkbox.value);
        }
    }

    return returnArray;
}

function getSelectedRadioValue() {
    const inputs = [
        document.getElementById('itproject'),
        document.getElementById('creativeproject'),
        document.getElementById('otherproject')
    ];

    for (const input of inputs) {
        if (input.checked) {
            if (input.value === 'other') {
                return document.getElementById('other').value;
            } else {
                return input.value;
            }
        }
    }
}

function printEngagements() {
    firebase.database().ref('/public/work/').once('value').then((snapshot) => {
        const works = [];
        const contentWrapper = document.getElementById('removeWorksWrapper');

        for (const index in snapshot.val()) {
            works.push(snapshot.val()[index]);
        }

        for (const work of works) {
            const newWork = document.createElement('div');

            const iconWrapper = document.createElement('div');
            const icon = document.createElement('i');
            icon.setAttribute('class', 'fas fa-trash-alt icon');

            iconWrapper.classList.add('iconWrapper');

            icon.addEventListener('click', () => {
                contentWrapper.removeChild(newWork);

                firebase.database().ref('/public/work/' + work.timestamp).remove();
            });

            iconWrapper.appendChild(icon);
            newWork.appendChild(iconWrapper);

            const name = document.createElement('h2');
            const description = document.createElement('p');
            const type = document.createElement('p');
            let platforms = work.platform;

            name.textContent = work.name;
            description.textContent = work.description;
            type.textContent = type.textContent;

            newWork.appendChild(name);
            newWork.appendChild(description);
            newWork.appendChild(type);

            if (platforms !== undefined) {
                const platformWrapper = document.createElement('div');

                for (const platform of platforms) {
                    const text = document.createElement('p');
                    text.textContent = platform;
                    platformWrapper.appendChild(text);
                }

                newWork.appendChild(platformWrapper);
            }

            const priority = document.createElement('p');
            priority.textContent = `Priotity: ${work.priority}`;

            newWork.appendChild(priority);

            newWork.classList.add('work');

            contentWrapper.appendChild(newWork);
        }
        
    });
}

function clearInputs() {
    const inputs = [
        document.getElementById('name'),
        document.getElementById('description'),
        document.getElementById('other'),
        document.getElementById('priority')
    ];

    const boxes = [
        document.getElementById('itproject'),
        document.getElementById('creativeproject'),
        document.getElementById('otherproject'),
        document.getElementById('windows'),
        document.getElementById('android'),
        document.getElementById('ios'),
        document.getElementById('web')
    ];

    for (const input of inputs) {
        input.value = '';
    }
    
    for (const box of boxes) {
        console.log(box);
        
        box.checked = false;
    }

    boxes[0].checked = true;
}