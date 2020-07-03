//////////////////// REMINDER /////////////////////////
// export const add = (a,b)=>a+b;
// export const multiply = (a,b)=>a*b;
// export const ID = 23;
//////////////////////////////////////////////////////

// import f-object with querySelectors
import {elements} from './base';

// get value from element
export const getInput = () =>{
  return elements.searchInput.value;
};

// clear input field
export const clearInput = () =>{
    elements.searchInput.value = '';
};

// clear html element of elements results
export const clearResults = ()=>{
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML='';
};

export const highlightSelected = (id)=>{
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el=>{
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

// get result and send to display function renderRecipe(el)
export const renderResults = (recipes,page=1,resPerPage=10) =>{
    const start = (page-1)*resPerPage;
    const end = page*resPerPage;

    recipes.slice(start,end).forEach(el => renderRecipe(el));

    renderButtons(page,recipes.length,resPerPage);
};

const createButton = (page,type)=>{
      return ` 
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'?page-1:page+1}>
            <span>Page ${type === 'prev'?page-1:page+1}</span>    
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type==='prev' ? 'left':'right'}"></use>
            </svg>
            
        </button>`;
};

const renderButtons = (page,numResults,resPerPage)=>{
    const pages = Math.ceil(numResults/resPerPage);

    let button;
    if(page===1 && pages>1){
        // only button next
        button=createButton(page,'next');
    }else if(page===pages && pages>1){
        // only button previous
        button=createButton(page,'prev');
    }else if(page<pages){
        // both buttons
        button=`${createButton(page,'next')}
                ${createButton(page,'prev')}
                `;
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

// display function for recipes
const renderRecipe = (recipe) =>{
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;

    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

// limit text of titles
export const limitRecipeTitle = (title,limit=17)=>{
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc,cur)=>{
            if(acc + cur.length <= limit){
                // push to array if is lower than limit
                newTitle.push(cur);
            }
            // return to acc. acc = acc+cur.length
            return acc+cur.length;
        },0);

        // return newTitle implode array to string 
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};