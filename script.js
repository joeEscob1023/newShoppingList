const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

const displayItems = () => {
  //Displays Items from localStorage to DOM
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  //reloads the UI so filter and clear all button are displayed as well
  checkUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate Input
  if (newItem === '') {
    alert('Please add an Item');
    return;
  }

  //Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
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

const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  //add new item to localStorage Array
  itemsFromStorage.push(item);

  //convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemsFromStorage = () => {
  let itemsFromStorage;
  //if theres nothing in local storage so we set items from storage to an empty array
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    //if items are in storage we parse them
    //converting them from a string to an array and putting those items into the itemsFromStorage variable
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
};

const setItemToEdit = (item) => {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((i) => {
    i.classList.remove('edit-mode');
  });

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
};

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    // //icon > button > li = remove
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const removeItem = (item) => {
  if (confirm('Are You Sure?')) {
    //The item being passed in is the e.target.parentElement.parentElement
    //Remove Item from DOM
    item.remove();

    //Remove Item from localStorage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
};

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  //Filter out item to be removed
  //Will return a new array with the deleted item removed
  itemsFromStorage = itemsFromStorage.filter((i) => {
    if (i !== item) {
      return i;
    }
  });

  //re-set to localstorage with the item we want to remove, removed

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const clearItems = (e) => {
  //While ul has a first child which is an li
  while (itemList.firstChild) {
    //removing itemList first child which is the li
    //then pass in the first child (ul.li) whole
    itemList.removeChild(itemList.firstChild);
  }
  //Clear from localStorage
  localStorage.removeItem('items');
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
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
};

//Initialize app so event listeners aren't in the global scope
//The less functions in the global scope the better

const init = () => {
  //Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  //Loads items when the DOM is loaded
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
