Array.prototype.unique = function () {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

// Function to show suggestions.
// param suggestions array.
function showSuggestions(suggestions) {
    let suggestions_div = $('.suggestions');
    let suggestions_links = $('.suggestions a');
    let linksArray = [];

    $.each(suggestions_links, function(index, value) {
        linksArray.push(value.firstChild.data);
    });

    if (suggestions.length == 0) {
        suggestions_div.html('');
    }

    suggestions.forEach(suggestion => {
        let suggestion_to_append = `<a href="#" class="mr-2">${suggestion}</a>`;
        if (linksArray[linksArray.length - 1] === suggestion) {
            suggestions_div.html(suggestion_to_append);
        } else {
            suggestions_div.append(suggestion_to_append);
        }
    });
}

// Function to replace suggestions textarea with suggestion texts.
function replaceText(text) {
    let value = $('#autosuggest').val(); // Value from textarea.
    value = value.split(" ");
    let lastValue = value.splice(-1)[0];

    // console.log(value, value.join(" "), lastValue);
    if (text.match("^" + lastValue)) {
        removeA(lastValue);
        $('#autosuggest').val(value.join(" ") + " " + text);
        $('#autosuggest').focus();
    }
}

// Function to remove item from array by value.
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

$('#add-text').on('click', function(event) {
    event.preventDefault();
    let text = $('#text').val();

    let textArray = JSON.parse(localStorage.getItem('texts'));

    if (textArray === null || textArray === undefined || textArray.length == 0) {
        textArray = [];
    }
    
    textArray.push(text);
    localStorage.setItem('texts', JSON.stringify(textArray));
});

$('#clear-storage').on('click', function(event) {
    event.preventDefault();
    localStorage.clear();
});

console.log(JSON.parse(localStorage.getItem('texts')));

$('#autosuggest').keydown(function(event) {
    let textArray = JSON.parse(localStorage.getItem('texts')); // Get texts to suggest from localStorage.
    let value = $(this).val(); // Value from textarea.
    value = value.split(" ");
    value = value.splice(-1)[0];

    let suggestions = []; // Define suggestions array to hold suggestions - matched texts.

    // If the textarea is not empty, loop through the localStorage texts
    // and see if the value in the textarea matches the in the localStorage.
    if (value.length != 0) {
        textArray.map(text => {
            if (text.match("^" + value)) {
                suggestions.push(text);
            }
        });
    }

    // Show suggestions.
    showSuggestions(suggestions.unique());

    if (event.which == 9) {
        event.preventDefault();
    }

    if (event.which == 9 && suggestions.length != 0) {
        text = suggestions.unique()[0];
        replaceText(text);
    }
});

// When suggestions are clicked, replace text.
$(document).on('click', '.suggestions a', function(event) {
    text = $(this).text();
    replaceText(text);
});