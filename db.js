db.collection('events').onSnapshot(snapshot => {
    // Handle the latest event
    const newestEvent = snapshot.docChanges()[0].doc.data()
    const id = snapshot.docChanges()[0].doc.id
    showLatestEvent(newestEvent, id);

    // delete the latest event element
    snapshot.docChanges().shift();

    snapshot.docChanges().forEach(event => {
        showEvents(event.doc.data(), event.doc.id)
    });
})

const addNewEvent = () => {
    const event = {
        name: form.name.value,
        attendee: form.attendee.value,
        booked: 0,
        description: form.description.value,
        status: parseInt(form.status.value, 10)
    }

    db.collection('events').add(event).then(() => {
        // Reset the form values
        form.name.value = "",
        form.attendee.value = "",
        form.description.value = "",
        form.status.value = ""

        alert('Your event has been succesfully saved');
    })
    .catch(err => console.log(err));
}

let bookedEvents = [];

const bookEvent = (booked, id) => {
    const getBookedEvents = localStorage.getItem('booked-events');

    if(getBookedEvents) { // if there are booked events go into if condition
        bookedEvents = JSON.parse(localStorage.getItem('booked-events')); // get the item from localstorage
            if(bookedEvents.includes(id)) { // if the collected item id is the same as the event wanted to be booked alert already booked
                alert('Seem like you have already booked this event');
            } else {
                saveBooking(booked, id) // else, save the event
            }
        } else {
            saveBooking(booked, id) // if there are no booked events, book the event
        }
};

const saveBooking = (booked, id) => { // to save the boked events
    bookedEvents.push(id);
    localStorage.setItem('booked-events' , JSON.stringify(bookedEvents));

    const data = { booked: booked + 1}

    db.collection('events').doc(id).update(data)
    .then(() => alert('Event successfully booked'))
    .catch(err => console.log(err));
}

