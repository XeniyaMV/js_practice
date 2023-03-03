


const main = document.querySelector('#calendar');
const form = document.querySelector('form[name="calendar"]');



form.addEventListener('submit', handleFormSubmit);

function generateTableHead(table) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    
    let weekdays = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];


    for (let weekday of weekdays) {
        let th = document.createElement('th');
        th.append(weekday);
        row.append(th);
    }

}

function generateTableBody(table, year, month) {
    
    let firstDate = new Date(year, month, 1);
    let lastDate = new Date(year, month+1, 0);
    let firstDay = (firstDate.getDay() == 0) ? 7: firstDate.getDay();
    
    let tbody = table.createTBody();
    let row = null;
    let td = null;
    
    let cellNumber = 0;
    let rowNumber = 0;
    
    lastDate = lastDate.getDate(); 
    
    for (let day = firstDate.getDate(); day <= lastDate; day += 1) {
        if (cellNumber == 0) {
            row = tbody.insertRow()
            if (rowNumber == 0) {
                if (firstDay > 1) {
                    for (let i = 1; i < firstDay; i++) {
                        td = document.createElement('td');
                        td.textContent = '';
                        row.append(td);
                    }   
                    cellNumber = firstDay - 1;
                }
            }
        }
        
        td = document.createElement('td');
        td.textContent = day;
        row.append(td);

        if (cellNumber == 6) {
            cellNumber = -1;
            rowNumber +=1;
        }

        cellNumber += 1;
    }



}

async function postFormDataAsJson({url, formData}) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    const fetchOptions = {
        /* 
            The default method for a request with fetch is GET, 
            so we must to tell it to use th POST HTTP method.
        */
        method: "POST",
        /*
            These headers will be added to the request and tell
            the API that the request body is JSON and that we 
            can accept JSON responses. 
        */
       headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Accept": "application/json"
       },
       /*
            The body of our POST request is the JSON string
            that we create above 
       */
       body: formDataJsonString,
    };
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}





async function handleFormSubmit(event) {
    /* 
        This method of the Event interface tells the user agent that if the
        event does not get explicitly handled, its default action should not
        be taken as it normally would be.

        * This prevents the default behaviour of the browser submitting
    	* the form so that we can handle things instead.

    */
    event.preventDefault();

    // This gets the element which the event handler was attached to.
    const form = event.currentTarget;
    
    // This takes the API URL from the form's `action` attribute.
    // ! const url = form.action; - we need to use this address, 
    // ! but something wrong with server and it doesn't allow to make a POST request, so we use the link bellow 
    const url = form.action;
    // const url = 'https://httpbin.org/post';
    try {
        /* This class takes all the fields in the form and
        makes their available through a FormData instance. */
        
        const formData = new FormData(form);
        const responseData = await postFormDataAsJson({url, formData});
        
        let oldTable = document.querySelector('#view_calendar_container');
        if (oldTable) {
            oldTable.remove();
        }


        let div = document.createElement('div');
        let table = document.createElement('table');
        div.id = "view_calendar_container";
        table.id = "view_calendar";
        generateTableHead(table);
        generateTableBody(table, responseData.json.year, responseData.json.month - 1);
        div.append(table);
        form.after(div);


    } catch (error) {
        console.error(error);
    }



}
