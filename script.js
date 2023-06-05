const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate Input
  if (newItem === '') {
    alert('Please add an Item');
    return;
  }
  //Create item DOM element
  addItemToDOM(newItem);
  //Add item to local storage
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
};

const addItemToDOM = (item) => {
  //Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  //Add li to DOM
  itemList.appendChild(li);
};

const addItemToStorage = (item) => {
  let itemsFromStorage;
  //if theres nothing in local storage so we set items from storage to an empty array
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    //if items are in storage we parse them
    //converting them from a string to an array and putting those items into the itemsFromStorage variable
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  //adding new item to array
  itemsFromStorage.push(item);

  //convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

const removeItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      //icon > button > li = remove
      e.target.parentElement.parentElement.remove();
      checkUI();
    }
  }
};

const clearItems = (e) => {
  //While ul has a first child which is an li
  while (itemList.firstChild) {
    //removing itemList first child which is the li
    //then pass in the first child (ul.li) whole
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
};
const filterItems = (e) => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    //item.firstChild() is the actual text
    //Using .textContent removes the quotes and space
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

const checkUI = () => {
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
};

//Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);

checkUI();
