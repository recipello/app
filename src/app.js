import React from 'react';
import { useHistory } from "react-router-dom";
import RecipeCard from "./recipeCard";
import apiService from "./apiService";
import './app.css';

function App(props) {
    const { token } = props;
    const [ recipes, setRecipes ] = React.useState([]);
    const history = useHistory();

    function getRecipes () {
        const handleSuccess = ( res ) => {
            setRecipes( res.recipes )
        }

        const handleError = (err) => {
            console.log(err);
        }

        apiService({
            path: "/api/recipes"
        }).then( handleSuccess, handleError ).catch(() => {});
    }

    React.useEffect( () => {
        const handleSuccess = ( res ) => {
            setRecipes( res.recipes );
        }

        const handleError = (err) => {
            console.log(err);
        }

        apiService({
            path: "/api/recipes"
        }).then( handleSuccess, handleError );
    }, [token] );

    const handleCreateNewRecipe = () => {
        const newRecipe = {
            name: "recipe title",
            description: "recipe description",
            coverPhoto: "",
            steps: []
        };

        const handleSuccess = ( res ) => {
            history.push( `/r/${ res.recipe._id }` );
        }

        const handleError = (err) => {
            console.log(err);
        }

        apiService({
            path: "/api/recipes",
            method: "POST",
            body: newRecipe,
        }).then( handleSuccess, handleError );
    }
  return (
      <>
        <div className="container-homepage">
            <div className="inner-lining">
                {
                    recipes.map( (recipe, index) => (
                      <RecipeCard
                        key={ index }
                          recipeProps={ recipe }
                          index={ index }
                          getRecipes={ getRecipes }
                          token={ token }
                      />
                    ) )
                }
                {
                    token && (
                        <div className="card empty" onClick={ () => handleCreateNewRecipe() }>
                          <p>Add Recipe</p>
                        </div>
                    )
                }
            </div>
        </div>
      </>
  );
}

export default App;
