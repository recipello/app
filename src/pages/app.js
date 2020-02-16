import React from 'react';
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import RecipeCard from "../components/recipeCard";
import apiService from "../helpers/apiService";

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
        <HomepageStyled>
            <InnerLiningStyled>
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
            </InnerLiningStyled>
        </HomepageStyled>
    );
}

const HomepageStyled = styled.div`
    flex-grow: 1;
    position: relative;

    .description-parsed,
    .name-parsed {
        cursor: pointer;
        transition: background .2s;
        padding: 10px 10px 1px;
        border-radius: 4px;
        margin: 0 0 10px;
        display: block;
    }

    .description-parsed.no-hover:hover,
    .name-parsed.no-hover:hover {
        cursor: auto;
        background: none;
    }

    .name-parsed {
        padding-bottom: 10px;
    }

    .description-parsed h2 {
        margin: 0 0 10px;
    }

    .description-parsed:hover,
    .name-parsed:hover {
        background: #E3E2E6;
    }

    .description-marked,
    .name-marked {
        border: none;
        background: #E3E2E6;
        transition: background .2s;
        padding: 10px;
        border-radius: 4px;
        margin: 0 0 10px;
        font-family: 'Inconsolata', monospace;
        resize: none;
        font-size: 18px;
        width: 100%;
        display: none;
    }

    .name-marked {
        font-family: 'Open Sans', sans-serif;
        font-size: 24px;
        font-weight: 700;
    }

    .description-marked:focus {
        outline: none;
    }

    .card.empty {
        background: #EAEAED;
        cursor: pointer;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
    }
`;

const InnerLiningStyled = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 20px;

    display: flex;
    flex-wrap: wrap;
    overflow-x: scroll;
`;

export default App;
