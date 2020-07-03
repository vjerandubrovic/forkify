// GLOBAL APP CONTROLLER

//////////////////// REMIDER ////////////////////////////
// import str from "./models/Search";

// import {add as a,multiply as m,ID} from "./views/searchView";
// console.log(`Using imported functions! ${a(ID,2)} and ${m(3,5)}. ${str}`);

// import * as searchView from "./views/searchView";
// console.log(`Using imported functions! ${searchView.add(searchView.ID,2)} and ${searchView.multiply(3,5)}. ${str}`);
///////////////////////////////////////////////////////////////////////

// import OBJECT List
import Likes from './models/Likes';
// import functions from searchView
import * as likesView from './views/likesView';
// import OBJECT List
import List from './models/List';
// import functions from searchView
import * as listView from './views/listView'
// import OBJECT Recipe
import Recipe from './models/Recipe';
// import functions from searchView
import * as recipeView from './views/recipeView'
// import OBJECT Search
import Search from './models/Search';
// import functions from searchView
import * as searchView from './views/searchView'
// import f-object with querySelectors
import {elements,renderLoader,clearLoader} from './views/base';

/////////////// GLOBAL STATE OF THE APP ///////////////////
const state = {};
window.state = state;
/////////////// SEARCH CONTROLLER/////////////////////
const controlSearch=async()=>{
    // get query
    const query = searchView.getInput();
    console.log(query);
    if(query){
        // search new object
        state.search = new Search(query);

        // prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // search for recipes
            await state.search.getResults();

            // display results on UI
            clearLoader();
            searchView.renderResults(state.search.result);    
        } catch (error) {
            alert('Something went wrong');
            clearLoader();
        }

    }
}

// on submit
elements.searchForm.addEventListener('submit',(e)=>{
    // prevent refresh
    e.preventDefault();
    // start function
    controlSearch();
});

elements.searchResPages.addEventListener('click', (e)=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
        console.log(goToPage);
    }
    
});

///////////////////// RECIPE CONTROLLER ///////////////////////

['hashchange','load'].forEach(event =>window.addEventListener(event,(e)=>{
    controlRecipe();
}));

elements.recipe.addEventListener('click', (e)=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        } 
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc'); 
        recipeView.updateServingsIngredients(state.recipe);     
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});

const controlRecipe = async()=>{
    // get hash and replace # with '';
    const id = window.location.hash.replace('#','');

    if(id){
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight
        if(state.search){
            searchView.highlightSelected(id);
        }
        
        
        state.recipe = new Recipe(id);

        try {
            
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            state.recipe.calcTime();
            state.recipe.calcServings();

            clearLoader();
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
        } catch (error) {
            alert(error);
            console.log(error);
        }
        
    }
};

///////////////////// LIST CONTROLLER ////////////////////

const controlList = () =>{
    if(!state.list){
        state.list = new List();
    }

    state.recipe.ingredients.forEach(el =>{
       const item = state.list.addItem(el.count,el.unit,el.ingredient);
       listView.renderItem(item);
    });
}

elements.shopping.addEventListener('click',(e)=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);

        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value, .shopping__count-value *')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }
});

/////////////////////// LIKE CONTROLLER /////////////////


const controlLike = ()=>{
    if(!state.likes){
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;

    if(!state.likes.isLiked(currentID)){
        const newLike = state.likes.addLike(currentID,state.recipe.title,state.recipe.author,state.recipe.img);
        
        likesView.toggleLikeBtn(true);

        likesView.renderLike(newLike);
        
    }else{
        state.likes.deleteLike(currentID);

        likesView.toggleLikeBtn(false);

        likesView.deleteLike(currentID);
        
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load',()=>{
    
    state.likes = new Likes();
    
    state.likes.readStorage();
    
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(like => likesView.renderLike(like));
});