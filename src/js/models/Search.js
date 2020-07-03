// REMINDER
// export default "I am an imported string.";

// Axios replace fetch()
import axios from 'axios';

export default class Search{

    constructor(query){
        this.query = query;
    }

    async getResults(){
        // const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
        // API from page
        const apiPage = 'https://forkify-api.herokuapp.com/api/search?&q=';  
        console.log(`${apiPage}${this.query}`);

        try {
            // request axios();
            const res=await axios(`${apiPage}${this.query}`);
            // recipes from requests
            this.result = res.data.recipes;
            // console.log(this.result);      
        } catch (error) {
            alert(error);
        }        
    }
}

