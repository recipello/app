import React from 'react';
import { useHistory, Link } from "react-router-dom";
import RecipeCard from "./recipeCard";
import './app.css';

function App(props) {
    const { token, user } = props;
    const [ recipes, setRecipes ] = React.useState([]);
    const history = useHistory();
    
    function getRecipes () {
        const url = "http://localhost:3001/api/recipes";
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        };

        const handleSuccess = ( res ) => {
            setRecipes( res.recipes )
        }

        const handleError = () => {

        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    React.useEffect( () => {
        getRecipes();
    }, [] );

    const handleCreateNewRecipe = () => {
        const url = "http://localhost:3001/api/recipes";
        const newRecipe = {
            name: "recipe title",
            description: "recipe description",
            coverPhoto: "",
            steps: []
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem( "token" )
            },
            body: JSON.stringify( newRecipe ),
        };

        const handleSuccess = ( res ) => {
            history.push( `/r/${ res.recipe._id }` )
        }

        const handleError = () => {

        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }
  return (
      <>
        <div className="container-homepage">
              {recipes.map( (recipe, index) => (
                  <RecipeCard
                    key={ index }
                      recipeProps={ recipe }
                      index={ index }
                      getRecipes={ getRecipes }
                      token={ token }
                  />
              ) )}
            {
                token && (
                    <div className="card empty" onClick={ () => handleCreateNewRecipe() }>
                      <p>Add Recipe</p>
                    </div>
                )
            }
        </div>
      </>
  );
}

export default App;